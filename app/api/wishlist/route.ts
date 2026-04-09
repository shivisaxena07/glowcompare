import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getClient(authHeader: string | null) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, anonKey, {
    global: { headers: { Authorization: authHeader ?? '' } },
    auth: { persistSession: false },
  })
}

// GET /api/wishlist — returns user's saved products with prices
export async function GET(req: NextRequest) {
  const supabase = getClient(req.headers.get('Authorization'))

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('wishlist')
    .select(`
      id,
      product_id,
      alert_price,
      alert_active,
      created_at,
      products (
        id, name, brand, category, sub_category,
        image_url, trending_score,
        platform_prices ( platform, price, original_price, discount_pct, url, availability )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// POST /api/wishlist — body: { product_id }
export async function POST(req: NextRequest) {
  const supabase = getClient(req.headers.get('Authorization'))

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const { product_id } = await req.json()
  if (!product_id) {
    return NextResponse.json({ error: 'product_id required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('wishlist')
    .insert({ user_id: user.id, product_id })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}

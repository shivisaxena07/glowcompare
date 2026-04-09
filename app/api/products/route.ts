import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/src/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const q = searchParams.get('q')?.trim()
  const category = searchParams.get('category')
  const subCategories = searchParams.get('sub_category')?.split(',').filter(Boolean) ?? []
  const brands = searchParams.get('brand')?.split(',').filter(Boolean) ?? []
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '12')))

  let query = supabase
    .from('products')
    .select('id, name, brand, category, sub_category, image_url, trending_score, platform_prices(*)')

  if (q && q.length >= 2) {
    query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%`)
  }

  if (category === 'skincare' || category === 'makeup') {
    query = query.eq('category', category)
  }

  if (subCategories.length > 0) {
    query = query.in('sub_category', subCategories)
  }

  if (brands.length > 0) {
    query = query.in('brand', brands)
  }

  query = query.order('trending_score', { ascending: false })

  const offset = (page - 1) * limit
  query = query.range(offset, offset + limit - 1)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ products: data ?? [] })
}

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
})

interface SeedPlatformPrice {
  platform: string
  price: number
  original_price: number
  discount_pct: number
  url: string
  availability: boolean
}

interface SeedTrendingSignals {
  social_score: number
  bestseller_score: number
  rating_score: number
  search_score: number
  editorial_score: number
  composite_score: number
}

interface SeedProduct {
  id: string
  name: string
  brand: string
  category: string
  sub_category: string
  description: string
  image_url: string
  ingredients_summary: string
  trending_score: number
  platform_prices: SeedPlatformPrice[]
  trending_signals: SeedTrendingSignals
}

async function seed() {
  const raw = readFileSync(join(__dirname, '../data/seed/products.json'), 'utf-8')
  const products: SeedProduct[] = JSON.parse(raw)

  console.log(`Seeding ${products.length} products...`)

  // ── 1. Clear existing data (order matters: children before parents) ──
  await supabase.from('wishlist').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('trending_signals').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('platform_prices').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  console.log('Cleared existing data.')

  // ── 2. Insert products ──
  const productRows = products.map(({ platform_prices: _, trending_signals: __, ...p }) => p)
  const { error: productError } = await supabase.from('products').insert(productRows)
  if (productError) {
    console.error('Error inserting products:', productError.message)
    process.exit(1)
  }
  console.log(`Inserted ${productRows.length} products.`)

  // ── 3. Insert platform_prices ──
  const priceRows = products.flatMap((p) =>
    p.platform_prices.map((pp) => ({ ...pp, product_id: p.id }))
  )
  const { error: priceError } = await supabase.from('platform_prices').insert(priceRows)
  if (priceError) {
    console.error('Error inserting platform_prices:', priceError.message)
    process.exit(1)
  }
  console.log(`Inserted ${priceRows.length} platform price rows.`)

  // ── 4. Insert trending_signals ──
  const signalRows = products.map((p) => ({ ...p.trending_signals, product_id: p.id }))
  const { error: signalError } = await supabase.from('trending_signals').insert(signalRows)
  if (signalError) {
    console.error('Error inserting trending_signals:', signalError.message)
    process.exit(1)
  }
  console.log(`Inserted ${signalRows.length} trending signal rows.`)

  console.log('Seed complete.')
}

seed()

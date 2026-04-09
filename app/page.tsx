import { Info } from 'lucide-react'
import { supabase } from '@/src/lib/supabase'
import { HeroSpotlight } from '@/components/hero-spotlight'
import { ProductGrid } from '@/components/product-grid'
import { TrendingThisWeek } from '@/components/trending-this-week'
import { ScoreMarquee } from '@/components/ScoreMarquee'
import type { ProductWithPrices } from '@/src/types'

async function getTrendingProducts(): Promise<ProductWithPrices[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, platform_prices(*)')
    .order('trending_score', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error.message)
    return []
  }

  return data as ProductWithPrices[]
}

export default async function HomePage() {
  const products = await getTrendingProducts()

  return (
    <main className="min-h-screen bg-[#FAFAF8]">

      {/* Trending score marquee — full-width ticker */}
      <ScoreMarquee />

      {/* Hero spotlight — #1 trending product */}
      {products[0] && <HeroSpotlight product={products[0]} />}

      {/* Trending spotlight — full bleed, black */}
      <TrendingThisWeek products={products} />

      {/* Browse section */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-glow-black">Browse All</h2>
            <p className="mt-0.5 text-sm font-medium text-stone-400">
              {products.length} products · sorted by trending score
            </p>
          </div>
          <span
            className="hidden items-center gap-1 text-xs font-medium text-stone-400 sm:flex"
            title="Prices are illustrative. Visit platforms for live prices."
          >
            Sample data — updated weekly
            <Info className="h-3 w-3 shrink-0" />
          </span>
        </div>

        <ProductGrid products={products} />

      </div>
    </main>
  )
}

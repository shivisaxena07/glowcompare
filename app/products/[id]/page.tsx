import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, Flame } from 'lucide-react'
import type { Metadata } from 'next'
import { supabase } from '@/src/lib/supabase'
import { PriceComparisonTable } from '@/components/price-comparison-table'
import { TrendingBreakdown } from '@/components/trending-breakdown'
import { WishlistButton } from '@/components/wishlist-button'
import { getBestPrice, formatPrice } from '@/lib/utils'
import type { ProductWithAll } from '@/src/types'

const SUB_CATEGORY_LABELS: Record<string, string> = {
  cleanser: 'Cleanser', moisturiser: 'Moisturiser', serum: 'Serum',
  sunscreen: 'Sunscreen', toner: 'Toner', eye_cream: 'Eye Cream',
  foundation: 'Foundation', concealer: 'Concealer', blush: 'Blush',
  lipstick: 'Lipstick', mascara: 'Mascara', eyeshadow: 'Eyeshadow',
}

async function getProduct(id: string): Promise<ProductWithAll | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, platform_prices(*), trending_signals(*)')
    .eq('id', id)
    .single()

  if (error || !data) return null
  return data as ProductWithAll
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  if (!product) return { title: 'Product not found — GlowCompare' }

  return {
    title: `${product.name} by ${product.brand} — GlowCompare`,
    description: product.description,
    openGraph: {
      title: `${product.name} — GlowCompare`,
      description: product.description,
      images: [{ url: product.image_url, width: 400, height: 400 }],
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) notFound()

  const signals = product.trending_signals[0] ?? null
  const bestPrice = getBestPrice(product.platform_prices)

  const trendColor =
    product.trending_score >= 80
      ? 'bg-red-100 text-red-600'
      : product.trending_score >= 50
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-stone-100 text-stone-500'

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-stone-400">
          <Link href="/" className="hover:text-stone-600 transition-colors duration-150">Home</Link>
          <span>/</span>
          <Link
            href={`/category/${product.category}`}
            className="capitalize hover:text-stone-600 transition-colors duration-150"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="truncate text-stone-600">{product.name}</span>
        </nav>

        {/* Hero — image + info */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

          {/* Product image */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm">
            <Image
              src={product.image_url}
              alt={`${product.brand} ${product.name}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Product info */}
          <div className="flex flex-col">

            {/* Sub-category + brand */}
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-stone-500">
                {SUB_CATEGORY_LABELS[product.sub_category] ?? product.sub_category}
              </span>
              <span className="text-xs text-stone-400">·</span>
              <span className="text-xs font-semibold text-stone-500">{product.brand}</span>
            </div>

            {/* Product name */}
            <h1 className="mt-3 text-2xl font-bold leading-snug text-stone-900 sm:text-3xl">
              {product.name}
            </h1>

            {/* Trending badge */}
            <div className="mt-3">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${trendColor}`}>
                <Flame className="h-4 w-4" />
                Trend Score {Math.round(product.trending_score)}
              </span>
            </div>

            {/* Best price summary */}
            {bestPrice && (
              <div className="mt-5 rounded-2xl bg-green-50 px-5 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-green-600">Best Price</p>
                <p className="mt-1 text-3xl font-bold text-green-700">{formatPrice(bestPrice.price)}</p>
                <p className="mt-0.5 text-sm text-green-600 capitalize">on {bestPrice.platform}</p>
              </div>
            )}

            {/* Description */}
            <p className="mt-5 text-sm leading-relaxed text-stone-600">{product.description}</p>

            <WishlistButton productId={product.id} />

            {/* Back link */}
            <Link
              href={`/category/${product.category}`}
              className="mt-4 inline-flex items-center gap-1 self-start text-xs font-semibold text-stone-400 transition-colors duration-150 hover:text-stone-600"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Back to {product.category}
            </Link>
          </div>
        </div>

        {/* Price Comparison Table */}
        <section className="mt-10">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-bold text-stone-900">Compare Prices</h2>
            <p className="text-xs text-stone-400">Sample data — last updated April 2026</p>
          </div>
          <PriceComparisonTable prices={product.platform_prices} productName={product.name} />
        </section>

        {/* Ingredients Summary */}
        <section className="mt-8 rounded-2xl border border-stone-200 bg-white px-5 py-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-stone-500">Key Ingredients</h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-700">{product.ingredients_summary}</p>
        </section>

        {/* Trending Breakdown */}
        {signals && (
          <section className="mt-4">
            <TrendingBreakdown signals={signals} compositeScore={product.trending_score} />
          </section>
        )}

      </div>
    </main>
  )
}

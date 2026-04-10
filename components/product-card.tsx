'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, Flame, TrendingUp } from 'lucide-react'
import { formatPrice, getBestPrice } from '@/lib/utils'
import type { ProductWithPrices } from '@/src/types'

const PLATFORM_LABELS: Record<string, string> = {
  nykaa: 'Nykaa',
  tira: 'Tira',
  amazon: 'Amazon',
  flipkart: 'Flipkart',
  purplle: 'Purplle',
}

const PLATFORM_ORDER = ['nykaa', 'tira', 'amazon', 'flipkart', 'purplle']

const SUB_CATEGORY_LABELS: Record<string, string> = {
  cleanser: 'Cleanser',
  moisturiser: 'Moisturiser',
  serum: 'Serum',
  sunscreen: 'Sunscreen',
  toner: 'Toner',
  eye_cream: 'Eye Cream',
  foundation: 'Foundation',
  concealer: 'Concealer',
  blush: 'Blush',
  lipstick: 'Lipstick',
  mascara: 'Mascara',
  eyeshadow: 'Eyeshadow',
}

// Hot 80–100 = pink  |  Rising 50–79 = amber  |  Neutral <50 = stone
function TrendingBadge({ score }: { score: number }) {
  if (score >= 80) {
    return (
      <span className="inline-flex items-center gap-1 bg-glow-primary px-2 py-0.5 text-xs font-bold text-white">
        <Flame className="h-3 w-3" />
        {Math.round(score)}
      </span>
    )
  }
  if (score >= 50) {
    return (
      <span className="inline-flex items-center gap-1 bg-amber-400 px-2 py-0.5 text-xs font-bold text-glow-black">
        <TrendingUp className="h-3 w-3" />
        {Math.round(score)}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 bg-stone-200 px-2 py-0.5 text-xs font-bold text-stone-600">
      {Math.round(score)}
    </span>
  )
}

interface ProductCardProps {
  product: ProductWithPrices
  isWishlisted?: boolean
  onWishlistToggle?: (productId: string) => void
}

export function ProductCard({
  product,
  isWishlisted = false,
  onWishlistToggle,
}: ProductCardProps) {
  const bestPrice = getBestPrice(product.platform_prices)

  // Back face data
  const priceMap = Object.fromEntries(product.platform_prices.map((p) => [p.platform, p]))
  const availablePrices = product.platform_prices.filter((p) => p.availability).map((p) => p.price)
  const lowestPrice = availablePrices.length > 0 ? Math.min(...availablePrices) : null

  function handleWishlistClick(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    onWishlistToggle?.(product.id)
  }

  return (
    /* Flip card wrapper — fixed height, relative so wishlist button can float above both faces */
    <div className="group relative" style={{ perspective: '1000px', height: '380px' }}>

      {/* Wishlist button — outside the flip div so it stays on top on both faces */}
      <button
        onClick={handleWishlistClick}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        className="absolute right-2 top-2 z-20 cursor-pointer border-2 border-glow-black bg-white p-1.5 transition-colors duration-150 hover:bg-glow-primary hover:text-white"
      >
        <Heart
          className={`h-3.5 w-3.5 transition-colors duration-150 ${
            isWishlisted ? 'fill-glow-primary text-glow-primary' : 'text-glow-black'
          }`}
        />
      </button>

      {/* Inner — rotates on hover */}
      <div className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">

        {/* ── FRONT ── */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <Link href={`/products/${product.id}`} className="block h-full">
            <div className="relative flex h-full flex-col border-2 border-glow-black bg-white">

              {/* Image */}
              <div className="relative h-44 shrink-0 overflow-hidden border-b-2 border-glow-black">
                <Image
                  src={product.image_url}
                  alt={`${product.brand} ${product.name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLImageElement).src =
                      'https://placehold.co/400x400/f5f5f4/a8a29e?text=No+Image'
                  }}
                />

                {/* Trending badge — top left */}
                <div className="absolute left-0 top-3">
                  <TrendingBadge score={product.trending_score} />
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-1 flex-col p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  {SUB_CATEGORY_LABELS[product.sub_category] ?? product.sub_category}
                </p>
                <p className="mt-0.5 text-xs font-bold text-stone-500">{product.brand}</p>
                <h3 className="mt-0.5 line-clamp-2 text-sm font-bold leading-snug text-glow-black">
                  {product.name}
                </h3>

                {/* Price row */}
                <div className="mt-auto flex items-end justify-between gap-1 pt-2">
                  {bestPrice ? (
                    <>
                      <span className="font-display text-lg font-bold leading-none text-glow-black">
                        {formatPrice(bestPrice.price)}
                      </span>
                      <span className="mb-0.5 shrink-0 border border-glow-primary px-1.5 py-0.5 text-[10px] font-bold text-glow-primary">
                        {PLATFORM_LABELS[bestPrice.platform]}
                      </span>
                    </>
                  ) : (
                    <p className="text-xs font-medium text-stone-400">Unavailable</p>
                  )}
                </div>
              </div>

            </div>
          </Link>
        </div>

        {/* ── BACK ── */}
        <div className="absolute inset-0 flex flex-col border-2 border-glow-black bg-white p-3 [backface-visibility:hidden] [transform:rotateY(180deg)]">

          {/* Heading */}
          <h3 className="mb-2 font-display text-sm font-bold text-glow-black">
            💰 Price Comparison
          </h3>

          {/* Price table */}
          <div className="flex-1 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b-2 border-glow-black">
                  <th className="pb-1.5 text-left font-bold text-stone-500 uppercase tracking-wide">Platform</th>
                  <th className="pb-1.5 text-right font-bold text-stone-500 uppercase tracking-wide">Price</th>
                  <th className="pb-1.5 text-right font-bold text-stone-500 uppercase tracking-wide">Off</th>
                </tr>
              </thead>
              <tbody>
                {PLATFORM_ORDER.map((platform) => {
                  const p = priceMap[platform]
                  const price = p?.price ?? null
                  const isLowest = price !== null && p?.availability && price === lowestPrice
                  const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(product.name)}+on+${PLATFORM_LABELS[platform]}`

                  return (
                    <tr
                      key={platform}
                      className={`border-b border-stone-100 ${isLowest ? 'bg-glow-primary/10' : ''}`}
                    >
                      <td className="py-1.5 pr-2">
                        <a
                          href={searchUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className={`font-bold underline-offset-2 hover:underline ${
                            isLowest ? 'text-glow-primary' : 'text-glow-black'
                          }`}
                        >
                          {PLATFORM_LABELS[platform]}
                        </a>
                      </td>
                      <td className={`py-1.5 text-right font-bold ${isLowest ? 'text-glow-primary' : 'text-stone-700'}`}>
                        {price !== null ? formatPrice(price) : '—'}
                      </td>
                      <td className="py-1.5 text-right text-stone-400">
                        {p?.discount_pct ? `${Math.round(p.discount_pct)}%` : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* View Details button */}
          <Link
            href={`/products/${product.id}`}
            className="mt-2 block border-2 border-glow-black bg-glow-black py-2 text-center text-xs font-bold text-white transition-colors duration-150 hover:border-glow-primary hover:bg-glow-primary"
          >
            View Details →
          </Link>
        </div>

      </div>
    </div>
  )
}

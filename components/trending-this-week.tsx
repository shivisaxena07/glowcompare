'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Flame, TrendingUp } from 'lucide-react'
import { formatPrice, getBestPrice } from '@/lib/utils'
import type { ProductWithPrices } from '@/src/types'

const PLATFORM_LABELS: Record<string, string> = {
  nykaa: 'Nykaa', tira: 'Tira', amazon: 'Amazon',
  flipkart: 'Flipkart', purplle: 'Purplle',
}

const LAST_UPDATED = 'April 2026'

function TrendingBadge({ score }: { score: number }) {
  if (score >= 80) {
    return (
      <span className="inline-flex items-center gap-1 bg-glow-primary px-2 py-0.5 text-[10px] font-bold text-white">
        <Flame className="h-2.5 w-2.5" />{Math.round(score)}
      </span>
    )
  }
  if (score >= 50) {
    return (
      <span className="inline-flex items-center gap-1 bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-glow-black">
        <TrendingUp className="h-2.5 w-2.5" />{Math.round(score)}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 bg-white/30 px-2 py-0.5 text-[10px] font-bold text-white">
      {Math.round(score)}
    </span>
  )
}

function TrendingCard({ product, rank }: { product: ProductWithPrices; rank: number }) {
  const bestPrice = getBestPrice(product.platform_prices)

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block w-40 shrink-0 sm:w-48"
    >
      <div className="border-2 border-white bg-white transition-all duration-150 group-hover:-translate-y-0.5 group-hover:border-glow-primary group-hover:shadow-[4px_4px_0px_rgba(0,0,0,0.4)]">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden border-b-2 border-white group-hover:border-glow-primary">
          {/* Rank number — bold top-left */}
          <span className="absolute left-0 top-0 z-10 bg-glow-black px-2 py-0.5 font-display text-sm font-bold text-white leading-snug">
            #{rank}
          </span>

          <Image
            src={product.image_url}
            alt={`${product.brand} ${product.name}`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="192px"
            onError={(e) => {
              ;(e.currentTarget as HTMLImageElement).src =
                'https://placehold.co/400x400/f5f5f4/a8a29e?text=No+Image'
            }}
          />

          {/* Trending badge — bottom left */}
          <div className="absolute bottom-2 left-0">
            <TrendingBadge score={product.trending_score} />
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="truncate text-[10px] font-bold uppercase tracking-widest text-stone-400">
            {product.brand}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs font-bold leading-snug text-glow-black">
            {product.name}
          </p>
          {bestPrice ? (
            <div className="mt-2 flex items-end justify-between gap-1">
              <span className="font-display text-sm font-bold leading-none text-glow-black">
                {formatPrice(bestPrice.price)}
              </span>
              <span className="mb-0.5 shrink-0 border border-glow-primary px-1 py-0.5 text-[9px] font-bold text-glow-primary">
                {PLATFORM_LABELS[bestPrice.platform]}
              </span>
            </div>
          ) : (
            <p className="mt-2 text-xs font-medium text-stone-400">Unavailable</p>
          )}
        </div>
      </div>
    </Link>
  )
}

interface TrendingThisWeekProps {
  products: ProductWithPrices[]
}

export function TrendingThisWeek({ products }: TrendingThisWeekProps) {
  const top6 = products.slice(0, 6)

  return (
    <section className="border-y-[3px] border-glow-black bg-glow-black px-5 py-6 sm:px-8 sm:py-8">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
        <div className="flex items-center gap-3">
          <Flame className="h-6 w-6 text-glow-primary" />
          <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Trending This Week
          </h2>
        </div>
        <p className="text-xs font-medium text-white/40">
          Sample data — last updated {LAST_UPDATED}
        </p>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {top6.map((product, i) => (
          <TrendingCard key={product.id} product={product} rank={i + 1} />
        ))}
      </div>
    </section>
  )
}

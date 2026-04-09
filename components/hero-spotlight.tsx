'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Flame, ArrowRight } from 'lucide-react'
import { getBestPrice, formatPrice } from '@/lib/utils'
import type { ProductWithPrices } from '@/src/types'

const PLATFORM_LABELS: Record<string, string> = {
  nykaa: 'Nykaa', tira: 'Tira', amazon: 'Amazon',
  flipkart: 'Flipkart', purplle: 'Purplle',
}

interface HeroSpotlightProps {
  product: ProductWithPrices
}

export function HeroSpotlight({ product }: HeroSpotlightProps) {
  const bestPrice = getBestPrice(product.platform_prices)

  return (
    <section className="border-b-[3px] border-glow-black bg-[#FAFAF8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">

          {/* ── Left: product image block ── */}
          <div className="relative flex items-end justify-center bg-glow-primary border-b-[3px] border-glow-black lg:border-b-0 lg:border-r-[3px] py-10 px-8 overflow-hidden min-h-[320px]">

            {/* Big faded rank number — background texture */}
            <span className="absolute right-4 bottom-0 font-display font-700 text-[200px] leading-none text-black/10 select-none pointer-events-none">
              1
            </span>

            {/* #1 badge */}
            <div className="absolute top-6 left-6 bg-glow-black px-3 py-1.5 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-glow-primary" />
              <span className="font-display font-700 text-xs text-white uppercase tracking-widest">
                #1 Trending
              </span>
            </div>

            {/* Product image */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 border-[3px] border-glow-black bg-white shadow-[8px_8px_0px_#0F172A]">
              <Image
                src={product.image_url}
                alt={`${product.brand} ${product.name}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 256px, 320px"
                priority
                onError={(e) => {
                  ;(e.currentTarget as HTMLImageElement).src =
                    'https://placehold.co/400x400/f5f5f4/a8a29e?text=No+Image'
                }}
              />
            </div>
          </div>

          {/* ── Right: content ── */}
          <div className="flex flex-col justify-center px-8 py-10 sm:px-12">

            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-5">
              <span className="bg-glow-black text-white font-display font-700 text-[11px] uppercase tracking-[0.15em] px-3 py-1">
                🔥 #1 Trending Right Now
              </span>
            </div>

            {/* Brand */}
            <p className="text-xs font-bold uppercase tracking-widest text-stone-400 mb-1">
              {product.brand}
            </p>

            {/* Product name */}
            <h1 className="font-display font-700 text-3xl sm:text-4xl lg:text-[42px] leading-[1.1] text-glow-black">
              {product.name}
            </h1>

            {/* Trending score — big and proud */}
            <div className="mt-6 flex items-center gap-3">
              <div className="border-[3px] border-glow-black bg-glow-primary px-4 py-2 flex items-center gap-2">
                <Flame className="h-5 w-5 text-white" />
                <span className="font-display font-700 text-2xl text-white leading-none">
                  {Math.round(product.trending_score)}
                </span>
              </div>
              <span className="text-sm font-600 text-stone-500">Trend Score</span>
            </div>

            {/* Best price */}
            {bestPrice && (
              <div className="mt-5 flex items-center gap-3">
                <span className="font-display font-700 text-3xl text-glow-black">
                  {formatPrice(bestPrice.price)}
                </span>
                <span className="border-2 border-glow-black bg-white px-2.5 py-1 text-xs font-display font-700 text-glow-black">
                  Best on {PLATFORM_LABELS[bestPrice.platform]}
                </span>
              </div>
            )}

            {/* Description teaser */}
            <p className="mt-4 text-sm leading-relaxed text-stone-500 line-clamp-2 max-w-md">
              {product.description}
            </p>

            {/* CTA */}
            <div className="mt-7 flex items-center gap-3">
              <Link
                href={`/products/${product.id}`}
                className="inline-flex items-center gap-2 bg-glow-black text-white font-display font-700 text-sm px-6 py-3 border-[3px] border-glow-black hover:bg-glow-primary hover:border-glow-primary transition-colors"
              >
                View Product
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/category/skincare"
                className="text-sm font-600 text-stone-400 hover:text-glow-black transition-colors underline underline-offset-4"
              >
                Browse all
              </Link>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

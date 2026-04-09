import { ExternalLink, Info } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import type { PlatformPrice, Platform } from '@/src/types'

const PLATFORM_ORDER: Platform[] = ['nykaa', 'tira', 'amazon', 'flipkart', 'purplle']

const PLATFORM_META: Record<Platform, { name: string; color: string }> = {
  nykaa:    { name: 'Nykaa',    color: '#FC2779' },
  tira:     { name: 'Tira',     color: '#1A1A1A' },
  amazon:   { name: 'Amazon',   color: '#FF9900' },
  flipkart: { name: 'Flipkart', color: '#2874F0' },
  purplle:  { name: 'Purplle',  color: '#7B2D8B' },
}

function getBestPriceValue(prices: PlatformPrice[]): number | null {
  const available = prices.filter((p) => p.availability)
  if (available.length === 0) return null
  return Math.min(...available.map((p) => p.price))
}

interface PriceComparisonTableProps {
  prices: PlatformPrice[]
  productName: string
}

export function PriceComparisonTable({ prices, productName }: PriceComparisonTableProps) {
  const priceMap = Object.fromEntries(prices.map((p) => [p.platform, p]))
  const bestPrice = getBestPriceValue(prices)

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-100 bg-stone-50">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
              Platform
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">
              Price
            </th>
            <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500 sm:table-cell">
              MRP
            </th>
            <th className="hidden px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500 sm:table-cell">
              Discount
            </th>
            <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-stone-500">
              Stock
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">
              &nbsp;
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {PLATFORM_ORDER.map((platform) => {
            const p = priceMap[platform]
            if (!p) return null

            const isBest = p.availability && p.price === bestPrice
            const isUnavailable = !p.availability

            return (
              <tr
                key={platform}
                className={`transition-colors duration-100 ${
                  isBest
                    ? 'border-l-4 border-l-green-500 bg-green-50/50'
                    : isUnavailable
                      ? 'opacity-50'
                      : 'hover:bg-stone-50'
                }`}
              >
                {/* Platform name */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-bold"
                      style={{ color: isUnavailable ? '#A8A29E' : PLATFORM_META[platform].color }}
                    >
                      {PLATFORM_META[platform].name}
                    </span>
                    {isBest && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                        Best Price
                      </span>
                    )}
                  </div>
                </td>

                {/* Current price */}
                <td className="px-4 py-3.5 text-right">
                  <span
                    className={`text-base font-bold ${
                      isBest ? 'text-green-700' : isUnavailable ? 'text-stone-400' : 'text-stone-900'
                    }`}
                  >
                    {formatPrice(p.price)}
                  </span>
                </td>

                {/* Original price */}
                <td className="hidden px-4 py-3.5 text-right sm:table-cell">
                  {p.original_price > p.price ? (
                    <span className="text-sm text-stone-400 line-through">
                      {formatPrice(p.original_price)}
                    </span>
                  ) : (
                    <span className="text-sm text-stone-300">—</span>
                  )}
                </td>

                {/* Discount */}
                <td className="hidden px-4 py-3.5 text-right sm:table-cell">
                  {p.discount_pct > 0 ? (
                    <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-semibold text-orange-600">
                      {Math.round(p.discount_pct)}% off
                    </span>
                  ) : (
                    <span className="text-sm text-stone-300">—</span>
                  )}
                </td>

                {/* Availability */}
                <td className="px-4 py-3.5 text-center">
                  <span
                    className={`inline-block h-2.5 w-2.5 rounded-full ${
                      p.availability ? 'bg-green-500' : 'bg-stone-300'
                    }`}
                    title={p.availability ? 'In stock' : 'Out of stock'}
                  />
                </td>

                {/* Visit button — Google search link */}
                <td className="px-4 py-3.5 text-right">
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(productName)}+on+${encodeURIComponent(PLATFORM_META[platform].name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Search ${PLATFORM_META[platform].name} for this product`}
                    className={`inline-flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                      isUnavailable
                        ? 'cursor-not-allowed border-stone-200 text-stone-400'
                        : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                    }`}
                    onClick={isUnavailable ? (e) => e.preventDefault() : undefined}
                  >
                    Visit
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Sample data footnote */}
      <div className="border-t border-stone-100 px-4 py-2.5">
        <span
          className="inline-flex items-center gap-1 text-xs text-stone-400"
          title="Prices are illustrative. Visit platforms for live prices."
        >
          Sample data — prices updated weekly
          <Info className="h-3 w-3 shrink-0" />
        </span>
      </div>
    </div>
  )
}

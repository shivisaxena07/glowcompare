import { ChevronDown } from 'lucide-react'
import type { TrendingSignals } from '@/src/types'

const SIGNALS = [
  { key: 'social_score',      label: 'Social Buzz',        weight: 30, description: 'Instagram & YouTube mentions' },
  { key: 'bestseller_score',  label: 'Bestseller Rank',    weight: 25, description: 'Platform bestseller lists' },
  { key: 'rating_score',      label: 'Ratings & Reviews',  weight: 20, description: 'Aggregate user ratings' },
  { key: 'search_score',      label: 'Search Volume',      weight: 15, description: 'Google Trends data' },
  { key: 'editorial_score',   label: 'Editorial Picks',    weight: 10, description: 'Influencer & press features' },
] as const

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80 ? 'bg-red-400' : score >= 50 ? 'bg-yellow-400' : 'bg-stone-300'

  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-stone-100">
        <div
          className={`h-full rounded-full ${color} transition-all duration-500`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="w-7 text-right text-xs font-semibold text-stone-600">{Math.round(score)}</span>
    </div>
  )
}

interface TrendingBreakdownProps {
  signals: TrendingSignals
  compositeScore: number
}

export function TrendingBreakdown({ signals, compositeScore }: TrendingBreakdownProps) {
  return (
    <details className="group rounded-2xl border border-stone-200 bg-white">
      <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 select-none">
        <div>
          <p className="text-sm font-semibold text-stone-900">Why is this trending?</p>
          <p className="mt-0.5 text-xs text-stone-400">
            Trend Score: <span className="font-bold text-violet-600">{Math.round(compositeScore)}</span>
            {' '}/ 100 — sample data
          </p>
        </div>
        <ChevronDown className="h-4 w-4 text-stone-400 transition-transform duration-200 group-open:rotate-180" />
      </summary>

      <div className="border-t border-stone-100 px-5 pb-5 pt-4">
        <div className="space-y-3.5">
          {SIGNALS.map(({ key, label, weight, description }) => {
            const score = signals[key]
            return (
              <div key={key} className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-medium text-stone-700">{label}</span>
                    <span className="text-xs text-stone-400">{weight}%</span>
                  </div>
                  <p className="text-xs text-stone-400">{description}</p>
                </div>
                <ScoreBar score={score} />
              </div>
            )
          })}
        </div>
      </div>
    </details>
  )
}

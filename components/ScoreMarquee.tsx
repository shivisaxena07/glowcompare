const SIGNALS = [
  { icon: '🔥', label: 'Social Buzz',        weight: '30%' },
  { icon: '📈', label: 'Bestseller Rank',     weight: '25%' },
  { icon: '⭐', label: 'Ratings & Reviews',   weight: '20%' },
  { icon: '🔍', label: 'Search Volume',       weight: '15%' },
  { icon: '✨', label: 'Editorial Picks',     weight: '10%' },
]

const SEPARATOR = (
  <span className="shrink-0 px-6 text-glow-primary select-none" aria-hidden>✦</span>
)

function SignalPill({ icon, label, weight }: typeof SIGNALS[0]) {
  return (
    <span className="shrink-0 flex items-center gap-2">
      <span className="text-sm">{icon}</span>
      <span className="font-display font-700 text-xs uppercase tracking-widest text-white">
        {label}
      </span>
      <span className="bg-glow-primary px-2 py-0.5 font-display font-700 text-[11px] text-white">
        {weight}
      </span>
    </span>
  )
}

export function ScoreMarquee() {
  return (
    <div className="overflow-hidden border-t-[3px] border-t-glow-primary border-b-2 border-b-glow-black bg-glow-black">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-inner {
          animation: marquee 32s linear infinite;
        }
      `}</style>

      <div className="marquee-inner flex items-center whitespace-nowrap py-2.5">
        {[0, 1].map((copy) => (
          <span key={copy} className="shrink-0 flex items-center">
            {/* Leading label */}
            <span className="shrink-0 flex items-center gap-2 px-8">
              <span className="font-display font-700 text-[10px] uppercase tracking-[0.2em] text-stone-400">
                How we rank
              </span>
              <span className="text-glow-primary">→</span>
            </span>

            {SIGNALS.map((signal, i) => (
              <span key={signal.label} className="shrink-0 flex items-center">
                <SignalPill {...signal} />
                {i < SIGNALS.length - 1 && SEPARATOR}
              </span>
            ))}

            {/* Trailing separator before loop repeats */}
            <span className="shrink-0 px-8 text-stone-600 select-none" aria-hidden>·····</span>
          </span>
        ))}
      </div>
    </div>
  )
}

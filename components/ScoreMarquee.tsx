const ITEM =
  '\u00a0\u00a0\u00a0🔥 Trending Score = Social Buzz (30%) · Bestseller Rank (25%) · Ratings & Reviews (20%) · Search Volume (15%) · Editorial Picks (10%) · Updated Weekly'

export function ScoreMarquee() {
  return (
    <div className="overflow-hidden border-y-2 border-glow-black bg-glow-primary">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-inner {
          animation: marquee 28s linear infinite;
        }
      `}</style>
      {/* Inner strip — 4 copies, animate -50% for a seamless loop */}
      <div className="marquee-inner flex whitespace-nowrap py-2">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="shrink-0 pr-16 font-mono text-sm font-bold text-glow-black"
          >
            {ITEM}
          </span>
        ))}
      </div>
    </div>
  )
}

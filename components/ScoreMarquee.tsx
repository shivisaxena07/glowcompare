const ITEM =
  '\u00a0\u00a0\u00a0🔥 Trending Score = Social Buzz (30%) · Bestseller Rank (25%) · Ratings & Reviews (20%) · Search Volume (15%) · Editorial Picks (10%) · Updated Weekly'

export function ScoreMarquee() {
  return (
    <div className="group overflow-hidden border-y-2 border-glow-black bg-glow-primary">
      {/* Inner strip — 4 copies, animate -50% for a seamless loop */}
      <div
        className="flex whitespace-nowrap py-2 group-hover:[animation-play-state:paused]"
        style={{ animation: 'marquee 28s linear infinite' }}
      >
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

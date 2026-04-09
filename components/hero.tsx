import { SearchBar } from '@/components/search-bar'

const PLATFORMS = ['Nykaa', 'Tira', 'Amazon', 'Flipkart', 'Purplle']

const STATS = [
  { number: '200+', label: 'Products tracked' },
  { number: '5',    label: 'Platforms compared' },
  { number: '₹100s', label: 'Saved per haul' },
]

export function Hero() {
  return (
    <section className="border-b-[3px] border-glow-black bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:items-stretch lg:gap-14">

          {/* ── Left: headline + search ── */}
          <div className="flex flex-col justify-center">
            {/* Eyebrow badge */}
            <span className="inline-block w-fit border-2 border-glow-black px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-glow-black">
              India&apos;s beauty price tracker
            </span>

            {/* Headline */}
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] tracking-tight text-glow-black sm:text-6xl lg:text-[68px]">
              Find trending<br />
              beauty.<br />
              <span className="text-glow-primary">Compare</span> every<br />
              price.
            </h1>

            {/* Subheadline */}
            <p className="mt-5 max-w-md text-base font-medium leading-relaxed text-stone-500">
              All 5 platforms in one place — Nykaa, Tira, Amazon, Flipkart & Purplle.
              No tab-switching. No overpaying.
            </p>

            {/* Search bar — prominent */}
            <div className="mt-8 max-w-md">
              <SearchBar />
            </div>

            {/* Platform pills */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              {PLATFORMS.map((p) => (
                <span
                  key={p}
                  className="border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold text-stone-500"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: stats block ── */}
          <div className="hidden flex-col justify-between bg-glow-black p-8 lg:flex">
            {STATS.map(({ number, label }, i) => (
              <div
                key={label}
                className={`${i < STATS.length - 1 ? 'border-b border-white/10 pb-8' : ''}`}
              >
                <p className="font-display text-6xl font-bold leading-none text-glow-primary">
                  {number}
                </p>
                <p className="mt-2 text-sm font-medium text-white/50">{label}</p>
              </div>
            ))}

            {/* Bottom tag */}
            <p className="mt-8 border-t border-white/10 pt-5 text-xs font-bold uppercase tracking-widest text-white/30">
              Sample data · Updated weekly
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

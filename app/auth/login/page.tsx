'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/src/context/auth-context'

const SIGNALS = [
  { label: 'Social Buzz',       pct: 30 },
  { label: 'Bestseller Rank',   pct: 25 },
  { label: 'Ratings & Reviews', pct: 20 },
  { label: 'Search Volume',     pct: 15 },
  { label: 'Editorial Picks',   pct: 10 },
]

export default function LoginPage() {
  const { signIn } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) { setError(error); return }
    router.push('/')
  }

  return (
    <main className="flex min-h-screen">

      {/* ── Left: brand panel ── */}
      <div className="relative hidden overflow-hidden bg-glow-black lg:flex lg:w-[52%] lg:flex-col lg:p-12">

        {/* Geometric accents */}
        <div className="absolute -right-16 -top-16 h-64 w-64 border-[3px] border-glow-primary opacity-10" aria-hidden />
        <div className="absolute -bottom-20 -left-10 h-72 w-72 border-[3px] border-glow-primary opacity-5" aria-hidden />
        <div className="absolute right-8 top-1/3 h-3 w-16 bg-glow-primary opacity-60" aria-hidden />

        {/* Logo */}
        <Link href="/" className="relative z-10 self-start">
          <span className="font-display text-xl font-bold text-white">
            Glow<span className="bg-glow-primary px-1 py-0.5 text-white">Compare</span>
          </span>
        </Link>

        {/* Hero copy */}
        <div className="relative z-10 mt-auto">
          <p className="mb-3 font-display text-[11px] font-700 uppercase tracking-[0.2em] text-glow-primary">
            Beauty intel · Best prices
          </p>
          <h2 className="font-display text-5xl font-700 leading-[1.05] text-white xl:text-6xl">
            Discover.<br />
            Compare.<br />
            <span className="text-glow-primary">Glow.</span>
          </h2>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-stone-400">
            Trending skincare & makeup compared across Nykaa, Tira, Amazon, Flipkart and Purplle — all in one place.
          </p>

          {/* Trend score bars */}
          <div className="mt-10">
            <p className="mb-4 font-display text-[10px] font-700 uppercase tracking-[0.2em] text-stone-500">
              How we rank trending
            </p>
            <div className="space-y-2.5">
              {SIGNALS.map(({ label, pct }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="h-1.5 bg-glow-primary"
                    style={{ width: `${pct * 2.8}%`, opacity: 0.5 + pct / 100 }}
                  />
                  <span className="text-xs text-stone-400">
                    {label}{' '}
                    <span className="font-display font-700 text-glow-primary">{pct}%</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 flex gap-8 border-t border-stone-800 pt-8">
            {[['200+', 'Products'], ['5', 'Platforms'], ['Free', 'Always']].map(([val, label]) => (
              <div key={label}>
                <p className="font-display text-2xl font-700 text-white">{val}</p>
                <p className="text-xs text-stone-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: form panel ── */}
      <div className="flex w-full flex-col items-center justify-center bg-[#FAFAF8] px-6 py-12 lg:w-[48%] lg:px-12">
        <div className="w-full max-w-sm">

          {/* Mobile-only logo */}
          <Link href="/" className="mb-8 block lg:hidden">
            <span className="font-display text-xl font-bold text-glow-black">
              Glow<span className="bg-glow-primary px-1 py-0.5 text-white">Compare</span>
            </span>
          </Link>

          <h1 className="font-display text-3xl font-700 text-glow-black">Welcome back</h1>
          <p className="mt-1 text-sm text-stone-500">Log in to see your wishlist and price alerts.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-xs font-700 uppercase tracking-widest text-glow-black">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border-2 border-glow-black bg-white px-3 py-3 text-sm text-glow-black placeholder:text-stone-400 focus:border-glow-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-xs font-700 uppercase tracking-widest text-glow-black">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full border-2 border-glow-black bg-white px-3 py-3 text-sm text-glow-black placeholder:text-stone-400 focus:border-glow-primary focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <p className="border-2 border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full border-2 border-glow-primary bg-glow-primary py-3 font-display text-sm font-700 text-white transition-all hover:bg-glow-black hover:border-glow-black disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Logging in…' : 'Log in →'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-stone-500">
            No account?{' '}
            <Link href="/auth/signup" className="font-700 text-glow-primary hover:underline">
              Sign up free
            </Link>
          </p>

          {/* Brand tagline — mobile only */}
          <div className="mt-12 border-t-2 border-glow-black pt-6 lg:hidden">
            <p className="font-display text-xs font-700 uppercase tracking-widest text-stone-400">
              Compare prices across
            </p>
            <p className="mt-1 text-sm font-bold text-glow-black">
              Nykaa · Tira · Amazon · Flipkart · Purplle
            </p>
          </div>
        </div>
      </div>

    </main>
  )
}

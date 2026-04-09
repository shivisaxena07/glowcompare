'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/src/context/auth-context'

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

    if (error) {
      setError(error)
      return
    }

    router.push('/')
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="font-display font-700 text-xl text-glow-black">
            Glow<span className="text-glow-primary">Compare</span>
          </Link>
          <h1 className="font-display font-700 text-3xl text-glow-black mt-6">Welcome back</h1>
          <p className="text-stone-500 mt-1 text-sm">Log in to see your wishlist and price alerts.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-500 text-glow-black mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border-2 border-glow-black px-3 py-2.5 text-sm bg-white text-glow-black placeholder:text-stone-400 focus:outline-none focus:border-glow-primary transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-500 text-glow-black mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full border-2 border-glow-black px-3 py-2.5 text-sm bg-white text-glow-black placeholder:text-stone-400 focus:outline-none focus:border-glow-primary transition-colors"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 border-2 border-red-200 bg-red-50 px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-glow-primary text-white font-display font-600 text-sm py-3 border-2 border-glow-primary hover:bg-glow-black hover:border-glow-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>

          <p className="text-center text-sm text-stone-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-glow-primary font-500 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </main>
  )
}

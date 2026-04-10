'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { SearchBar } from '@/components/search-bar'
import { useAuth } from '@/src/context/auth-context'

export function Navbar() {
  const { user, loading, signOut, wishlistIds } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const wishlistCount = wishlistIds.size

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-glow-black bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-0 px-4 py-3 sm:flex-nowrap sm:justify-start sm:gap-5 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="shrink-0 select-none" aria-label="GlowCompare home">
          <span className="font-display text-[20px] font-bold leading-none tracking-tight text-glow-black sm:text-[22px]">
            Glow<span className="bg-glow-primary px-1 py-0.5">Compare</span>
          </span>
        </Link>

        {/* Search — own row on mobile, inline on sm+ */}
        <div className="order-last w-full pb-3 sm:order-none sm:min-w-0 sm:flex-1 sm:pb-0">
          <SearchBar />
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          {/* Wishlist */}
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="relative cursor-pointer rounded-full border-2 border-glow-black p-2 text-glow-black transition-all duration-150 hover:bg-glow-primary"
          >
            <Heart className="h-4 w-4" />
            {!loading && wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center bg-glow-primary text-white text-[10px] font-display font-700 leading-none rounded-full border border-white">
                {wishlistCount > 9 ? '9+' : wishlistCount}
              </span>
            )}
          </Link>

          {loading ? null : user ? (
            <>
              {/* User email (desktop only) */}
              <span className="hidden max-w-[120px] truncate text-sm text-stone-500 sm:block">
                {user.email}
              </span>
              {/* Sign out */}
              <button
                onClick={handleSignOut}
                className="cursor-pointer border-2 border-glow-black bg-white px-4 py-2 text-sm font-bold text-glow-black transition-all duration-150 hover:bg-glow-black hover:text-white"
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              {/* Sign in */}
              <Link
                href="/auth/login"
                className="hidden cursor-pointer px-3 py-2 text-sm font-semibold text-glow-black transition-opacity duration-150 hover:opacity-50 sm:block"
              >
                Sign in
              </Link>
              {/* Sign up — primary CTA */}
              <Link
                href="/auth/signup"
                className="cursor-pointer border-2 border-glow-black bg-glow-primary px-4 py-2 text-sm font-bold text-glow-black transition-all duration-150 hover:bg-glow-black hover:text-glow-primary"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Heart } from 'lucide-react'
import { useAuth } from '@/src/context/auth-context'
import { useRouter } from 'next/navigation'
import { formatPrice, getBestPrice } from '@/lib/utils'
import type { ProductWithPrices } from '@/src/types'

interface WishlistRow {
  id: string
  product_id: string
  products: ProductWithPrices
}

export default function WishlistPage() {
  const { user, session, loading, removeFromWishlistIds } = useAuth()
  const router = useRouter()
  const [items, setItems] = useState<WishlistRow[]>([])
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth/login')
    }
  }, [loading, user, router])

  useEffect(() => {
    if (!session) return

    async function fetchWishlist() {
      setFetching(true)
      const res = await fetch('/api/wishlist', {
        headers: { Authorization: `Bearer ${session!.access_token}` },
      })
      const json = await res.json()
      setItems(json.data ?? [])
      setFetching(false)
    }

    fetchWishlist()
  }, [session])

  async function handleRemove(productId: string) {
    if (!session) return
    // Optimistic
    setItems(prev => prev.filter(i => i.product_id !== productId))
    removeFromWishlistIds(productId)

    await fetch(`/api/wishlist/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${session.access_token}` },
    })
  }

  if (loading || fetching) {
    return (
      <main className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <p className="text-stone-400 text-sm">Loading wishlist…</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-700 text-3xl text-glow-black">My Wishlist</h1>
          {items.length > 0 && (
            <p className="text-stone-500 text-sm mt-1">{items.length} saved product{items.length !== 1 ? 's' : ''}</p>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="border-2 border-dashed border-stone-200 py-20 flex flex-col items-center text-center">
            <div className="w-12 h-12 border-2 border-stone-200 flex items-center justify-center mb-4">
              <Heart className="h-5 w-5 text-stone-300" />
            </div>
            <p className="font-display font-600 text-glow-black text-lg">Nothing saved yet</p>
            <p className="text-stone-400 text-sm mt-1">Tap the heart on any product to save it here.</p>
            <Link
              href="/"
              className="mt-6 border-2 border-glow-black bg-glow-primary text-white font-display font-600 text-sm px-6 py-2.5 hover:bg-glow-black transition-colors"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(({ product_id, products: product }) => {
              const bestPrice = getBestPrice(product.platform_prices)
              return (
                <div
                  key={product_id}
                  className="flex items-center gap-4 border-2 border-glow-black bg-white p-3 transition-all duration-150 hover:border-glow-primary hover:shadow-[4px_4px_0px_#0F172A]"
                >
                  {/* Image */}
                  <Link href={`/products/${product.id}`} className="shrink-0">
                    <div className="relative w-16 h-16 border-2 border-glow-black overflow-hidden">
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                        onError={(e) => {
                          ;(e.currentTarget as HTMLImageElement).src =
                            'https://placehold.co/64x64/f5f5f4/a8a29e?text=?'
                        }}
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{product.brand}</p>
                    <Link href={`/products/${product.id}`}>
                      <h3 className="font-display font-600 text-sm text-glow-black line-clamp-1 hover:text-glow-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    {bestPrice ? (
                      <p className="font-display font-700 text-glow-primary text-base mt-0.5">
                        {formatPrice(bestPrice.price)}
                        <span className="text-xs font-400 text-stone-400 ml-1">on {bestPrice.platform}</span>
                      </p>
                    ) : (
                      <p className="text-xs text-stone-400 mt-0.5">Unavailable</p>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => handleRemove(product_id)}
                    aria-label="Remove from wishlist"
                    className="shrink-0 p-2 border-2 border-stone-200 text-stone-400 hover:border-red-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

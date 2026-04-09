'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { useAuth } from '@/src/context/auth-context'
import { LoginModal } from '@/components/login-modal'

interface WishlistButtonProps {
  productId: string
}

export function WishlistButton({ productId }: WishlistButtonProps) {
  const { user, session, wishlistIds, addToWishlistIds, removeFromWishlistIds } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const isSaved = wishlistIds.has(productId)

  async function handleClick() {
    if (!user || !session) {
      setShowLoginModal(true)
      return
    }

    const token = session.access_token

    if (isSaved) {
      removeFromWishlistIds(productId)
      try {
        await fetch(`/api/wishlist/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
      } catch {
        addToWishlistIds(productId)
      }
    } else {
      addToWishlistIds(productId)
      try {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: productId }),
        })
      } catch {
        removeFromWishlistIds(productId)
      }
    }
  }

  return (
    <>
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}
      <button
        onClick={handleClick}
        aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
        className="mt-6 flex items-center gap-2 self-start border-2 border-glow-black bg-white px-5 py-2.5 text-sm font-display font-600 text-glow-black transition-all duration-150 hover:bg-glow-primary hover:border-glow-primary hover:text-white"
      >
        <Heart
          className={`h-4 w-4 transition-colors duration-150 ${isSaved ? 'fill-glow-primary text-glow-primary' : ''}`}
        />
        {isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}
      </button>
    </>
  )
}

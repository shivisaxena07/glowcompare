'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { X, Heart } from 'lucide-react'

interface LoginModalProps {
  onClose: () => void
}

export function LoginModal({ onClose }: LoginModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-glow-black/60 px-4"
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="w-full max-w-sm bg-white border-2 border-glow-black p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-stone-400 hover:text-glow-black transition-colors"
        >
          <X size={18} />
        </button>

        {/* Icon */}
        <div className="w-10 h-10 border-2 border-glow-primary flex items-center justify-center mb-4">
          <Heart size={18} className="text-glow-primary fill-glow-primary" />
        </div>

        <h2 className="font-display font-700 text-xl text-glow-black">Save to wishlist</h2>
        <p className="text-stone-500 text-sm mt-1 mb-6">
          Create a free account to save products and track price drops.
        </p>

        <div className="space-y-3">
          <Link
            href="/auth/signup"
            onClick={onClose}
            className="block w-full text-center bg-glow-primary text-white font-display font-600 text-sm py-3 border-2 border-glow-primary hover:bg-glow-black hover:border-glow-black transition-colors"
          >
            Create account
          </Link>
          <Link
            href="/auth/login"
            onClick={onClose}
            className="block w-full text-center bg-white text-glow-black font-display font-600 text-sm py-3 border-2 border-glow-black hover:bg-glow-black hover:text-white transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  )
}

'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/src/lib/supabase'

interface AuthContextValue {
  user: User | null
  session: Session | null
  loading: boolean
  wishlistIds: Set<string>
  signUp: (email: string, password: string) => Promise<{ error: string | null }>
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  addToWishlistIds: (productId: string) => void
  removeFromWishlistIds: (productId: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set())

  const fetchWishlistIds = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('wishlist')
      .select('product_id')
      .eq('user_id', userId)
    if (data) {
      setWishlistIds(new Set(data.map((row: { product_id: string }) => row.product_id)))
    }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchWishlistIds(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchWishlistIds(session.user.id)
      } else {
        setWishlistIds(new Set())
      }
    })

    return () => subscription.unsubscribe()
  }, [fetchWishlistIds])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error: error?.message ?? null }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const addToWishlistIds = (productId: string) => {
    setWishlistIds(prev => new Set(prev).add(productId))
  }

  const removeFromWishlistIds = (productId: string) => {
    setWishlistIds(prev => {
      const next = new Set(prev)
      next.delete(productId)
      return next
    })
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      wishlistIds,
      signUp,
      signIn,
      signOut,
      addToWishlistIds,
      removeFromWishlistIds,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

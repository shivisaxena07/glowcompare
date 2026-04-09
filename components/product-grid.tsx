'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { ProductCard } from '@/components/product-card'
import { FilterPanel, EMPTY_FILTERS, type FilterState } from '@/components/filter-panel'
import { LoginModal } from '@/components/login-modal'
import { getBestPrice } from '@/lib/utils'
import { useAuth } from '@/src/context/auth-context'
import type { ProductWithPrices, Category } from '@/src/types'

const PAGE_SIZE = 12

const CATEGORY_PILLS = [
  { label: 'All', value: '' as const },
  { label: 'Skincare', value: 'skincare' as const },
  { label: 'Makeup', value: 'makeup' as const },
]

interface ProductGridProps {
  products: ProductWithPrices[]
  category?: Category
}

export function ProductGrid({ products, category }: ProductGridProps) {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
  const [activeCategory, setActiveCategory] = useState<'' | 'skincare' | 'makeup'>('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const { user, session, wishlistIds, addToWishlistIds, removeFromWishlistIds } = useAuth()

  // Effective category: prop (category pages) takes precedence over interactive state (homepage)
  const effectiveCategory: Category | undefined =
    category ?? (activeCategory !== '' ? activeCategory : undefined)

  const availableBrands = useMemo(
    () => [...new Set(products.map((p) => p.brand))].sort(),
    [products],
  )

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (effectiveCategory && p.category !== effectiveCategory) return false
      if (filters.subCategories.length > 0 && !filters.subCategories.includes(p.sub_category)) return false
      if (filters.brands.length > 0 && !filters.brands.includes(p.brand)) return false
      if (filters.minPrice !== '' || filters.maxPrice !== '') {
        const best = getBestPrice(p.platform_prices)
        if (!best) return false
        if (filters.minPrice !== '' && best.price < Number(filters.minPrice)) return false
        if (filters.maxPrice !== '' && best.price > Number(filters.maxPrice)) return false
      }
      return true
    })
  }, [products, filters, effectiveCategory])

  // Reset visible count when filters or category change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE)
  }, [filters, activeCategory])

  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProducts.length

  // Infinite scroll — observe sentinel div
  useEffect(() => {
    if (!hasMore) return
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => c + PAGE_SIZE)
        }
      },
      { rootMargin: '200px' },
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, visibleProducts.length])

  const hasActiveFilters =
    (activeCategory !== '' && !category) ||
    filters.subCategories.length > 0 ||
    filters.brands.length > 0 ||
    filters.minPrice !== '' ||
    filters.maxPrice !== ''

  function handleCategoryChange(val: '' | 'skincare' | 'makeup') {
    setActiveCategory(val)
    setFilters((prev) => ({ ...prev, subCategories: [] }))
  }

  function handleClearAll() {
    setActiveCategory('')
    setFilters(EMPTY_FILTERS)
  }

  async function handleWishlistToggle(productId: string) {
    if (!user || !session) {
      setShowLoginModal(true)
      return
    }

    const token = session.access_token
    const isCurrentlySaved = wishlistIds.has(productId)

    if (isCurrentlySaved) {
      removeFromWishlistIds(productId)
    } else {
      addToWishlistIds(productId)
    }

    try {
      if (isCurrentlySaved) {
        await fetch(`/api/wishlist/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        await fetch('/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: productId }),
        })
      }
    } catch {
      if (isCurrentlySaved) {
        addToWishlistIds(productId)
      } else {
        removeFromWishlistIds(productId)
      }
    }
  }

  return (
    <div className="space-y-6">
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} />}

      {/* Category pills — only on homepage (no category prop) */}
      {!category && (
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORY_PILLS.map(({ label, value }) => {
            const isActive = activeCategory === value
            return (
              <button
                key={value}
                onClick={() => handleCategoryChange(value)}
                aria-pressed={isActive}
                className={`border-2 px-5 py-2 text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? 'border-glow-black bg-glow-black text-white'
                    : 'border-glow-black bg-white text-glow-black hover:bg-glow-primary/10'
                }`}
              >
                {label}
              </button>
            )
          })}
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="ml-1 text-xs font-semibold text-rose-500 transition-colors duration-150 hover:text-rose-600"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      <FilterPanel
        category={effectiveCategory}
        availableBrands={availableBrands}
        filters={filters}
        onChange={setFilters}
      />

      <p className="text-sm text-stone-500">
        {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        {hasActiveFilters && ' matching filters'}
      </p>

      {filteredProducts.length === 0 ? (
        /* US-006 — Empty state */
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-stone-200 py-20 text-center">
          <p className="font-display font-600 text-glow-black text-base">No products found</p>
          <p className="mt-1 text-sm text-stone-400">Try adjusting or clearing your filters</p>
          <button
            onClick={handleClearAll}
            className="mt-5 border-2 border-glow-black bg-glow-primary px-5 py-2 text-sm font-display font-600 text-white hover:bg-glow-black transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.has(product.id)}
                onWishlistToggle={handleWishlistToggle}
              />
            ))}
          </div>

          {/* Sentinel — triggers next page load */}
          {hasMore && (
            <div ref={sentinelRef} className="flex justify-center py-6">
              <span className="text-xs text-stone-400">Loading more…</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}

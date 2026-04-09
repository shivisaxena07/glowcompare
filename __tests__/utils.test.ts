import { describe, it, expect } from 'vitest'
import { formatPrice, getBestPrice, cn } from '@/lib/utils'
import type { PlatformPrice } from '@/src/types'

// ─── cn() ─────────────────────────────────────────────────────────────────────

describe('cn()', () => {
  it('merges class names', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2')
  })

  it('resolves tailwind conflicts — last class wins', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6')
  })

  it('handles conditional classes', () => {
    expect(cn('base', false && 'skipped', 'added')).toBe('base added')
  })

  it('handles undefined and null gracefully', () => {
    expect(cn('base', undefined, null)).toBe('base')
  })
})

// ─── formatPrice() ────────────────────────────────────────────────────────────

describe('formatPrice()', () => {
  it('formats whole numbers in INR', () => {
    expect(formatPrice(599)).toBe('₹599')
  })

  it('formats thousands with Indian comma style', () => {
    expect(formatPrice(1299)).toBe('₹1,299')
  })

  it('rounds decimals — no paise shown', () => {
    expect(formatPrice(599.99)).toBe('₹600')
  })

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('₹0')
  })
})

// ─── getBestPrice() ───────────────────────────────────────────────────────────

function makePrice(
  platform: string,
  price: number,
  availability = true,
): PlatformPrice {
  return {
    id: `id-${platform}`,
    product_id: 'prod-1',
    platform: platform as PlatformPrice['platform'],
    price,
    original_price: price + 100,
    discount_pct: 10,
    url: `https://example.com/${platform}`,
    availability,
    last_updated: new Date().toISOString(),
  }
}

describe('getBestPrice()', () => {
  it('returns the platform with the lowest price', () => {
    const prices = [
      makePrice('nykaa', 599),
      makePrice('amazon', 549),
      makePrice('flipkart', 579),
    ]
    expect(getBestPrice(prices)?.platform).toBe('amazon')
    expect(getBestPrice(prices)?.price).toBe(549)
  })

  it('ignores unavailable platforms', () => {
    const prices = [
      makePrice('nykaa', 499, false),
      makePrice('amazon', 549),
    ]
    expect(getBestPrice(prices)?.platform).toBe('amazon')
  })

  it('returns null when all platforms are unavailable', () => {
    const prices = [
      makePrice('nykaa', 499, false),
      makePrice('amazon', 549, false),
    ]
    expect(getBestPrice(prices)).toBeNull()
  })

  it('returns null for an empty array', () => {
    expect(getBestPrice([])).toBeNull()
  })

  it('returns the only available platform when one platform ties for lowest', () => {
    const prices = [
      makePrice('nykaa', 599),
      makePrice('amazon', 599),
    ]
    // Both tie — first encountered wins (reduce keeps first equal)
    const best = getBestPrice(prices)
    expect(best?.price).toBe(599)
  })
})

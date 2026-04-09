import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PriceComparisonTable } from '@/components/price-comparison-table'
import type { PlatformPrice } from '@/src/types'

function makePrice(
  platform: PlatformPrice['platform'],
  price: number,
  originalPrice: number,
  discountPct: number,
  availability = true,
): PlatformPrice {
  return {
    id: `pp-${platform}`,
    product_id: 'prod-001',
    platform,
    price,
    original_price: originalPrice,
    discount_pct: discountPct,
    url: `https://${platform}.com/product`,
    availability,
    last_updated: '2026-01-01T00:00:00Z',
  }
}

const prices: PlatformPrice[] = [
  makePrice('nykaa',    599, 699, 14.3),
  makePrice('tira',     619, 699, 11.4),
  makePrice('amazon',   549, 699, 21.5),  // best price
  makePrice('flipkart', 589, 699, 15.7),
  makePrice('purplle',  599, 699, 14.3, false),  // unavailable
]

describe('PriceComparisonTable', () => {
  it('renders all 5 platforms', () => {
    render(<PriceComparisonTable prices={prices} productName="Test Product" />)
    expect(screen.getByText('Nykaa')).toBeInTheDocument()
    expect(screen.getByText('Tira')).toBeInTheDocument()
    expect(screen.getByText('Amazon')).toBeInTheDocument()
    expect(screen.getByText('Flipkart')).toBeInTheDocument()
    expect(screen.getByText('Purplle')).toBeInTheDocument()
  })

  it('shows "Best Price" badge only on the cheapest available platform', () => {
    render(<PriceComparisonTable prices={prices} productName="Test Product" />)
    expect(screen.getByText('Best Price')).toBeInTheDocument()
    // Only Amazon row should have the badge
    const badge = screen.getByText('Best Price')
    expect(badge.closest('tr')?.textContent).toContain('Amazon')
  })

  it('shows "Best Price" badge on all platforms that tie for lowest price', () => {
    const tiePrices: PlatformPrice[] = [
      makePrice('nykaa',    500, 600, 17),
      makePrice('amazon',   500, 600, 17),
      makePrice('flipkart', 550, 600, 8),
      makePrice('tira',     550, 600, 8),
      makePrice('purplle',  550, 600, 8),
    ]
    render(<PriceComparisonTable prices={tiePrices} productName="Test Product" />)
    const badges = screen.getAllByText('Best Price')
    expect(badges).toHaveLength(2)
  })

  it('does not give "Best Price" to unavailable platforms', () => {
    const prices2: PlatformPrice[] = [
      makePrice('nykaa',    599, 699, 14, true),
      makePrice('amazon',   499, 699, 29, false),  // cheapest but unavailable
      makePrice('flipkart', 550, 699, 21, true),
      makePrice('tira',     580, 699, 17, true),
      makePrice('purplle',  590, 699, 16, true),
    ]
    render(<PriceComparisonTable prices={prices2} productName="Test Product" />)
    const badge = screen.getByText('Best Price')
    expect(badge.closest('tr')?.textContent).toContain('Flipkart')
  })

  it('renders discount badges for discounted platforms', () => {
    render(<PriceComparisonTable prices={prices} productName="Test Product" />)
    // Nykaa + Purplle both have 14.3% → "14% off" (two badges)
    expect(screen.getAllByText('14% off')).toHaveLength(2)
    // Amazon 21.5% rounds to 22%
    expect(screen.getByText('22% off')).toBeInTheDocument()
  })

  it('renders Visit links that open in a new tab', () => {
    render(<PriceComparisonTable prices={prices} productName="Test Product" />)
    const visitLinks = screen.getAllByRole('link', { name: /visit/i })
    expect(visitLinks.length).toBe(5)
    visitLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('shows the sample data footnote', () => {
    render(<PriceComparisonTable prices={prices} productName="Test Product" />)
    expect(screen.getByText(/sample data/i)).toBeInTheDocument()
  })
})

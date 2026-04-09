import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrendingThisWeek } from '@/components/trending-this-week'
import type { ProductWithPrices } from '@/src/types'

vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    <img {...props} />
  ),
}))

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>{children}</a>
  ),
}))

function makeProduct(id: string, score: number): ProductWithPrices {
  return {
    id,
    name: `Product ${id}`,
    brand: 'Brand',
    category: 'skincare',
    sub_category: 'serum',
    description: 'desc',
    image_url: 'https://placehold.co/400',
    ingredients_summary: 'inci',
    trending_score: score,
    created_at: '2026-01-01T00:00:00Z',
    platform_prices: [
      {
        id: `pp-${id}`,
        product_id: id,
        platform: 'nykaa',
        price: 599,
        original_price: 699,
        discount_pct: 14,
        url: 'https://nykaa.com',
        availability: true,
        last_updated: '2026-01-01T00:00:00Z',
      },
    ],
  }
}

// 10 products — only top 6 should render
const products = Array.from({ length: 10 }, (_, i) =>
  makeProduct(`p${i + 1}`, 100 - i * 5),
)

describe('TrendingThisWeek', () => {
  it('renders the section heading', () => {
    render(<TrendingThisWeek products={products} />)
    expect(screen.getByText('Trending This Week')).toBeInTheDocument()
  })

  it('shows only the top 6 products', () => {
    render(<TrendingThisWeek products={products} />)
    // Products are named "Product p1" through "Product p10"
    // Only first 6 should appear
    expect(screen.getByText('Product p1')).toBeInTheDocument()
    expect(screen.getByText('Product p6')).toBeInTheDocument()
    expect(screen.queryByText('Product p7')).toBeNull()
    expect(screen.queryByText('Product p10')).toBeNull()
  })

  it('shows the data freshness label with "Sample data"', () => {
    render(<TrendingThisWeek products={products} />)
    expect(screen.getByText(/sample data/i)).toBeInTheDocument()
  })

  it('shows "last updated" in the label', () => {
    render(<TrendingThisWeek products={products} />)
    expect(screen.getByText(/last updated/i)).toBeInTheDocument()
  })

  it('links each card to the correct product detail page', () => {
    render(<TrendingThisWeek products={products} />)
    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', '/products/p1')
    expect(links[5]).toHaveAttribute('href', '/products/p6')
  })

  it('renders trending score badges on each card', () => {
    render(<TrendingThisWeek products={products} />)
    // Product p1 has score 100, p2 has 95, etc.
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('95')).toBeInTheDocument()
  })

  it('renders "Unavailable" when all platforms are out of stock', () => {
    const unavailableProducts = [
      {
        ...makeProduct('u1', 80),
        platform_prices: [
          { ...makeProduct('u1', 80).platform_prices[0], availability: false },
        ],
      },
    ]
    render(<TrendingThisWeek products={unavailableProducts} />)
    expect(screen.getByText('Unavailable')).toBeInTheDocument()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductGrid } from '@/components/product-grid'
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

function makeProduct(overrides: Partial<ProductWithPrices>): ProductWithPrices {
  return {
    id: 'prod-001',
    name: 'Test Serum',
    brand: 'Minimalist',
    category: 'skincare',
    sub_category: 'serum',
    description: 'A test serum.',
    image_url: 'https://placehold.co/400',
    ingredients_summary: 'Niacinamide',
    trending_score: 80,
    created_at: '2026-01-01T00:00:00Z',
    platform_prices: [
      {
        id: 'pp-1',
        product_id: 'prod-001',
        platform: 'nykaa',
        price: 599,
        original_price: 699,
        discount_pct: 14,
        url: 'https://nykaa.com',
        availability: true,
        last_updated: '2026-01-01T00:00:00Z',
      },
    ],
    ...overrides,
  }
}

const serumMinimalist = makeProduct({ id: 'p1', name: 'Niacinamide Serum', brand: 'Minimalist', sub_category: 'serum' })
const moisturizerDotKey = makeProduct({ id: 'p2', name: 'Waterlight Gel', brand: 'Dot & Key', sub_category: 'moisturiser' })
const sunscreenPlum = makeProduct({
  id: 'p3',
  name: 'UV Shield',
  brand: 'Plum',
  sub_category: 'sunscreen',
  platform_prices: [{
    id: 'pp-3',
    product_id: 'p3',
    platform: 'amazon',
    price: 299,
    original_price: 399,
    discount_pct: 25,
    url: 'https://amazon.in',
    availability: true,
    last_updated: '2026-01-01T00:00:00Z',
  }],
})

const products = [serumMinimalist, moisturizerDotKey, sunscreenPlum]

describe('ProductGrid — rendering', () => {
  it('renders all products when no filters are active', () => {
    render(<ProductGrid products={products} />)
    expect(screen.getByText('Niacinamide Serum')).toBeInTheDocument()
    expect(screen.getByText('Waterlight Gel')).toBeInTheDocument()
    expect(screen.getByText('UV Shield')).toBeInTheDocument()
  })

  it('shows the correct product count', () => {
    render(<ProductGrid products={products} />)
    expect(screen.getByText('3 products')).toBeInTheDocument()
  })

  it('shows empty state when product list is empty', () => {
    render(<ProductGrid products={[]} />)
    expect(screen.getByText('No products found')).toBeInTheDocument()
  })
})

describe('ProductGrid — sub-category filtering', () => {
  it('filters to only serums when Serum chip is clicked', () => {
    render(<ProductGrid products={products} category="skincare" />)
    fireEvent.click(screen.getByRole('button', { name: 'Serum' }))
    expect(screen.getByText('Niacinamide Serum')).toBeInTheDocument()
    expect(screen.queryByText('Waterlight Gel')).toBeNull()
    expect(screen.queryByText('UV Shield')).toBeNull()
  })

  it('updates the count label when filters are active', () => {
    render(<ProductGrid products={products} category="skincare" />)
    fireEvent.click(screen.getByRole('button', { name: 'Serum' }))
    expect(screen.getByText('1 product matching filters')).toBeInTheDocument()
  })

  it('shows empty state when no products match the sub-category', () => {
    render(<ProductGrid products={products} category="skincare" />)
    fireEvent.click(screen.getByRole('button', { name: 'Eye Cream' }))
    expect(screen.getByText('No products found')).toBeInTheDocument()
  })
})

describe('ProductGrid — brand filtering', () => {
  it('filters to only Minimalist products', () => {
    render(<ProductGrid products={products} />)
    fireEvent.click(screen.getByRole('checkbox', { name: 'Minimalist' }))
    expect(screen.getByText('Niacinamide Serum')).toBeInTheDocument()
    expect(screen.queryByText('Waterlight Gel')).toBeNull()
  })
})

describe('ProductGrid — price range filtering', () => {
  it('filters out products above maxPrice', () => {
    render(<ProductGrid products={products} />)
    // Plum UV Shield is ₹299, others are ₹599 — set max to 400
    fireEvent.change(screen.getByPlaceholderText('Max'), { target: { value: '400' } })
    expect(screen.getByText('UV Shield')).toBeInTheDocument()
    expect(screen.queryByText('Niacinamide Serum')).toBeNull()
    expect(screen.queryByText('Waterlight Gel')).toBeNull()
  })

  it('filters out products below minPrice', () => {
    render(<ProductGrid products={products} />)
    // Set min to 500 — only Minimalist (₹599) and Dot & Key (₹599) pass
    fireEvent.change(screen.getByPlaceholderText('Min'), { target: { value: '500' } })
    expect(screen.getByText('Niacinamide Serum')).toBeInTheDocument()
    expect(screen.queryByText('UV Shield')).toBeNull()
  })
})

describe('ProductGrid — clearing filters', () => {
  it('shows all products again after clearing filters', () => {
    render(<ProductGrid products={products} category="skincare" />)
    fireEvent.click(screen.getByRole('button', { name: 'Serum' }))
    expect(screen.queryByText('Waterlight Gel')).toBeNull()

    fireEvent.click(screen.getByText('Clear filters'))
    expect(screen.getByText('Waterlight Gel')).toBeInTheDocument()
    expect(screen.getByText('UV Shield')).toBeInTheDocument()
  })
})

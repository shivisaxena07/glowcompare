import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProductCard } from '@/components/product-card'
import type { ProductWithPrices } from '@/src/types'

// next/image and next/link don't work in jsdom — stub them out
vi.mock('next/image', () => ({
  default: (props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

vi.mock('next/link', () => ({
  default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

const mockProduct: ProductWithPrices = {
  id: 'prod-001',
  name: 'Niacinamide 10% + Zinc 1% Serum',
  brand: 'Minimalist',
  category: 'skincare',
  sub_category: 'serum',
  description: 'A lightweight serum.',
  image_url: 'https://placehold.co/400x400',
  ingredients_summary: '10% Niacinamide, 1% Zinc PCA.',
  trending_score: 92.5,
  created_at: '2026-01-01T00:00:00Z',
  platform_prices: [
    {
      id: 'pp-1',
      product_id: 'prod-001',
      platform: 'nykaa',
      price: 599,
      original_price: 699,
      discount_pct: 14.3,
      url: 'https://nykaa.com/product',
      availability: true,
      last_updated: '2026-01-01T00:00:00Z',
    },
    {
      id: 'pp-2',
      product_id: 'prod-001',
      platform: 'amazon',
      price: 549,
      original_price: 699,
      discount_pct: 21.5,
      url: 'https://amazon.in/product',
      availability: true,
      last_updated: '2026-01-01T00:00:00Z',
    },
    {
      id: 'pp-3',
      product_id: 'prod-001',
      platform: 'flipkart',
      price: 579,
      original_price: 699,
      discount_pct: 17.2,
      url: 'https://flipkart.com/product',
      availability: false,
      last_updated: '2026-01-01T00:00:00Z',
    },
  ],
}

describe('ProductCard', () => {
  it('renders brand and product name', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Minimalist')).toBeInTheDocument()
    expect(screen.getByText('Niacinamide 10% + Zinc 1% Serum')).toBeInTheDocument()
  })

  it('renders sub-category label', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('Serum')).toBeInTheDocument()
  })

  it('renders the trending score badge', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('93')).toBeInTheDocument() // Math.round(92.5)
  })

  it('shows the best available price (Amazon at ₹549, not unavailable Flipkart)', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText('₹549')).toBeInTheDocument()
    expect(screen.getByText('Best on Amazon')).toBeInTheDocument()
  })

  it('links to the correct product detail page', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByRole('link')).toHaveAttribute('href', '/products/prod-001')
  })

  it('renders product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByAltText('Minimalist Niacinamide 10% + Zinc 1% Serum')).toBeInTheDocument()
  })

  it('renders an unfilled heart when not wishlisted', () => {
    render(<ProductCard product={mockProduct} />)
    const btn = screen.getByRole('button', { name: 'Add to wishlist' })
    expect(btn).toBeInTheDocument()
  })

  it('renders a filled heart when wishlisted', () => {
    render(<ProductCard product={mockProduct} isWishlisted />)
    const btn = screen.getByRole('button', { name: 'Remove from wishlist' })
    expect(btn).toBeInTheDocument()
  })

  it('calls onWishlistToggle with product id when heart is clicked', () => {
    const handler = vi.fn()
    render(<ProductCard product={mockProduct} onWishlistToggle={handler} />)
    fireEvent.click(screen.getByRole('button', { name: 'Add to wishlist' }))
    expect(handler).toHaveBeenCalledOnce()
    expect(handler).toHaveBeenCalledWith('prod-001')
  })

  it('shows "Unavailable" when all platforms are out of stock', () => {
    const unavailableProduct: ProductWithPrices = {
      ...mockProduct,
      platform_prices: mockProduct.platform_prices.map((p) => ({
        ...p,
        availability: false,
      })),
    }
    render(<ProductCard product={unavailableProduct} />)
    expect(screen.getByText('Unavailable')).toBeInTheDocument()
  })
})

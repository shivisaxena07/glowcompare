import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TrendingBreakdown } from '@/components/trending-breakdown'
import type { TrendingSignals } from '@/src/types'

const signals: TrendingSignals = {
  id: 'sig-001',
  product_id: 'prod-001',
  social_score: 95,
  bestseller_score: 90,
  rating_score: 88,
  search_score: 92,
  editorial_score: 98,
  composite_score: 92.5,
  updated_at: '2026-01-01T00:00:00Z',
}

describe('TrendingBreakdown', () => {
  it('renders the composite score', () => {
    render(<TrendingBreakdown signals={signals} compositeScore={92.5} />)
    expect(screen.getByText(/93/)).toBeInTheDocument() // Math.round(92.5)
  })

  it('renders all 5 signal labels', () => {
    render(<TrendingBreakdown signals={signals} compositeScore={92.5} />)
    expect(screen.getByText('Social Buzz')).toBeInTheDocument()
    expect(screen.getByText('Bestseller Rank')).toBeInTheDocument()
    expect(screen.getByText('Ratings & Reviews')).toBeInTheDocument()
    expect(screen.getByText('Search Volume')).toBeInTheDocument()
    expect(screen.getByText('Editorial Picks')).toBeInTheDocument()
  })

  it('renders all 5 signal weights', () => {
    render(<TrendingBreakdown signals={signals} compositeScore={92.5} />)
    expect(screen.getByText('30%')).toBeInTheDocument()
    expect(screen.getByText('25%')).toBeInTheDocument()
    expect(screen.getByText('20%')).toBeInTheDocument()
    expect(screen.getByText('15%')).toBeInTheDocument()
    expect(screen.getByText('10%')).toBeInTheDocument()
  })

  it('renders the "Why is this trending?" summary heading', () => {
    render(<TrendingBreakdown signals={signals} compositeScore={92.5} />)
    expect(screen.getByText('Why is this trending?')).toBeInTheDocument()
  })

  it('renders as a details element (expandable)', () => {
    const { container } = render(<TrendingBreakdown signals={signals} compositeScore={92.5} />)
    expect(container.querySelector('details')).toBeInTheDocument()
    expect(container.querySelector('summary')).toBeInTheDocument()
  })
})

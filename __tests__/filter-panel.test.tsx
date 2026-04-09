import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { FilterPanel, EMPTY_FILTERS, type FilterState } from '@/components/filter-panel'

const brands = ['Minimalist', 'Dot & Key', 'Plum']

function renderPanel(
  overrides: Partial<FilterState> = {},
  onChange = vi.fn(),
  category?: string,
) {
  const filters: FilterState = { ...EMPTY_FILTERS, ...overrides }
  return { onChange, ...render(<FilterPanel category={category} availableBrands={brands} filters={filters} onChange={onChange} />) }
}

// ─── Sub-category chips ───────────────────────────────────────────────────────

describe('FilterPanel — sub-category chips', () => {
  it('does not render sub-category chips when no category is passed', () => {
    renderPanel()
    expect(screen.queryByRole('button', { name: /serum/i })).toBeNull()
  })

  it('renders skincare sub-category chips when category=skincare', () => {
    renderPanel({}, vi.fn(), 'skincare')
    expect(screen.getByRole('button', { name: 'Serum' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cleanser' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Foundation' })).toBeNull()
  })

  it('renders makeup sub-category chips when category=makeup', () => {
    renderPanel({}, vi.fn(), 'makeup')
    expect(screen.getByRole('button', { name: 'Lipstick' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Serum' })).toBeNull()
  })

  it('calls onChange with the toggled sub-category added', () => {
    const { onChange } = renderPanel({}, vi.fn(), 'skincare')
    fireEvent.click(screen.getByRole('button', { name: 'Serum' }))
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY_FILTERS, subCategories: ['serum'] })
  })

  it('calls onChange with the sub-category removed when already selected', () => {
    const { onChange } = renderPanel({ subCategories: ['serum'] }, vi.fn(), 'skincare')
    fireEvent.click(screen.getByRole('button', { name: 'Serum' }))
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY_FILTERS, subCategories: [] })
  })

  it('marks the active chip as aria-pressed=true', () => {
    renderPanel({ subCategories: ['serum'] }, vi.fn(), 'skincare')
    expect(screen.getByRole('button', { name: 'Serum' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Toner' })).toHaveAttribute('aria-pressed', 'false')
  })
})

// ─── Brand filter ─────────────────────────────────────────────────────────────

describe('FilterPanel — brand filter', () => {
  it('renders all available brands as checkboxes', () => {
    renderPanel()
    brands.forEach((b) => {
      expect(screen.getByRole('checkbox', { name: b })).toBeInTheDocument()
    })
  })

  it('calls onChange with brand added when checkbox is checked', () => {
    const { onChange } = renderPanel()
    fireEvent.click(screen.getByRole('checkbox', { name: 'Minimalist' }))
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY_FILTERS, brands: ['Minimalist'] })
  })

  it('calls onChange with brand removed when checkbox is unchecked', () => {
    const { onChange } = renderPanel({ brands: ['Minimalist'] })
    fireEvent.click(screen.getByRole('checkbox', { name: 'Minimalist' }))
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY_FILTERS, brands: [] })
  })

  it('shows a count badge when brands are selected', () => {
    renderPanel({ brands: ['Minimalist', 'Plum'] })
    expect(screen.getByText('2')).toBeInTheDocument()
  })
})

// ─── Price range ──────────────────────────────────────────────────────────────

describe('FilterPanel — price range', () => {
  it('calls onChange with updated minPrice', () => {
    const { onChange } = renderPanel()
    fireEvent.change(screen.getByPlaceholderText('Min'), { target: { value: '200' } })
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY_FILTERS, minPrice: '200' })
  })

  it('calls onChange with updated maxPrice', () => {
    const { onChange } = renderPanel()
    fireEvent.change(screen.getByPlaceholderText('Max'), { target: { value: '800' } })
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY_FILTERS, maxPrice: '800' })
  })
})

// ─── Active filter tags & clear ───────────────────────────────────────────────

describe('FilterPanel — active tags & clear', () => {
  it('does not show "Clear filters" when no filters are active', () => {
    renderPanel()
    expect(screen.queryByText('Clear filters')).toBeNull()
  })

  it('shows "Clear filters" when a brand is selected', () => {
    renderPanel({ brands: ['Plum'] })
    expect(screen.getByText('Clear filters')).toBeInTheDocument()
  })

  it('calls onChange with EMPTY_FILTERS when "Clear filters" is clicked', () => {
    const { onChange } = renderPanel({ brands: ['Plum'] })
    fireEvent.click(screen.getByText('Clear filters'))
    expect(onChange).toHaveBeenCalledWith(EMPTY_FILTERS)
  })

  it('renders active brand as a removable tag', () => {
    renderPanel({ brands: ['Minimalist'] })
    // Brand name appears both in the checkbox label and as a tag
    const tags = screen.getAllByText('Minimalist')
    expect(tags.length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('button', { name: 'Remove Minimalist filter' })).toBeInTheDocument()
  })

  it('removes brand tag when × is clicked', () => {
    const { onChange } = renderPanel({ brands: ['Minimalist'] })
    fireEvent.click(screen.getByRole('button', { name: 'Remove Minimalist filter' }))
    expect(onChange).toHaveBeenCalledWith({ ...EMPTY_FILTERS, brands: [] })
  })
})

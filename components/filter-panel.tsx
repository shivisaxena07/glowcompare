'use client'

import { X } from 'lucide-react'

const SUB_CAT_OPTIONS: Record<string, { value: string; label: string }[]> = {
  skincare: [
    { value: 'cleanser', label: 'Cleanser' },
    { value: 'moisturiser', label: 'Moisturiser' },
    { value: 'serum', label: 'Serum' },
    { value: 'sunscreen', label: 'Sunscreen' },
    { value: 'toner', label: 'Toner' },
    { value: 'eye_cream', label: 'Eye Cream' },
  ],
  makeup: [
    { value: 'foundation', label: 'Foundation' },
    { value: 'concealer', label: 'Concealer' },
    { value: 'blush', label: 'Blush' },
    { value: 'lipstick', label: 'Lipstick' },
    { value: 'mascara', label: 'Mascara' },
    { value: 'eyeshadow', label: 'Eyeshadow' },
  ],
}

export interface FilterState {
  subCategories: string[]
  brands: string[]
  minPrice: string
  maxPrice: string
}

export const EMPTY_FILTERS: FilterState = {
  subCategories: [],
  brands: [],
  minPrice: '',
  maxPrice: '',
}

interface FilterPanelProps {
  category?: string
  availableBrands: string[]
  filters: FilterState
  onChange: (filters: FilterState) => void
}

export function FilterPanel({ category, availableBrands, filters, onChange }: FilterPanelProps) {
  const subCatOptions = category ? (SUB_CAT_OPTIONS[category] ?? []) : []

  function toggleSubCat(value: string) {
    const next = filters.subCategories.includes(value)
      ? filters.subCategories.filter((v) => v !== value)
      : [...filters.subCategories, value]
    onChange({ ...filters, subCategories: next })
  }

  function toggleBrand(value: string) {
    const next = filters.brands.includes(value)
      ? filters.brands.filter((v) => v !== value)
      : [...filters.brands, value]
    onChange({ ...filters, brands: next })
  }

  const hasActiveFilters =
    filters.subCategories.length > 0 ||
    filters.brands.length > 0 ||
    filters.minPrice !== '' ||
    filters.maxPrice !== ''

  return (
    <div className="space-y-3">
      {/* Sub-category chips — only on category pages */}
      {subCatOptions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {subCatOptions.map(({ value, label }) => {
            const active = filters.subCategories.includes(value)
            return (
              <button
                key={value}
                onClick={() => toggleSubCat(value)}
                aria-pressed={active}
                className={`border-2 px-4 py-1.5 text-xs font-bold transition-all duration-200 ${
                  active
                    ? 'border-glow-black bg-glow-black text-white'
                    : 'border-glow-black bg-white text-glow-black hover:bg-glow-primary/10'
                }`}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {/* Brand dropdown + price range row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Brand dropdown */}
        {availableBrands.length > 0 && (
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition-colors duration-150 hover:border-stone-300">
              Brand
              {filters.brands.length > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {filters.brands.length}
                </span>
              )}
              <span className="ml-0.5 text-stone-400 transition-transform duration-150 group-open:rotate-180">
                ▾
              </span>
            </summary>
            <div className="absolute left-0 top-full z-20 mt-1.5 min-w-44 rounded-xl border border-stone-200 bg-white p-2 shadow-md">
              {availableBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 transition-colors duration-100 hover:bg-stone-50"
                >
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="h-3.5 w-3.5 accent-rose-500"
                  />
                  <span className="text-xs font-medium text-stone-700">{brand}</span>
                </label>
              ))}
            </div>
          </details>
        )}

        {/* Price range */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-stone-400">₹</span>
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            min={0}
            onChange={(e) => onChange({ ...filters, minPrice: e.target.value })}
            className="w-20 rounded-xl border border-stone-200 px-2 py-1.5 text-xs text-stone-700 outline-none transition-colors duration-150 focus:border-rose-400"
          />
          <span className="text-xs text-stone-400">–</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            min={0}
            onChange={(e) => onChange({ ...filters, maxPrice: e.target.value })}
            className="w-20 rounded-xl border border-stone-200 px-2 py-1.5 text-xs text-stone-700 outline-none transition-colors duration-150 focus:border-rose-400"
          />
        </div>

        {/* Clear all */}
        {hasActiveFilters && (
          <button
            onClick={() => onChange(EMPTY_FILTERS)}
            className="flex items-center gap-1 text-xs font-semibold text-rose-500 transition-colors duration-150 hover:text-rose-600"
          >
            <X className="h-3 w-3" />
            Clear filters
          </button>
        )}
      </div>

      {/* Active filter tags */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5">
          {filters.subCategories.map((sc) => (
            <span
              key={sc}
              className="inline-flex items-center gap-1 rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-700"
            >
              {sc.replace('_', ' ')}
              <button onClick={() => toggleSubCat(sc)} aria-label={`Remove ${sc} filter`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {filters.brands.map((b) => (
            <span
              key={b}
              className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-600"
            >
              {b}
              <button onClick={() => toggleBrand(b)} aria-label={`Remove ${b} filter`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

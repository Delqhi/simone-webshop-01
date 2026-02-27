'use client'

import { Check, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { Category } from '@/types'

export interface FilterState {
  categories: string[]
  priceRange: [number, number]
  inStock: boolean | null
  sortBy: string
  search: string
}

interface ProductFiltersProps {
  categories: Category[]
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  minPrice?: number
  maxPrice?: number
  productCount?: number
}

export const defaultFilterState: FilterState = {
  categories: [],
  priceRange: [0, 1000],
  inStock: null,
  sortBy: 'newest',
  search: '',
}

const SORT_OPTIONS = [
  { value: 'newest', label: 'Neueste zuerst' },
  { value: 'price-asc', label: 'Preis aufsteigend' },
  { value: 'price-desc', label: 'Preis absteigend' },
  { value: 'name-asc', label: 'Name A-Z' },
  { value: 'name-desc', label: 'Name Z-A' },
  { value: 'popular', label: 'Beliebtheit' },
]

export function ProductFilters({
  categories,
  filters,
  onFiltersChange,
  minPrice = 0,
  maxPrice = 1000,
  productCount = 0,
}: ProductFiltersProps) {
  const setValue = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleCategory = (categoryId: string) => {
    if (filters.categories.includes(categoryId)) {
      setValue(
        'categories',
        filters.categories.filter((value) => value !== categoryId),
      )
      return
    }
    setValue('categories', [...filters.categories, categoryId])
  }

  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [minPrice, maxPrice],
      inStock: null,
      sortBy: 'newest',
      search: filters.search,
    })
  }

  const hasFilters =
    filters.categories.length > 0 ||
    filters.inStock !== null ||
    filters.priceRange[0] !== minPrice ||
    filters.priceRange[1] !== maxPrice

  return (
    <section className="glass-card sticky top-24 rounded-[1.8rem] p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-2">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-brand-text">
          <SlidersHorizontal className="h-4 w-4 text-brand-text" />
          Filter
        </h2>
        <span className="rounded-full border border-brand-border bg-white px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-brand-text-muted">
          {productCount} Treffer
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-[0.1em] text-brand-text-muted" htmlFor="sortBy">
            Sortierung
          </label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(event) => setValue('sortBy', event.target.value)}
            className="w-full rounded-2xl border border-brand-border bg-white px-3 py-2.5 text-sm text-brand-text focus:border-black focus:outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-brand-text-muted">Kategorien</p>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const selected = filters.categories.includes(category.id)
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  aria-pressed={selected}
                  className={[
                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                    selected
                      ? 'border-black bg-black text-white'
                      : 'border-brand-border bg-white text-brand-text hover:border-black/30',
                  ].join(' ')}
                >
                  {selected ? <Check className="h-3 w-3" /> : null}
                  {category.name}
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-brand-text-muted">Preisbereich</p>
          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-brand-text-muted">Min</span>
              <input
                type="number"
                min={minPrice}
                max={filters.priceRange[1]}
                value={filters.priceRange[0]}
                onChange={(event) => setValue('priceRange', [Number(event.target.value), filters.priceRange[1]])}
                className="w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:border-black focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-brand-text-muted">Max</span>
              <input
                type="number"
                min={filters.priceRange[0]}
                max={maxPrice}
                value={filters.priceRange[1]}
                onChange={(event) => setValue('priceRange', [filters.priceRange[0], Number(event.target.value)])}
                className="w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:border-black focus:outline-none"
              />
            </label>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.1em] text-brand-text-muted">Verfuegbarkeit</p>
          <div className="grid gap-2">
            {[
              { label: 'Alle Produkte', value: null as boolean | null },
              { label: 'Auf Lager', value: true },
              { label: 'Nicht verfugbar', value: false },
            ].map((option) => {
              const selected = filters.inStock === option.value
              return (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setValue('inStock', option.value)}
                  className={[
                    'rounded-xl border px-3 py-2 text-left text-sm font-medium transition-colors',
                    selected
                      ? 'border-black bg-black text-white'
                      : 'border-brand-border bg-white text-brand-text hover:border-black/30',
                  ].join(' ')}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {hasFilters ? (
        <div className="mt-6">
          <Button variant="outline" fullWidth onClick={clearFilters}>
            Filter zurucksetzen
          </Button>
        </div>
      ) : null}
    </section>
  )
}

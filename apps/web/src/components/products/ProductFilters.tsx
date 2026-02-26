'use client'

import { SlidersHorizontal } from 'lucide-react'
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
    <section className="panel sticky top-24 p-5">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 text-base font-semibold text-brand-text">
          <SlidersHorizontal className="h-4 w-4 text-brand-accent" />
          Filter
        </h2>
        <span className="text-xs text-brand-text-muted">{productCount} Treffer</span>
      </div>

      <div className="space-y-5">
        <label className="block text-sm font-medium text-brand-text" htmlFor="sortBy">
          Sortierung
        </label>
        <select
          id="sortBy"
          value={filters.sortBy}
          onChange={(event) => setValue('sortBy', event.target.value)}
          className="w-full rounded-xl border border-brand-border bg-white px-3 py-2 text-sm text-brand-text focus:border-brand-accent focus:outline-none"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div>
          <p className="text-sm font-medium text-brand-text">Kategorien</p>
          <div className="mt-2 space-y-2">
            {categories.map((category) => (
              <label key={category.id} className="flex cursor-pointer items-center gap-2 text-sm text-brand-text">
                <input
                  type="checkbox"
                  checked={filters.categories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                  className="h-4 w-4 rounded border-brand-border text-brand-accent"
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-brand-text">Preisbereich</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <input
              type="number"
              min={minPrice}
              max={filters.priceRange[1]}
              value={filters.priceRange[0]}
              onChange={(event) => setValue('priceRange', [Number(event.target.value), filters.priceRange[1]])}
              className="rounded-xl border border-brand-border px-3 py-2 text-sm"
            />
            <input
              type="number"
              min={filters.priceRange[0]}
              max={maxPrice}
              value={filters.priceRange[1]}
              onChange={(event) => setValue('priceRange', [filters.priceRange[0], Number(event.target.value)])}
              className="rounded-xl border border-brand-border px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-brand-text">Verfügbarkeit</p>
          <div className="mt-2 space-y-1 text-sm text-brand-text">
            <label className="flex items-center gap-2">
              <input type="radio" checked={filters.inStock === null} onChange={() => setValue('inStock', null)} />
              Alle Produkte
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={filters.inStock === true} onChange={() => setValue('inStock', true)} />
              Auf Lager
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" checked={filters.inStock === false} onChange={() => setValue('inStock', false)} />
              Nicht verfügbar
            </label>
          </div>
        </div>
      </div>

      {hasFilters ? (
        <div className="mt-6">
          <Button variant="outline" fullWidth onClick={clearFilters}>
            Filter zurücksetzen
          </Button>
        </div>
      ) : null}
    </section>
  )
}

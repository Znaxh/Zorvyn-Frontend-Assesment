import { ArrowDown, ArrowUp, Search, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTransactionStore } from '../../store/useTransactionStore'
import type { Category } from '../../types'

const CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Housing',
  'Healthcare',
  'Shopping',
  'Salary',
  'Freelance',
  'Investment',
  'Other',
]

export function FilterBar() {
  const filters = useTransactionStore((s) => s.filters)
  const setFilter = useTransactionStore((s) => s.setFilter)
  const resetFilters = useTransactionStore((s) => s.resetFilters)

  const [searchInput, setSearchInput] = useState(filters.search)

  useEffect(() => {
    setSearchInput(filters.search)
  }, [filters.search])

  useEffect(() => {
    const t = window.setTimeout(() => {
      setFilter('search', searchInput)
    }, 300)
    return () => window.clearTimeout(t)
  }, [searchInput, setFilter])

  const anyActive =
    filters.search.trim() !== '' ||
    filters.category !== 'all' ||
    filters.type !== 'all' ||
    filters.dateFrom !== null ||
    filters.dateTo !== null

  const toggleSortOrder = () => {
    setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')
  }

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            placeholder="Search transactions..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface py-2 pl-10 pr-3 font-sans text-sm text-primary placeholder:text-muted focus:border-border-hover focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {(['all', 'income', 'expense'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilter('type', t)}
              className={`rounded-full px-4 py-1.5 font-sans text-xs font-medium capitalize ${
                filters.type === t
                  ? 'bg-blue text-white'
                  : 'border border-border bg-card text-secondary hover:text-primary'
              }`}
            >
              {t === 'all' ? 'All' : t === 'income' ? 'Income' : 'Expense'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
        <div className="flex min-w-[160px] flex-1 flex-col gap-1">
          <label className="font-sans text-xs text-muted">Category</label>
          <select
            value={filters.category}
            onChange={(e) =>
              setFilter('category', e.target.value as typeof filters.category)
            }
            className="rounded-lg border border-border bg-surface px-3 py-2 font-sans text-sm text-primary focus:border-border-hover focus:outline-none"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex min-w-[140px] flex-1 flex-col gap-1">
          <label className="font-sans text-xs text-muted">Date From</label>
          <input
            type="date"
            value={filters.dateFrom ?? ''}
            onChange={(e) => setFilter('dateFrom', e.target.value || null)}
            className="rounded-lg border border-border bg-surface px-3 py-2 font-sans text-sm text-primary focus:border-border-hover focus:outline-none"
          />
        </div>
        <div className="flex min-w-[140px] flex-1 flex-col gap-1">
          <label className="font-sans text-xs text-muted">Date To</label>
          <input
            type="date"
            value={filters.dateTo ?? ''}
            onChange={(e) => setFilter('dateTo', e.target.value || null)}
            className="rounded-lg border border-border bg-surface px-3 py-2 font-sans text-sm text-primary focus:border-border-hover focus:outline-none"
          />
        </div>
        <div className="flex min-w-[140px] flex-1 flex-col gap-1">
          <label className="font-sans text-xs text-muted">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilter('sortBy', e.target.value as typeof filters.sortBy)
            }
            className="rounded-lg border border-border bg-surface px-3 py-2 font-sans text-sm text-primary focus:border-border-hover focus:outline-none"
          >
            <option value="date">Date</option>
            <option value="amount">Amount</option>
            <option value="category">Category</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleSortOrder}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-primary hover:bg-card-hover"
            aria-label={filters.sortOrder === 'asc' ? 'Ascending' : 'Descending'}
          >
            {filters.sortOrder === 'asc' ? (
              <ArrowUp className="h-4 w-4" />
            ) : (
              <ArrowDown className="h-4 w-4" />
            )}
          </button>
        </div>
        {anyActive && (
          <button
            type="button"
            onClick={resetFilters}
            className="flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 font-sans text-sm text-secondary hover:text-primary"
          >
            <X className="h-4 w-4" />
            Reset All
          </button>
        )}
      </div>
    </div>
  )
}

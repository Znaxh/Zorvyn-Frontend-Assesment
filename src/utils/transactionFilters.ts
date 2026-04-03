import type { Transaction } from '../types'

export interface TransactionFiltersState {
  search: string
  category: string | 'all'
  type: 'all' | 'income' | 'expense'
  dateFrom: string | null
  dateTo: string | null
  sortBy: 'date' | 'amount' | 'category'
  sortOrder: 'asc' | 'desc'
}

export function applyTransactionFilters(
  transactions: Transaction[],
  filters: TransactionFiltersState
): Transaction[] {
  let list = [...transactions]

  if (filters.search.trim()) {
    const q = filters.search.toLowerCase()
    list = list.filter((t) => t.description.toLowerCase().includes(q))
  }
  if (filters.category !== 'all') {
    list = list.filter((t) => t.category === filters.category)
  }
  if (filters.type !== 'all') {
    list = list.filter((t) => t.type === filters.type)
  }
  if (filters.dateFrom) {
    list = list.filter((t) => t.date >= filters.dateFrom!)
  }
  if (filters.dateTo) {
    list = list.filter((t) => t.date <= filters.dateTo!)
  }

  const dir = filters.sortOrder === 'asc' ? 1 : -1
  list.sort((a, b) => {
    if (filters.sortBy === 'amount') {
      return (a.amount - b.amount) * dir
    }
    if (filters.sortBy === 'category') {
      return a.category.localeCompare(b.category) * dir
    }
    return (a.date < b.date ? -1 : a.date > b.date ? 1 : 0) * dir
  })

  return list
}

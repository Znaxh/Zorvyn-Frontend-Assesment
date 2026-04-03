import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockTransactions } from '../data/mockData'
import type { Transaction } from '../types'
import { applyTransactionFilters } from '../utils/transactionFilters'

const defaultFilters = {
  search: '',
  category: 'all' as string | 'all',
  type: 'all' as 'all' | 'income' | 'expense',
  dateFrom: null as string | null,
  dateTo: null as string | null,
  sortBy: 'date' as 'date' | 'amount' | 'category',
  sortOrder: 'desc' as 'asc' | 'desc',
}

export interface TransactionStore {
  transactions: Transaction[]
  filters: typeof defaultFilters
  selectedIds: string[]
  flashRowId: string | null
  addTransaction: (t: Omit<Transaction, 'id'>) => void
  editTransaction: (id: string, updates: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  deleteSelected: () => void
  setFilter: <K extends keyof TransactionStore['filters']>(
    key: K,
    value: TransactionStore['filters'][K]
  ) => void
  resetFilters: () => void
  toggleSelect: (id: string) => void
  selectAll: () => void
  clearSelection: () => void
  clearFlashRow: () => void
}

export const useTransactionStore = create<TransactionStore>()(
  persist(
    (set, get) => ({
      transactions: mockTransactions,
      filters: { ...defaultFilters },
      selectedIds: [],
      flashRowId: null,
      addTransaction: (t) => {
        const nums = get().transactions
          .map((x) => {
            const m = /^txn-(\d+)$/.exec(x.id)
            return m ? parseInt(m[1], 10) : 0
          })
          .filter((n) => n > 0)
        const next = (nums.length ? Math.max(...nums) : 0) + 1
        const id = `txn-${String(next).padStart(3, '0')}`
        set((s) => ({
          transactions: [{ ...t, id }, ...s.transactions],
          flashRowId: id,
        }))
        window.setTimeout(() => {
          get().clearFlashRow()
        }, 1500)
      },
      editTransaction: (id, updates) =>
        set((s) => ({
          transactions: s.transactions.map((x) =>
            x.id === id ? { ...x, ...updates } : x
          ),
        })),
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((x) => x.id !== id),
          selectedIds: s.selectedIds.filter((x) => x !== id),
        })),
      deleteSelected: () =>
        set((s) => {
          const setIds = new Set(s.selectedIds)
          return {
            transactions: s.transactions.filter((x) => !setIds.has(x.id)),
            selectedIds: [],
          }
        }),
      setFilter: (key, value) =>
        set((s) => ({
          filters: { ...s.filters, [key]: value },
        })),
      resetFilters: () => set({ filters: { ...defaultFilters } }),
      toggleSelect: (id) =>
        set((s) => ({
          selectedIds: s.selectedIds.includes(id)
            ? s.selectedIds.filter((x) => x !== id)
            : [...s.selectedIds, id],
        })),
      selectAll: () =>
        set((s) => ({
          selectedIds: applyTransactionFilters(s.transactions, s.filters).map((t) => t.id),
        })),
      clearSelection: () => set({ selectedIds: [] }),
      clearFlashRow: () => set({ flashRowId: null }),
    }),
    {
      name: 'zorvyn-txns',
      partialize: (state) => ({ transactions: state.transactions }),
    }
  )
)

import { useMemo } from 'react'
import { useTransactionStore } from '../store/useTransactionStore'
import { applyTransactionFilters } from '../utils/transactionFilters'

export function useFilteredTransactions() {
  const transactions = useTransactionStore((s) => s.transactions)
  const filters = useTransactionStore((s) => s.filters)

  return useMemo(
    () => applyTransactionFilters(transactions, filters),
    [transactions, filters]
  )
}

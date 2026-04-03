import { useMemo } from 'react'
import { useTransactionStore } from '../store/useTransactionStore'
import { getInsights, type InsightsResult } from '../utils/calculations'

export type InsightsBundle = InsightsResult

export function useInsights(): InsightsBundle {
  const transactions = useTransactionStore((s) => s.transactions)
  return useMemo(() => getInsights(transactions), [transactions])
}

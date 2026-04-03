import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export type Category =
  | 'Food'
  | 'Transport'
  | 'Housing'
  | 'Healthcare'
  | 'Shopping'
  | 'Salary'
  | 'Freelance'
  | 'Investment'
  | 'Other'

export type TransactionType = 'income' | 'expense'

export type TransactionStatus = 'completed' | 'pending' | 'failed'

export interface Transaction {
  id: string
  date: string
  description: string
  category: Category
  type: TransactionType
  amount: number
  status: TransactionStatus
  note?: string
}

export interface MonthlyDatum {
  month: string
  income: number
  expenses: number
  balance: number
}

export interface BudgetDatum {
  category: Category
  budget: number
  spent: number
}

export type ActivePage =
  | 'overview'
  | 'transactions'
  | 'analytics'
  | 'insights'
  | 'budget'
  | 'reports'

export type AppRole = 'viewer' | 'editor' | 'admin'

export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export interface KPICardProps {
  title: string
  value: number
  subtitle: string
  trend: string
  trendPositive: boolean
  icon: LucideIcon
  sparklineData: number[]
}

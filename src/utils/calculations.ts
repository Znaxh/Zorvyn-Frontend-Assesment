import { monthlyData } from '../data/mockData'
import type { Category, Transaction } from '../types'

export interface TotalsResult {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  transactionCount: number
}

export function getTotals(transactions: Transaction[]): TotalsResult {
  let totalIncome = 0
  let totalExpenses = 0
  for (const t of transactions) {
    if (t.type === 'income') totalIncome += t.amount
    else totalExpenses += t.amount
  }
  return {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    transactionCount: transactions.length,
  }
}

export interface MonthlyTotalRow {
  month: string
  income: number
  expenses: number
  net: number
}

const monthLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

export function getMonthlyTotals(transactions: Transaction[]): MonthlyTotalRow[] {
  const map = new Map<
    string,
    { income: number; expenses: number; order: number }
  >()
  for (const t of transactions) {
    const d = new Date(t.date + 'T12:00:00')
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (!map.has(key)) {
      map.set(key, { income: 0, expenses: 0, order: d.getMonth() + d.getFullYear() * 12 })
    }
    const row = map.get(key)!
    if (t.type === 'income') row.income += t.amount
    else row.expenses += t.amount
  }
  return [...map.entries()]
    .sort((a, b) => a[1].order - b[1].order)
    .map(([key, v]) => {
      const monthNum = parseInt(key.split('-')[1], 10) - 1
      return {
        month: monthLabels[monthNum] ?? key,
        income: v.income,
        expenses: v.expenses,
        net: v.income - v.expenses,
      }
    })
}

export function groupByCategory(
  transactions: Transaction[]
): Record<
  Category,
  { count: number; total: number; percentage: number }
> {
  const categories: Category[] = [
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
  const base = Object.fromEntries(
    categories.map((c) => [c, { count: 0, total: 0, percentage: 0 }])
  ) as Record<Category, { count: number; total: number; percentage: number }>

  let grand = 0
  for (const t of transactions) {
    base[t.category].count += 1
    base[t.category].total += t.amount
    grand += t.amount
  }
  if (grand > 0) {
    for (const c of categories) {
      base[c].percentage = (base[c].total / grand) * 100
    }
  }
  return base
}

export function getTopCategory(transactions: Transaction[]): {
  category: Category
  total: number
} | null {
  const expenses = transactions.filter((t) => t.type === 'expense')
  const map = new Map<Category, number>()
  for (const t of expenses) {
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }
  let best: Category | null = null
  let max = 0
  for (const [c, v] of map) {
    if (v > max) {
      max = v
      best = c
    }
  }
  return best ? { category: best, total: max } : null
}

export function getSavingsRate(transactions: Transaction[]): number {
  const { totalIncome, totalExpenses } = getTotals(transactions)
  if (totalIncome <= 0) return 0
  return ((totalIncome - totalExpenses) / totalIncome) * 100
}

export interface InsightsResult {
  topSpendCategory: { category: Category; total: number; pctOfExpenses: number } | null
  bestSavingMonth: { month: string; saved: number } | null
  avgMonthlyExpense: number
  savingsRate: number
  mostFrequentCategory: { category: Category; count: number } | null
  monthsAboveBudget: number
  anomalies: Transaction[]
}

export function getInsights(transactions: Transaction[]): InsightsResult {
  const expenses = transactions.filter((t) => t.type === 'expense')
  const totalExpenseSum = expenses.reduce((s, t) => s + t.amount, 0)
  const top = getTopCategory(transactions)
  const pct = top && totalExpenseSum > 0 ? (top.total / totalExpenseSum) * 100 : 0

  let best: { month: string; saved: number } | null = null
  for (const m of monthlyData) {
    const saved = m.income - m.expenses
    if (!best || saved > best.saved) {
      best = { month: m.month, saved }
    }
  }

  const avgMonthlyExpense =
    monthlyData.reduce((s, m) => s + m.expenses, 0) / monthlyData.length

  const savingsRate = getSavingsRate(transactions)

  const freqMap = new Map<Category, number>()
  for (const t of transactions) {
    freqMap.set(t.category, (freqMap.get(t.category) ?? 0) + 1)
  }
  let mostFrequent: { category: Category; count: number } | null = null
  for (const [category, count] of freqMap) {
    if (!mostFrequent || count > mostFrequent.count) {
      mostFrequent = { category, count }
    }
  }

  const monthsAboveBudget = monthlyData.filter((m) => m.expenses > 50000).length

  return {
    topSpendCategory:
      top && totalExpenseSum > 0
        ? { category: top.category, total: top.total, pctOfExpenses: pct }
        : null,
    bestSavingMonth: best,
    avgMonthlyExpense,
    savingsRate,
    mostFrequentCategory: mostFrequent,
    monthsAboveBudget,
    anomalies: detectAnomalies(transactions),
  }
}

export function detectAnomalies(transactions: Transaction[]): Transaction[] {
  const byCat = new Map<Category, number[]>()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    const arr = byCat.get(t.category) ?? []
    arr.push(t.amount)
    byCat.set(t.category, arr)
  }
  const averages = new Map<Category, number>()
  for (const [c, amounts] of byCat) {
    const sum = amounts.reduce((a, b) => a + b, 0)
    averages.set(c, sum / amounts.length)
  }
  return transactions.filter((t) => {
    if (t.type !== 'expense') return false
    const avg = averages.get(t.category) ?? 0
    if (avg <= 0) return false
    return t.amount > 2 * avg
  })
}

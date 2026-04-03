import { motion } from 'framer-motion'
import {
  Bus,
  CheckCircle2,
  HeartPulse,
  Home,
  ShoppingCart,
  Utensils,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { budgetData } from '../data/mockData'
import { BudgetCard } from '../components/budget/BudgetCard'
import { BudgetProgressBar } from '../components/budget/BudgetProgressBar'
import { EmptyState } from '../components/ui/EmptyState'
import { formatCurrency } from '../utils/formatters'
import type { Category } from '../types'

const ICONS: Record<Category, LucideIcon> = {
  Food: Utensils,
  Transport: Bus,
  Housing: Home,
  Healthcare: HeartPulse,
  Shopping: ShoppingCart,
  Salary: Wallet,
  Freelance: Wallet,
  Investment: Wallet,
  Other: Wallet,
}

export function BudgetPage() {
  const totalBudget = budgetData.reduce((s, b) => s + b.budget, 0)
  const totalSpent = budgetData.reduce((s, b) => s + b.spent, 0)
  const overallPct = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0
  const overAny = budgetData.some((b) => b.spent > b.budget)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-sans text-sm font-medium text-secondary">Total budgeted</p>
          <p className="mt-2 font-syne text-3xl font-bold tabular-nums tracking-tight text-primary">
            {formatCurrency(totalBudget)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-sans text-sm font-medium text-secondary">Total spent</p>
          <p className="mt-2 font-syne text-3xl font-bold tabular-nums tracking-tight text-primary">
            {formatCurrency(totalSpent)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <p className="font-sans text-sm font-medium text-secondary">Overall utilization</p>
        <p className="mt-2 font-syne text-lg font-medium text-primary">
          {overallPct.toFixed(0)}% used
        </p>
        <div className="mt-4">
          <BudgetProgressBar
            percentUsed={overallPct}
            overBudget={totalSpent > totalBudget}
          />
        </div>
      </div>

      {!overAny && (
        <EmptyState
          icon={CheckCircle2}
          title="On track!"
          description="All categories are within budget"
        />
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {budgetData.map((b) => (
          <BudgetCard
            key={b.category}
            category={b.category}
            budget={b.budget}
            spent={b.spent}
            icon={ICONS[b.category]}
          />
        ))}
      </div>
    </motion.div>
  )
}

import type { LucideIcon } from 'lucide-react'
import type { Category } from '../../types'
import { formatCurrency } from '../../utils/formatters'
import { BudgetProgressBar } from './BudgetProgressBar'

interface BudgetCardProps {
  category: Category
  budget: number
  spent: number
  icon: LucideIcon
}

export function BudgetCard({ category, budget, spent, icon: Icon }: BudgetCardProps) {
  const remaining = budget - spent
  const percentUsed = budget > 0 ? (spent / budget) * 100 : 0
  const overBudget = spent > budget

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-blue" aria-hidden />
          <h3 className="font-syne text-lg font-medium text-primary">{category}</h3>
        </div>
        {overBudget && (
          <span className="rounded-full bg-red-dim px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-widest text-red">
            Over budget
          </span>
        )}
      </div>
      <dl className="mt-4 space-y-2 font-sans text-sm">
        <div className="flex justify-between">
          <dt className="text-secondary">Budget</dt>
          <dd className="tabular-nums text-primary">{formatCurrency(budget)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-secondary">Spent</dt>
          <dd className="tabular-nums text-primary">{formatCurrency(spent)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-secondary">Remaining</dt>
          <dd
            className={`tabular-nums font-medium ${remaining >= 0 ? 'text-green' : 'text-red'}`}
          >
            {formatCurrency(remaining)}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-secondary">Used</dt>
          <dd className="tabular-nums text-muted">{percentUsed.toFixed(0)}%</dd>
        </div>
      </dl>
      <div className="mt-4">
        <BudgetProgressBar percentUsed={percentUsed} overBudget={overBudget} />
      </div>
    </div>
  )
}

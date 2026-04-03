import { motion } from 'framer-motion'
import {
  AlertTriangle,
  BarChart2,
  CheckCircle,
  PiggyBank,
  RefreshCw,
  ShoppingBag,
  Target,
} from 'lucide-react'
import { monthlyData } from '../data/mockData'
import { AnomalyAlert } from '../components/insights/AnomalyAlert'
import { InsightCard } from '../components/insights/InsightCard'
import { SavingsGauge } from '../components/insights/SavingsGauge'
import { EmptyState } from '../components/ui/EmptyState'
import { formatCurrency, formatPercent } from '../utils/formatters'
import { useInsights } from '../hooks/useInsights'

export function InsightsPage() {
  const {
    topSpendCategory,
    bestSavingMonth,
    avgMonthlyExpense,
    savingsRate,
    mostFrequentCategory,
    monthsAboveBudget,
    anomalies,
  } = useInsights()

  const overBudgetMonths = monthlyData.filter((m) => m.expenses > 50000)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <InsightCard
          title="Highest spending category"
          value={topSpendCategory ? topSpendCategory.category : '—'}
          subtitle={
            topSpendCategory
              ? `${formatCurrency(topSpendCategory.total)} · ${formatPercent(
                  topSpendCategory.pctOfExpenses,
                  1
                )} of expenses`
              : undefined
          }
          icon={ShoppingBag}
          accent="amber"
        />
        <InsightCard
          title="Best saving month"
          value={bestSavingMonth ? bestSavingMonth.month : '—'}
          subtitle={
            bestSavingMonth
              ? `Saved ${formatCurrency(bestSavingMonth.saved)}`
              : undefined
          }
          icon={PiggyBank}
          accent="green"
        />
        <InsightCard
          title="Average monthly expense"
          value={formatCurrency(avgMonthlyExpense)}
          subtitle="Based on Jan–Jun 2025 summary"
          icon={BarChart2}
          accent="blue"
        />
        <div className="rounded-xl border border-border bg-card p-5 ring-1 ring-blue/30">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-sans text-sm font-medium text-secondary">Savings rate</p>
              <p className="mt-1 font-sans text-xs text-muted">
                (Total income − Total expenses) ÷ Total income
              </p>
            </div>
            <div className="rounded-lg bg-blue-dim p-2">
              <Target className="h-5 w-5 text-blue" aria-hidden />
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <SavingsGauge ratePercent={savingsRate} />
          </div>
        </div>
        <InsightCard
          title="Most frequent category"
          value={mostFrequentCategory ? mostFrequentCategory.category : '—'}
          subtitle={
            mostFrequentCategory
              ? `${mostFrequentCategory.count} transactions`
              : undefined
          }
          icon={RefreshCw}
          accent="purple"
        />
        <InsightCard
          title="Months above ₹50k expenses"
          value={String(monthsAboveBudget)}
          subtitle={
            overBudgetMonths.length
              ? overBudgetMonths.map((m) => m.month).join(', ')
              : 'None'
          }
          icon={AlertTriangle}
          accent="red"
        />
      </div>

      <div>
        <h2 className="font-syne text-lg font-medium text-primary">Spending anomalies</h2>
        <div className="mt-4 space-y-3">
          {anomalies.length === 0 ? (
            <EmptyState
              icon={CheckCircle}
              title="No unusual spending detected"
              description="No unusual transactions detected"
            />
          ) : (
            anomalies.map((t) => <AnomalyAlert key={t.id} transaction={t} />)
          )}
        </div>
      </div>
    </motion.div>
  )
}

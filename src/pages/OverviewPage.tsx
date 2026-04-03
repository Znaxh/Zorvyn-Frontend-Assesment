import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react'
import { useMemo } from 'react'
import { monthlyData } from '../data/mockData'
import { useAppStore } from '../store/useAppStore'
import { useTransactionStore } from '../store/useTransactionStore'
import { BalanceAreaChart } from '../components/charts/BalanceAreaChart'
import { SpendingDonutChart } from '../components/charts/SpendingDonutChart'
import { KPICard } from '../components/ui/KPICard'
import { SkeletonCard } from '../components/ui/SkeletonCard'
import { CategoryBadge } from '../components/ui/CategoryBadge'
import { StatusPill } from '../components/ui/StatusPill'
import { formatCurrency, formatDate } from '../utils/formatters'

const kpiContainer = {
  show: {
    transition: { staggerChildren: 0.08 },
  },
}

const kpiItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
}

export function OverviewPage() {
  const isLoading = useAppStore((s) => s.isLoading)
  const setActivePage = useAppStore((s) => s.setActivePage)
  const transactions = useTransactionStore((s) => s.transactions)

  const balances = monthlyData.map((m) => m.balance)
  const incomes = monthlyData.map((m) => m.income)
  const expenses = monthlyData.map((m) => m.expenses)

  const june = monthlyData[5]
  const may = monthlyData[4]
  const balanceTrend =
    may.balance > 0 ? (((june.balance - may.balance) / may.balance) * 100).toFixed(1) : '0'
  const incomeTrend =
    may.income > 0 ? (((june.income - may.income) / may.income) * 100).toFixed(1) : '0'
  const expenseTrend =
    may.expenses > 0 ? (((june.expenses - may.expenses) / may.expenses) * 100).toFixed(1) : '0'

  const recent = useMemo(() => {
    return [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5)
  }, [transactions])

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[7fr_5fr]">
          <div className="h-[280px] animate-pulse rounded-xl border border-border bg-card" />
          <div className="h-[280px] animate-pulse rounded-xl border border-border bg-card" />
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-6"
    >
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        variants={kpiContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={kpiItem}>
          <KPICard
            title="Total Balance"
            value={june.balance}
            subtitle="Current balance"
            trend={`+${balanceTrend}%`}
            trendPositive
            icon={Wallet}
            sparklineData={balances}
          />
        </motion.div>
        <motion.div variants={kpiItem}>
          <KPICard
            title="Monthly Income"
            value={june.income}
            subtitle="This month"
            trend={`${Number(incomeTrend) >= 0 ? '+' : ''}${incomeTrend}%`}
            trendPositive={Number(incomeTrend) >= 0}
            icon={TrendingUp}
            sparklineData={incomes}
          />
        </motion.div>
        <motion.div variants={kpiItem}>
          <KPICard
            title="Monthly Expenses"
            value={june.expenses}
            subtitle="This month"
            trend={`+${expenseTrend}%`}
            trendPositive={false}
            icon={TrendingDown}
            sparklineData={expenses}
          />
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[7fr_5fr]">
        <BalanceAreaChart data={monthlyData} />
        <SpendingDonutChart transactions={transactions} />
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-syne text-lg font-medium text-primary">Recent transactions</h2>
          <button
            type="button"
            onClick={() => setActivePage('transactions')}
            className="rounded-lg bg-blue px-4 py-2 font-sans text-sm font-medium text-white"
          >
            View all
          </button>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead>
              <tr className="border-b border-border font-sans text-xs font-medium uppercase tracking-wider text-secondary">
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Description</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Amount</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((t) => (
                <tr key={t.id} className="border-b border-border last:border-0">
                  <td className="py-3 pr-3 font-sans text-sm tabular-nums text-primary">
                    {formatDate(t.date)}
                  </td>
                  <td className="max-w-[200px] truncate py-3 pr-3 font-sans text-sm text-primary">
                    {t.description}
                  </td>
                  <td className="py-3 pr-3">
                    <CategoryBadge category={t.category} />
                  </td>
                  <td
                    className={`py-3 pr-3 font-sans text-sm tabular-nums ${
                      t.type === 'income' ? 'text-green' : 'text-red'
                    }`}
                  >
                    {t.type === 'income' ? '+' : '-'}
                    {formatCurrency(t.amount)}
                  </td>
                  <td className="py-3">
                    <StatusPill status={t.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

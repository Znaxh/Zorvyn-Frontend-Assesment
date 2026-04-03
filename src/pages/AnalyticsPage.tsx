import { motion } from 'framer-motion'
import { monthlyData } from '../data/mockData'
import { useTransactionStore } from '../store/useTransactionStore'
import { CashflowWaterfallChart } from '../components/charts/CashflowWaterfallChart'
import { CategoryTrendChart } from '../components/charts/CategoryTrendChart'
import { IncomeExpenseBarChart } from '../components/charts/IncomeExpenseBarChart'

export function AnalyticsPage() {
  const transactions = useTransactionStore((s) => s.transactions)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <IncomeExpenseBarChart data={monthlyData} />
        <CategoryTrendChart transactions={transactions} />
      </div>
      <CashflowWaterfallChart data={monthlyData} />
    </motion.div>
  )
}

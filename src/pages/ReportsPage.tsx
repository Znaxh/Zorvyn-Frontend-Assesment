import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { Lock } from 'lucide-react'
import { useTransactionStore } from '../store/useTransactionStore'
import { PermissionTooltip } from '../components/ui/PermissionTooltip'
import { formatCurrency } from '../utils/formatters'
import { exportCSV, exportJSON } from '../utils/exportData'
import { usePermission } from '../hooks/usePermission'

type Preset = 'month' | '3m' | '6m' | 'all' | 'custom'

function endOfToday(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

function startOfMonth(): string {
  const d = new Date()
  return format(new Date(d.getFullYear(), d.getMonth(), 1), 'yyyy-MM-dd')
}

function shiftMonths(monthsBack: number): string {
  const d = new Date()
  const t = new Date(d.getFullYear(), d.getMonth() - monthsBack, 1)
  return format(t, 'yyyy-MM-dd')
}

export function ReportsPage() {
  const allTransactions = useTransactionStore((s) => s.transactions)
  const { canExport } = usePermission()

  const [preset, setPreset] = useState<Preset>('6m')
  const [customFrom, setCustomFrom] = useState<string>('')
  const [customTo, setCustomTo] = useState<string>('')

  const range = useMemo(() => {
    const end = endOfToday()
    if (preset === 'custom' && customFrom && customTo) {
      return { from: customFrom, to: customTo }
    }
    if (preset === 'month') {
      return { from: startOfMonth(), to: end }
    }
    if (preset === '3m') {
      return { from: shiftMonths(2), to: end }
    }
    if (preset === '6m') {
      return { from: shiftMonths(5), to: end }
    }
    if (preset === 'all') {
      const dates = allTransactions.map((t) => t.date).sort()
      return {
        from: dates[0] ?? '2025-01-01',
        to: dates[dates.length - 1] ?? end,
      }
    }
    return { from: shiftMonths(5), to: end }
  }, [preset, customFrom, customTo, allTransactions])

  const scoped = useMemo(() => {
    return allTransactions.filter((t) => t.date >= range.from && t.date <= range.to)
  }, [allTransactions, range])

  const totals = useMemo(() => {
    let income = 0
    let expense = 0
    for (const t of scoped) {
      if (t.type === 'income') income += t.amount
      else expense += t.amount
    }
    return {
      count: scoped.length,
      income,
      expense,
      net: income - expense,
    }
  }, [scoped])

  const breakdown = useMemo(() => {
    const map = new Map<string, { count: number; total: number }>()
    for (const t of scoped) {
      const cur = map.get(t.category) ?? { count: 0, total: 0 }
      cur.count += 1
      cur.total += t.amount
      map.set(t.category, cur)
    }
    const grand = scoped.reduce((s, t) => s + t.amount, 0)
    return [...map.entries()]
      .map(([category, v]) => ({
        category,
        count: v.count,
        total: v.total,
        pct: grand > 0 ? (v.total / grand) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total)
  }, [scoped])

  const stamp = format(new Date(), 'yyyy-MM-dd')
  const filenameBase = `zorvyn-transactions-${stamp}`

  const handleExportCsv = () => {
    exportCSV(scoped, `${filenameBase}.csv`)
    toast.success('CSV file downloaded')
  }

  const handleExportJson = () => {
    exportJSON(scoped, `${filenameBase}.json`)
    toast.success('JSON file downloaded')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-8"
    >
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-syne text-lg font-medium text-primary">Date range</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ['month', 'This Month'],
              ['3m', 'Last 3 Months'],
              ['6m', 'Last 6 Months'],
              ['all', 'All Time'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setPreset(key)}
              className={`rounded-lg px-3 py-1.5 font-sans text-xs font-medium ${
                preset === key
                  ? 'bg-blue text-white'
                  : 'border border-border bg-surface text-secondary hover:text-primary'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPreset('custom')}
            className={`rounded-lg px-3 py-1.5 font-sans text-xs font-medium ${
              preset === 'custom'
                ? 'bg-blue text-white'
                : 'border border-border bg-surface text-secondary hover:text-primary'
            }`}
          >
            Custom
          </button>
        </div>
        {preset === 'custom' && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex flex-col gap-1">
              <label className="font-sans text-xs text-muted">From</label>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="rounded-lg border border-border bg-surface px-3 py-2 font-sans text-sm text-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-sans text-xs text-muted">To</label>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="rounded-lg border border-border bg-surface px-3 py-2 font-sans text-sm text-primary"
              />
            </div>
          </div>
        )}
        <p className="mt-3 font-sans text-xs text-muted">
          Showing {range.from} → {range.to}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-sans text-sm font-medium text-secondary">Total transactions</p>
          <p className="mt-2 font-syne text-3xl font-bold tabular-nums text-primary">
            {totals.count}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-sans text-sm font-medium text-secondary">Total income</p>
          <p className="mt-2 font-syne text-3xl font-bold tabular-nums text-green">
            {formatCurrency(totals.income)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-sans text-sm font-medium text-secondary">Total expenses</p>
          <p className="mt-2 font-syne text-3xl font-bold tabular-nums text-red">
            {formatCurrency(totals.expense)}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <p className="font-sans text-sm font-medium text-secondary">Net balance</p>
          <p className="mt-2 font-syne text-3xl font-bold tabular-nums text-primary">
            {formatCurrency(totals.net)}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-syne text-lg font-medium text-primary">Transaction breakdown</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left">
            <thead>
              <tr className="border-b border-border font-sans text-xs font-medium uppercase tracking-wider text-secondary">
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Count</th>
                <th className="py-2 pr-3">Total amount</th>
                <th className="py-2">% of total</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((row) => (
                <tr key={row.category} className="border-b border-border last:border-0">
                  <td className="py-3 pr-3 font-sans text-sm text-primary">{row.category}</td>
                  <td className="py-3 pr-3 font-sans text-sm tabular-nums text-primary">
                    {row.count}
                  </td>
                  <td className="py-3 pr-3 font-sans text-sm tabular-nums text-primary">
                    {formatCurrency(row.total)}
                  </td>
                  <td className="py-3 font-sans text-sm tabular-nums text-muted">
                    {row.pct.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        {canExport ? (
          <>
            <button
              type="button"
              onClick={handleExportCsv}
              className="rounded-lg bg-blue px-4 py-2 font-sans text-sm font-medium text-white"
            >
              Export as CSV
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              className="rounded-lg border border-border bg-card px-4 py-2 font-sans text-sm font-medium text-primary"
            >
              Export as JSON
            </button>
          </>
        ) : (
          <PermissionTooltip message="This action requires Admin role">
            <span className="inline-flex flex-wrap gap-3">
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg bg-blue/40 px-4 py-2 font-sans text-sm font-medium text-white opacity-40"
              >
                <Lock className="h-3.5 w-3.5" />
                Export as CSV
              </button>
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-lg border border-border px-4 py-2 font-sans text-sm font-medium opacity-40"
              >
                <Lock className="h-3.5 w-3.5" />
                Export as JSON
              </button>
            </span>
          </PermissionTooltip>
        )}
      </div>
    </motion.div>
  )
}

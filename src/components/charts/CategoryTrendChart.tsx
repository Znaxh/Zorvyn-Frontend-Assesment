import { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Category, Transaction } from '../../types'
import { formatCurrency } from '../../utils/formatters'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] as const

const CAT_COLORS: Partial<Record<Category, string>> = {
  Food: '#10B981',
  Transport: '#378ADD',
  Housing: '#8B5CF6',
  Healthcare: '#EF4444',
  Shopping: '#F59E0B',
  Other: '#6B7280',
}

interface CategoryTrendChartProps {
  transactions: Transaction[]
}

export function CategoryTrendChart({ transactions }: CategoryTrendChartProps) {
  const { chartData, topCats } = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense')
    const totals = new Map<Category, number>()
    for (const t of expenses) {
      totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount)
    }
    const sorted = [...totals.entries()].sort((a, b) => b[1] - a[1])
    const top = sorted.slice(0, 4).map(([c]) => c)

    const byMonthCat = new Map<string, Partial<Record<Category, number>>>()
    for (const m of MONTHS) {
      byMonthCat.set(m, {})
    }
    for (const t of expenses) {
      const d = new Date(t.date + 'T12:00:00')
      const label = MONTHS[d.getMonth()]
      if (!label || !top.includes(t.category)) continue
      const row = byMonthCat.get(label)!
      row[t.category] = (row[t.category] ?? 0) + t.amount
    }

    const rows = MONTHS.map((m) => {
      const slice = byMonthCat.get(m) ?? {}
      const point: Record<string, string | number> = { month: m }
      for (const c of top) {
        point[c] = slice[c] ?? 0
      }
      return point
    })

    return { chartData: rows, topCats: top }
  }, [transactions])

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-syne text-lg font-medium text-primary">Category Spending Trends</h2>
      <div className="mb-4 mt-4 flex flex-wrap gap-4 font-sans text-sm">
        {topCats.map((c) => (
          <span key={c} className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: CAT_COLORS[c] ?? '#6B7280' }}
            />
            <span className="text-secondary">{c}</span>
          </span>
        ))}
      </div>
      <div className="h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--color-border)" />
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => formatCurrency(Number(v))}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'var(--color-bg-card)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
              }}
            />
            {topCats.map((c) => (
              <Line
                key={c}
                type="monotone"
                dataKey={c}
                stroke={CAT_COLORS[c] ?? '#6B7280'}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Sector } from 'recharts'
import type { Category, Transaction } from '../../types'
import { formatCurrency } from '../../utils/formatters'

const SLICE_ORDER: { key: Category; color: string }[] = [
  { key: 'Food', color: '#10B981' },
  { key: 'Transport', color: '#378ADD' },
  { key: 'Housing', color: '#8B5CF6' },
  { key: 'Healthcare', color: '#EF4444' },
  { key: 'Shopping', color: '#F59E0B' },
  { key: 'Other', color: '#6B7280' },
]

function bucketCategory(c: Category): Category {
  const direct = SLICE_ORDER.find((s) => s.key === c)
  if (direct) return c
  return 'Other'
}

interface Row {
  name: string
  value: number
  color: string
}

interface SpendingDonutChartProps {
  transactions: Transaction[]
}

export function SpendingDonutChart({ transactions }: SpendingDonutChartProps) {
  const [active, setActive] = useState<number | undefined>()

  const data = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === 'expense')
    const sums = new Map<Category, number>()
    for (const t of expenses) {
      const b = bucketCategory(t.category)
      sums.set(b, (sums.get(b) ?? 0) + t.amount)
    }
    const rows: Row[] = []
    for (const s of SLICE_ORDER) {
      const v = sums.get(s.key) ?? 0
      if (v > 0) rows.push({ name: s.key, value: v, color: s.color })
    }
    return rows
  }, [transactions])

  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data])

  const renderActive = (props: object) => {
    const p = props as {
      cx?: number
      cy?: number
      innerRadius?: number
      outerRadius?: number
      startAngle?: number
      endAngle?: number
      fill?: string
    }
    return (
      <Sector
        cx={p.cx ?? 0}
        cy={p.cy ?? 0}
        innerRadius={p.innerRadius ?? 0}
        outerRadius={Number(p.outerRadius ?? 0) * 1.05}
        startAngle={p.startAngle ?? 0}
        endAngle={p.endAngle ?? 0}
        fill={p.fill ?? '#6B7280'}
        style={{ transition: 'all 0.2s ease-out' }}
      />
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-syne text-lg font-medium text-primary">Spending Breakdown</h2>
      <div className="relative mx-auto mt-4 h-[240px] w-full max-w-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              onMouseEnter={(_, i) => setActive(i)}
              onMouseLeave={() => setActive(undefined)}
              activeIndex={active}
              activeShape={renderActive}
            >
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pt-2">
          <p className="font-syne text-lg font-semibold tabular-nums text-primary">
            {formatCurrency(total)}
          </p>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-widest text-muted">
            Total
          </p>
        </div>
      </div>
      <ul className="mt-4 space-y-2">
        {data.map((d) => {
          const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : '0'
          return (
            <li key={d.name} className="flex items-center gap-2 font-sans text-sm">
              <span
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: d.color }}
              />
              <span className="flex-1 text-primary">{d.name}</span>
              <span className="tabular-nums text-secondary">{formatCurrency(d.value)}</span>
              <span className="w-12 text-right tabular-nums text-muted">{pct}%</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

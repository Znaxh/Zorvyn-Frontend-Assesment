import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthlyDatum } from '../../types'
import { formatCurrency } from '../../utils/formatters'

interface CashflowWaterfallChartProps {
  data: MonthlyDatum[]
}

export function CashflowWaterfallChart({ data }: CashflowWaterfallChartProps) {
  const chartData = data.map((m) => ({
    month: m.month,
    net: m.income - m.expenses,
  }))

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-syne text-lg font-medium text-primary">Monthly Net Cashflow</h2>
      <div className="mt-4 h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
            <ReferenceLine y={0} stroke="var(--color-text-muted)" strokeDasharray="4 4" />
            <Bar dataKey="net" radius={[4, 4, 0, 0]}>
              {chartData.map((e, i) => (
                <Cell key={i} fill={e.net >= 0 ? '#10B981' : '#EF4444'} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

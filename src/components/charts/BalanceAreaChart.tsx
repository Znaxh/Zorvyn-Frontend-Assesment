import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthlyDatum } from '../../types'
import { formatCurrency } from '../../utils/formatters'

interface BalanceAreaChartProps {
  data: MonthlyDatum[]
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: { payload: MonthlyDatum }[]
}) {
  if (!active || !payload?.length) return null
  const row = payload[0].payload
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-none">
      <p className="font-sans text-xs text-secondary">{row.month}</p>
      <p className="font-sans text-sm font-medium tabular-nums text-primary">
        {formatCurrency(row.balance)}
      </p>
    </div>
  )
}

export function BalanceAreaChart({ data }: BalanceAreaChartProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-syne text-lg font-medium text-primary">Balance Trend</h2>
      <p className="mt-1 font-sans text-xs font-normal text-muted">Jan – Jun 2025</p>
      <div className="mt-4 h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#378ADD" stopOpacity={0.7} />
                <stop offset="100%" stopColor="#378ADD" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              vertical={false}
              stroke="var(--color-border)"
            />
            <XAxis
              dataKey="month"
              tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#378ADD"
              strokeWidth={2}
              fill="url(#balGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

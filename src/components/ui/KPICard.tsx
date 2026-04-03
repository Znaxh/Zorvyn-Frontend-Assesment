import { useMotionValueEvent, useSpring } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { KPICardProps } from '../../types'
import { formatCurrency } from '../../utils/formatters'
import { SparklineChart } from '../charts/SparklineChart'

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendPositive,
  icon: Icon,
  sparklineData,
}: KPICardProps) {
  const spring = useSpring(0, { stiffness: 100, damping: 30, restDelta: 0.001 })
  const [display, setDisplay] = useState(formatCurrency(0))
  const stroke = trendPositive ? '#10B981' : '#EF4444'

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  useMotionValueEvent(spring, 'change', (v) => {
    setDisplay(formatCurrency(Math.round(v)))
  })

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <span className="font-sans text-sm font-medium text-secondary">{title}</span>
        <Icon className="h-5 w-5 text-blue" aria-hidden />
      </div>
      <p className="mt-2 font-syne text-3xl font-bold tabular-nums tracking-tight text-primary">
        {display}
      </p>
      <p className="mt-1 font-sans text-xs font-normal text-muted">{subtitle}</p>
      <div className="mt-2 flex items-center gap-1 font-sans text-xs font-medium">
        {trendPositive ? (
          <TrendingUp className="h-3.5 w-3.5 text-green" aria-hidden />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-red" aria-hidden />
        )}
        <span className={trendPositive ? 'text-green' : 'text-red'}>{trend}</span>
      </div>
      <div className="mt-3">
        <SparklineChart data={sparklineData} color={stroke} />
      </div>
    </div>
  )
}

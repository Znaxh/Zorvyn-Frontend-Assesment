import { motion, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import { formatPercent } from '../../utils/formatters'

interface SavingsGaugeProps {
  ratePercent: number
}

export function SavingsGauge({ ratePercent }: SavingsGaugeProps) {
  const clamped = Math.max(0, Math.min(100, ratePercent))
  const radius = 50
  const circumference = Math.PI * radius
  const color =
    clamped > 30 ? '#10B981' : clamped >= 15 ? '#F59E0B' : '#EF4444'

  const targetOffset = circumference * (1 - clamped / 100)
  const spring = useSpring(circumference, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  useEffect(() => {
    spring.set(targetOffset)
  }, [targetOffset, spring])

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="80" viewBox="0 0 120 70" className="overflow-visible">
        <path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <motion.path
          d="M 10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: spring }}
        />
      </svg>
      <p className="-mt-2 font-syne text-2xl font-bold tabular-nums text-primary">
        {formatPercent(clamped, 1)}
      </p>
      <p className="mt-1 font-sans text-xs text-muted">Savings Rate</p>
    </div>
  )
}

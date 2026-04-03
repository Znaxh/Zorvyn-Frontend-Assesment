import { useEffect, useRef, useState } from 'react'

interface BudgetProgressBarProps {
  percentUsed: number
  overBudget: boolean
}

export function BudgetProgressBar({ percentUsed, overBudget }: BudgetProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const scale = Math.max(0, percentUsed / 100)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) setVisible(true)
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const fillClass = overBudget
    ? 'bg-red animate-budget-pulse'
    : percentUsed >= 80
      ? 'bg-amber'
      : 'bg-green'

  return (
    <div
      ref={ref}
      className="h-1.5 w-full overflow-hidden rounded-full bg-border"
    >
      <div
        className={`h-full w-full origin-left rounded-full ${fillClass}`}
        style={{
          transform: `scaleX(${visible ? scale : 0})`,
          transition: 'transform 600ms ease-out',
        }}
      />
    </div>
  )
}

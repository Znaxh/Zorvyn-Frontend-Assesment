import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type Accent = 'amber' | 'green' | 'blue' | 'purple' | 'red'

const accentRing: Record<Accent, string> = {
  amber: 'ring-amber/40',
  green: 'ring-green/40',
  blue: 'ring-blue/40',
  purple: 'ring-[#8B5CF6]/40',
  red: 'ring-red/40',
}

interface InsightCardProps {
  title: string
  value: ReactNode
  subtitle?: string
  icon: LucideIcon
  accent: Accent
}

export function InsightCard({ title, value, subtitle, icon: Icon, accent }: InsightCardProps) {
  return (
    <div
      className={`rounded-xl border border-border bg-card p-5 ring-1 ${accentRing[accent]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-sans text-sm font-medium text-secondary">{title}</p>
          <div className="mt-2 font-syne text-2xl font-semibold tracking-tight text-primary">
            {value}
          </div>
          {subtitle ? (
            <p className="mt-1 font-sans text-xs text-muted">{subtitle}</p>
          ) : null}
        </div>
        <div className="rounded-lg bg-blue-dim p-2">
          <Icon className="h-5 w-5 text-blue" aria-hidden />
        </div>
      </div>
    </div>
  )
}

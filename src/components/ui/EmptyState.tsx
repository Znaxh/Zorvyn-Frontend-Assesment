import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <Icon className="h-12 w-12 text-muted" strokeWidth={1.25} />
      <h3 className="font-syne text-lg font-medium text-primary">{title}</h3>
      <p className="max-w-sm font-sans text-sm text-secondary">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  )
}

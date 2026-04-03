import type { ReactNode } from 'react'

interface PermissionTooltipProps {
  children: ReactNode
  /** Tooltip text (native `title`). */
  message?: string
}

export function PermissionTooltip({
  children,
  message = 'This action requires Editor or Admin role',
}: PermissionTooltipProps) {
  return (
    <span className="inline-flex" title={message}>
      {children}
    </span>
  )
}

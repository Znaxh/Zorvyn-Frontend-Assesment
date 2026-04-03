import type { TransactionStatus } from '../../types'

interface StatusPillProps {
  status: TransactionStatus
}

export function StatusPill({ status }: StatusPillProps) {
  const map: Record<
    TransactionStatus,
    { label: string; className: string }
  > = {
    completed: {
      label: 'Completed',
      className: 'bg-green-dim text-green',
    },
    pending: {
      label: 'Pending',
      className: 'bg-amber-dim text-amber',
    },
    failed: {
      label: 'Failed',
      className: 'bg-red-dim text-red',
    },
  }
  const m = map[status]
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-widest ${m.className}`}
    >
      {m.label}
    </span>
  )
}

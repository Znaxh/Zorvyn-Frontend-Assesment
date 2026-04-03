import { AlertTriangle } from 'lucide-react'
import type { Transaction } from '../../types'
import { formatCurrency, formatDate } from '../../utils/formatters'

interface AnomalyAlertProps {
  transaction: Transaction
}

export function AnomalyAlert({ transaction: t }: AnomalyAlertProps) {
  return (
    <div className="flex gap-3 rounded-xl border border-border bg-amber-dim p-4">
      <AlertTriangle className="h-5 w-5 shrink-0 text-amber" aria-hidden />
      <p className="font-sans text-sm text-primary">
        Unusual {t.category} spend: {formatCurrency(t.amount)} on {formatDate(t.date)} —{' '}
        {t.description}
      </p>
    </div>
  )
}

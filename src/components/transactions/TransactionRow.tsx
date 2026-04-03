import type { Row } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import type { Transaction } from '../../types'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { CategoryBadge } from '../ui/CategoryBadge'
import { StatusPill } from '../ui/StatusPill'

interface TransactionRowProps {
  row: Row<Transaction>
  showCheckbox: boolean
  showActions: boolean
  canEdit: boolean
  canDelete: boolean
  isSelected: boolean
  isFlashing: boolean
  onToggleSelect: () => void
  onEdit: () => void
  onDelete: () => void
}

export function TransactionRow({
  row,
  showCheckbox,
  showActions,
  canEdit,
  canDelete,
  isSelected,
  isFlashing,
  onToggleSelect,
  onEdit,
  onDelete,
}: TransactionRowProps) {
  const t = row.original
  const desc =
    t.description.length > 40 ? `${t.description.slice(0, 40)}…` : t.description

  return (
    <tr
      className={`border-b border-border ${isFlashing ? 'row-flash' : ''} ${
        isSelected ? 'bg-blue-dim/20' : 'hover:bg-card-hover'
      }`}
    >
      {showCheckbox && (
        <td className="w-10 px-3 py-3">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="h-4 w-4 rounded border-border"
            aria-label={`Select ${t.id}`}
          />
        </td>
      )}
      <td className="whitespace-nowrap px-3 py-3 font-sans text-sm tabular-nums text-primary">
        {formatDate(t.date)}
      </td>
      <td className="max-w-[200px] px-3 py-3 font-sans text-sm text-primary" title={t.description}>
        {desc}
      </td>
      <td className="px-3 py-3">
        <CategoryBadge category={t.category} />
      </td>
      <td className="px-3 py-3">
        <span
          className={`font-sans text-[10px] font-semibold uppercase tracking-widest ${
            t.type === 'income' ? 'text-green' : 'text-red'
          }`}
        >
          {t.type === 'income' ? 'Income' : 'Expense'}
        </span>
      </td>
      <td
        className={`px-3 py-3 font-sans text-sm tabular-nums ${
          t.type === 'income' ? 'text-green' : 'text-red'
        }`}
      >
        {t.type === 'income' ? '+' : '-'}
        {formatCurrency(t.amount)}
      </td>
      <td className="px-3 py-3">
        <StatusPill status={t.status} />
      </td>
      {showActions && (
        <td className="whitespace-nowrap px-3 py-3">
          <div className="flex gap-2">
            {canEdit && (
              <button
                type="button"
                onClick={onEdit}
                className="rounded-lg p-1.5 text-blue hover:bg-card-hover"
                aria-label="Edit transaction"
              >
                <Pencil className="h-4 w-4" />
              </button>
            )}
            {canDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="rounded-lg p-1.5 text-red hover:bg-card-hover"
                aria-label="Delete transaction"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  )
}

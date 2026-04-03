import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { useAppStore } from '../../store/useAppStore'
import { useTransactionStore } from '../../store/useTransactionStore'
import type { Transaction } from '../../types'
import { useFilteredTransactions } from '../../hooks/useFilteredTransactions'
import { usePermission } from '../../hooks/usePermission'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { EmptyState } from '../ui/EmptyState'
import { Receipt } from 'lucide-react'
import { TransactionRow } from './TransactionRow'
import { TransactionModal } from './TransactionModal'

export function TransactionTable() {
  const data = useFilteredTransactions()
  const role = useAppStore((s) => s.role)
  const isLoading = useAppStore((s) => s.isLoading)
  const filters = useTransactionStore((s) => s.filters)
  const setFilter = useTransactionStore((s) => s.setFilter)
  const selectedIds = useTransactionStore((s) => s.selectedIds)
  const toggleSelect = useTransactionStore((s) => s.toggleSelect)
  const selectAll = useTransactionStore((s) => s.selectAll)
  const clearSelection = useTransactionStore((s) => s.clearSelection)
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction)
  const resetFilters = useTransactionStore((s) => s.resetFilters)
  const flashRowId = useTransactionStore((s) => s.flashRowId)

  const { canEdit, canDelete } = usePermission()

  const showCheckbox = role === 'admin' || role === 'editor'
  const showActions = role === 'admin' || role === 'editor'

  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const anyFilterActive =
    filters.search.trim() !== '' ||
    filters.category !== 'all' ||
    filters.type !== 'all' ||
    filters.dateFrom !== null ||
    filters.dateTo !== null

  const columns = useMemo<ColumnDef<Transaction>[]>(() => [{ id: '_', accessorFn: () => null }], [])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const pageRows = table.getRowModel().rows
  const allFilteredSelected =
    data.length > 0 && data.every((t) => selectedIds.includes(t.id))

  const toggleHeaderSelect = useCallback(() => {
    if (allFilteredSelected) {
      clearSelection()
    } else {
      selectAll()
    }
  }, [allFilteredSelected, clearSelection, selectAll])

  const handleSortClick = (key: 'date' | 'amount' | 'category') => {
    if (filters.sortBy === key) {
      setFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setFilter('sortBy', key)
      setFilter('sortOrder', 'desc')
    }
  }

  const sortIndicator = (key: 'date' | 'amount' | 'category') => {
    if (filters.sortBy !== key) return ''
    return filters.sortOrder === 'asc' ? ' ↑' : ' ↓'
  }

  if (isLoading) {
    return null
  }

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No transactions found"
        description={
          anyFilterActive
            ? 'Try adjusting your filters'
            : 'There are no transactions to display'
        }
        action={
          anyFilterActive ? (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-lg bg-blue px-4 py-2 font-sans text-sm font-medium text-white"
            >
              Reset filters
            </button>
          ) : undefined
        }
      />
    )
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border bg-surface/50">
              {showCheckbox && (
                <th className="w-10 px-3 py-3">
                  <input
                    type="checkbox"
                    checked={allFilteredSelected}
                    onChange={toggleHeaderSelect}
                    className="h-4 w-4 rounded border-border"
                    aria-label="Select all on page"
                  />
                </th>
              )}
              <th className="px-3 py-3">
                <button
                  type="button"
                  onClick={() => handleSortClick('date')}
                  className="font-sans text-xs font-medium uppercase tracking-wider text-secondary hover:text-primary"
                >
                  Date{sortIndicator('date')}
                </button>
              </th>
              <th className="px-3 py-3 font-sans text-xs font-medium uppercase tracking-wider text-secondary">
                Description
              </th>
              <th className="px-3 py-3">
                <button
                  type="button"
                  onClick={() => handleSortClick('category')}
                  className="font-sans text-xs font-medium uppercase tracking-wider text-secondary hover:text-primary"
                >
                  Category{sortIndicator('category')}
                </button>
              </th>
              <th className="px-3 py-3 font-sans text-xs font-medium uppercase tracking-wider text-secondary">
                Type
              </th>
              <th className="px-3 py-3">
                <button
                  type="button"
                  onClick={() => handleSortClick('amount')}
                  className="font-sans text-xs font-medium uppercase tracking-wider text-secondary hover:text-primary"
                >
                  Amount{sortIndicator('amount')}
                </button>
              </th>
              <th className="px-3 py-3 font-sans text-xs font-medium uppercase tracking-wider text-secondary">
                Status
              </th>
              {showActions && (
                <th className="px-3 py-3 font-sans text-xs font-medium uppercase tracking-wider text-secondary">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <TransactionRow
                key={row.id}
                row={row}
                showCheckbox={showCheckbox}
                showActions={showActions}
                canEdit={canEdit}
                canDelete={canDelete}
                isSelected={selectedIds.includes(row.original.id)}
                isFlashing={flashRowId === row.original.id}
                onToggleSelect={() => toggleSelect(row.original.id)}
                onEdit={() => setEditId(row.original.id)}
                onDelete={() => setDeleteId(row.original.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-xs text-muted">
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}–
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            data.length
          )}{' '}
          of {data.length} transactions
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
            className="rounded-lg border border-border bg-card px-3 py-1.5 font-sans text-sm text-primary disabled:opacity-40"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
            className="rounded-lg border border-border bg-card px-3 py-1.5 font-sans text-sm text-primary disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      <TransactionModal
        open={editId !== null}
        mode="edit"
        transactionId={editId}
        onClose={() => setEditId(null)}
      />

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete transaction"
        message="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onCancel={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteTransaction(deleteId)
            toast.success('Transaction deleted')
          }
          setDeleteId(null)
        }}
      />
    </>
  )
}

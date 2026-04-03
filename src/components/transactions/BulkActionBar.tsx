import { useState } from 'react'
import toast from 'react-hot-toast'
import { useTransactionStore } from '../../store/useTransactionStore'
import { ConfirmDialog } from '../ui/ConfirmDialog'

export function BulkActionBar() {
  const selectedIds = useTransactionStore((s) => s.selectedIds)
  const clearSelection = useTransactionStore((s) => s.clearSelection)
  const deleteSelected = useTransactionStore((s) => s.deleteSelected)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (selectedIds.length === 0) return null

  const handleDelete = () => {
    const n = selectedIds.length
    deleteSelected()
    toast.success(`${n} transactions deleted`)
    setConfirmOpen(false)
  }

  return (
    <>
      <div className="fixed bottom-6 left-1/2 z-40 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-none md:left-[calc(50%+7.5rem)]">
        <span className="font-sans text-sm text-primary">{selectedIds.length} selected</span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="rounded-lg bg-red px-3 py-1.5 font-sans text-sm font-medium text-white"
          >
            Delete Selected
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="rounded-lg border border-border px-3 py-1.5 font-sans text-sm text-primary"
          >
            Clear
          </button>
        </div>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title="Delete selected transactions"
        message={`Delete ${selectedIds.length} transactions? This cannot be undone.`}
        confirmLabel="Delete all"
        destructive
        onCancel={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </>
  )
}

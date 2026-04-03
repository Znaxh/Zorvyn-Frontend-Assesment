import { motion } from 'framer-motion'
import { Lock, Plus } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '../store/useAppStore'
import { BulkActionBar } from '../components/transactions/BulkActionBar'
import { FilterBar } from '../components/transactions/FilterBar'
import { TransactionModal } from '../components/transactions/TransactionModal'
import { TransactionTable } from '../components/transactions/TransactionTable'
import { PermissionTooltip } from '../components/ui/PermissionTooltip'
import { SkeletonRow } from '../components/ui/SkeletonRow'
import { usePermission } from '../hooks/usePermission'

export function TransactionsPage() {
  const isLoading = useAppStore((s) => s.isLoading)
  const role = useAppStore((s) => s.role)
  const [addOpen, setAddOpen] = useState(false)
  const { canAdd } = usePermission()

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="space-y-6 pb-24"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-sm text-secondary">
          Manage income and expenses. Use filters to narrow results.
        </p>
        {canAdd ? (
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue px-4 py-2 font-sans text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Add transaction
          </button>
        ) : (
          <PermissionTooltip>
            <span className="inline-flex">
              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-lg bg-blue/40 px-4 py-2 font-sans text-sm font-medium text-white opacity-40"
              >
                <Lock className="h-3.5 w-3.5" />
                Add transaction
              </button>
            </span>
          </PermissionTooltip>
        )}
      </div>

      <FilterBar />

      {isLoading ? (
        <div className="space-y-2 rounded-xl border border-border bg-card p-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : (
        <TransactionTable />
      )}

      <TransactionModal open={addOpen} mode="add" transactionId={null} onClose={() => setAddOpen(false)} />

      {role === 'admin' && <BulkActionBar />}
    </motion.div>
  )
}

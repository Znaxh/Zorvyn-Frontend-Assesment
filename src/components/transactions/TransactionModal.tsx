import { AnimatePresence, motion } from 'framer-motion'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useTransactionStore } from '../../store/useTransactionStore'
import type { Category, TransactionStatus, TransactionType } from '../../types'

const CATEGORIES: Category[] = [
  'Food',
  'Transport',
  'Housing',
  'Healthcare',
  'Shopping',
  'Salary',
  'Freelance',
  'Investment',
  'Other',
]

interface TransactionModalProps {
  open: boolean
  mode: 'add' | 'edit'
  transactionId: string | null
  onClose: () => void
}

interface FormErrors {
  description?: string
  amount?: string
  category?: string
  date?: string
  note?: string
}

const emptyForm = () => ({
  description: '',
  amount: '',
  type: 'expense' as TransactionType,
  category: 'Food' as Category,
  date: format(new Date(), 'yyyy-MM-dd'),
  status: 'completed' as TransactionStatus,
  note: '',
})

export function TransactionModal({ open, mode, transactionId, onClose }: TransactionModalProps) {
  const transactions = useTransactionStore((s) => s.transactions)
  const addTransaction = useTransactionStore((s) => s.addTransaction)
  const editTransaction = useTransactionStore((s) => s.editTransaction)

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})

  useEffect(() => {
    if (!open) return
    setErrors({})
    if (mode === 'edit' && transactionId) {
      const t = transactions.find((x) => x.id === transactionId)
      if (t) {
        setForm({
          description: t.description,
          amount: String(t.amount),
          type: t.type,
          category: t.category,
          date: t.date,
          status: t.status,
          note: t.note ?? '',
        })
        return
      }
    }
    setForm(emptyForm())
  }, [open, mode, transactionId, transactions])

  const validate = (): boolean => {
    const e: FormErrors = {}
    if (!form.description.trim()) e.description = 'Required'
    const amt = Number(form.amount)
    if (!form.amount || Number.isNaN(amt) || amt < 1) e.amount = 'Enter amount ≥ 1'
    if (!form.date) e.date = 'Required'
    if (form.note.length > 200) e.note = 'Max 200 characters'
    setErrors(e)
    if (Object.keys(e).length > 0) {
      toast.error('Please fill all required fields')
      return false
    }
    return true
  }

  const handleSave = () => {
    if (!validate()) return
    const amt = Math.round(Number(form.amount))
    const payload = {
      description: form.description.trim(),
      amount: amt,
      type: form.type,
      category: form.category,
      date: form.date,
      status: form.status,
      note: form.note.trim() || undefined,
    }
    if (mode === 'edit' && transactionId) {
      editTransaction(transactionId, payload)
      toast.success('Transaction updated')
    } else {
      addTransaction(payload)
      toast.success('Transaction added successfully')
    }
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="relative z-10 mt-auto w-full max-w-lg rounded-t-xl border border-border bg-card p-5 sm:mx-auto sm:mt-0 sm:rounded-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <h2 className="font-syne text-lg font-medium text-primary">
              {mode === 'add' ? 'Add transaction' : 'Edit transaction'}
            </h2>

            <div className="mt-4 max-h-[70vh] space-y-4 overflow-y-auto">
              <div>
                <label className="font-sans text-xs text-secondary">Description</label>
                <input
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 font-sans text-sm text-primary"
                />
                {errors.description && (
                  <p className="mt-1 font-sans text-xs text-red">{errors.description}</p>
                )}
              </div>
              <div>
                <label className="font-sans text-xs text-secondary">Amount</label>
                <input
                  type="number"
                  min={1}
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 font-sans text-sm tabular-nums text-primary"
                />
                {errors.amount && (
                  <p className="mt-1 font-sans text-xs text-red">{errors.amount}</p>
                )}
              </div>
              <div>
                <span className="font-sans text-xs text-secondary">Type</span>
                <div className="mt-2 flex gap-4">
                  {(['income', 'expense'] as const).map((t) => (
                    <label key={t} className="flex cursor-pointer items-center gap-2 font-sans text-sm text-primary">
                      <input
                        type="radio"
                        name="tx-type"
                        checked={form.type === t}
                        onChange={() => setForm((f) => ({ ...f, type: t }))}
                      />
                      {t === 'income' ? 'Income' : 'Expense'}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-sans text-xs text-secondary">Category</label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value as Category }))
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 font-sans text-sm text-primary"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-sans text-xs text-secondary">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 font-sans text-sm text-primary"
                />
                {errors.date && <p className="mt-1 font-sans text-xs text-red">{errors.date}</p>}
              </div>
              <div>
                <label className="font-sans text-xs text-secondary">Status</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      status: e.target.value as TransactionStatus,
                    }))
                  }
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 font-sans text-sm text-primary"
                >
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="font-sans text-xs text-secondary">Note (optional)</label>
                <textarea
                  value={form.note}
                  maxLength={200}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  className="mt-1 min-h-[80px] w-full rounded-lg border border-border bg-surface px-3 py-2 font-sans text-sm text-primary"
                />
                {errors.note && <p className="mt-1 font-sans text-xs text-red">{errors.note}</p>}
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-border px-4 py-2 font-sans text-sm text-primary hover:bg-card-hover"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-lg bg-blue px-4 py-2 font-sans text-sm font-medium text-white"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

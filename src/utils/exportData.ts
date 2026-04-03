import type { Transaction } from '../types'

function downloadBlob(content: string, filename: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportCSV(transactions: Transaction[], filename: string): void {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Status', 'Note']
  const rows = transactions.map((t) =>
    [
      t.date,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.category,
      t.type,
      String(t.amount),
      t.status,
      t.note ? `"${t.note.replace(/"/g, '""')}"` : '',
    ].join(',')
  )
  const csv = [headers.join(','), ...rows].join('\n')
  downloadBlob(csv, filename, 'text/csv;charset=utf-8')
}

export function exportJSON(transactions: Transaction[], filename: string): void {
  const json = JSON.stringify(transactions, null, 2)
  downloadBlob(json, filename, 'application/json')
}

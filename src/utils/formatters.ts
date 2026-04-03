import { format, parseISO } from 'date-fns'

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return format(parseISO(dateString), 'dd MMM yyyy')
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`
}

export function formatShortCurrency(amount: number): string {
  if (amount >= 100000) {
    const v = amount / 100000
    return `₹${v >= 10 ? v.toFixed(1) : v.toFixed(1)}L`.replace('.0L', 'L')
  }
  if (amount >= 1000) {
    return `₹${Math.round(amount / 1000)}K`
  }
  return `₹${amount}`
}

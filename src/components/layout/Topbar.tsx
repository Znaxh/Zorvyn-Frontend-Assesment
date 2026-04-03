import { Bell, Menu, Search } from 'lucide-react'
import type { ActivePage, AppRole } from '../../types'
import { useAppStore } from '../../store/useAppStore'

const TITLES: Record<ActivePage, string> = {
  overview: 'Overview',
  transactions: 'Transactions',
  analytics: 'Analytics',
  insights: 'Insights',
  budget: 'Budget',
  reports: 'Reports',
}

function roleBadgeClass(role: AppRole): string {
  if (role === 'viewer') return 'bg-muted/30 text-secondary'
  if (role === 'editor') return 'bg-blue-dim text-blue'
  return 'bg-amber-dim text-amber'
}

export function Topbar() {
  const activePage = useAppStore((s) => s.activePage)
  const role = useAppStore((s) => s.role)
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen)

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-primary md:hidden"
          aria-label="Open menu"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="font-syne text-2xl font-semibold tracking-tight text-primary">
          {TITLES[activePage]}
        </h1>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <button
          type="button"
          className="rounded-lg p-2 text-secondary md:hidden"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
        <button
          type="button"
          className="rounded-lg p-2 text-secondary"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
        </button>
        <span
          className={`hidden rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-widest sm:inline-flex ${roleBadgeClass(role)}`}
        >
          {role}
        </span>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue font-sans text-xs font-semibold text-white"
          aria-hidden
        >
          U
        </div>
      </div>
    </header>
  )
}

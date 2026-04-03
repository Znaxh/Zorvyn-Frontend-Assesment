import type { ChangeEvent } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeftRight,
  BarChart3,
  FileText,
  LayoutDashboard,
  Lightbulb,
  PiggyBank,
} from 'lucide-react'
import toast from 'react-hot-toast'
import type { ActivePage, AppRole } from '../../types'
import { useAppStore } from '../../store/useAppStore'
import { ThemeToggle } from '../ui/ThemeToggle'

export const SIDEBAR_PAGES: {
  id: ActivePage
  label: string
  icon: typeof LayoutDashboard
}[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
  { id: 'budget', label: 'Budget', icon: PiggyBank },
  { id: 'reports', label: 'Reports', icon: FileText },
]

function roleBadgeClass(role: AppRole): string {
  if (role === 'viewer') return 'bg-muted/40 text-secondary'
  if (role === 'editor') return 'bg-blue-dim text-blue'
  return 'bg-amber-dim text-amber'
}

interface SidebarProps {
  onNavigate?: () => void
  /** Disable shared layout animation when a second Sidebar instance exists (e.g. mobile drawer). */
  staticNavIndicator?: boolean
}

export function Sidebar({ onNavigate, staticNavIndicator }: SidebarProps) {
  const activePage = useAppStore((s) => s.activePage)
  const setActivePage = useAppStore((s) => s.setActivePage)
  const role = useAppStore((s) => s.role)
  const setRole = useAppStore((s) => s.setRole)

  const handleNav = (id: ActivePage) => {
    setActivePage(id)
    onNavigate?.()
  }

  const handleRole = (e: ChangeEvent<HTMLSelectElement>) => {
    const r = e.target.value as AppRole
    setRole(r)
    const label = r.charAt(0).toUpperCase() + r.slice(1)
    toast(`${label} mode activated`, { icon: '🔑' })
  }

  return (
    <aside className="flex h-full w-60 flex-col border-r border-border bg-surface">
      <div className="border-b border-border p-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue font-syne text-sm font-bold text-white">
            Z
          </div>
          <div>
            <p className="font-syne text-base font-semibold tracking-tight text-primary">Zorvyn</p>
            <p className="font-sans text-xs font-normal text-muted">Finance Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {SIDEBAR_PAGES.map((item) => {
          const active = activePage === item.id
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.id)}
              className={`relative flex w-full items-center gap-3 rounded-lg py-2.5 pl-3 pr-3 text-left font-sans text-sm transition-all duration-150 ease-out ${
                active
                  ? 'bg-card text-primary'
                  : 'text-secondary hover:bg-card hover:text-primary'
              }`}
            >
              {active &&
                (staticNavIndicator ? (
                  <div className="pointer-events-none absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-blue" />
                ) : (
                  <motion.div
                    layoutId="nav-indicator"
                    className="pointer-events-none absolute left-0 top-1 bottom-1 w-0.5 rounded-full bg-blue"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                ))}
              <Icon className="h-5 w-5 shrink-0" aria-hidden />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto space-y-3 border-t border-border p-4">
        <div>
          <p className="mb-1 font-sans text-xs text-muted">Role</p>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-widest ${roleBadgeClass(role)}`}
            >
              {role}
            </span>
            <select
              value={role}
              onChange={handleRole}
              className="min-w-0 flex-1 rounded-lg border border-border bg-card px-2 py-1.5 font-sans text-xs text-primary"
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="h-px bg-border" />
        <ThemeToggle />
      </div>
    </aside>
  )
}

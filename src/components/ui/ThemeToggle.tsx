import { Moon, Sun } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'

export function ThemeToggle() {
  const darkMode = useAppStore((s) => s.darkMode)
  const toggleDarkMode = useAppStore((s) => s.toggleDarkMode)

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-card-hover"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <Sun className="h-4 w-4 text-blue" /> : <Moon className="h-4 w-4 text-blue" />}
      <span className="font-sans text-xs text-secondary">{darkMode ? 'Light mode' : 'Dark mode'}</span>
    </button>
  )
}

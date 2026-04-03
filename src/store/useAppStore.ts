import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ActivePage, AppRole } from '../types'

export interface AppStore {
  activePage: ActivePage
  role: AppRole
  darkMode: boolean
  sidebarOpen: boolean
  isLoading: boolean
  setActivePage: (page: ActivePage) => void
  setRole: (role: AppRole) => void
  toggleDarkMode: () => void
  setSidebarOpen: (open: boolean) => void
  setIsLoading: (loading: boolean) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      activePage: 'overview',
      role: 'admin',
      darkMode: true,
      sidebarOpen: false,
      isLoading: true,
      setActivePage: (page) => set({ activePage: page }),
      setRole: (role) => set({ role }),
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      setIsLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'zorvyn-app',
      partialize: (state) => ({
        darkMode: state.darkMode,
        role: state.role,
        activePage: state.activePage,
      }),
    }
  )
)

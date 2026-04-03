import type { ReactNode } from 'react'
import { MobileDrawer } from './MobileDrawer'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-base">
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:block">
        <Sidebar />
      </div>
      <MobileDrawer />
      <div className="flex min-h-screen flex-1 flex-col md:ml-60">
        <Topbar />
        <main className="flex-1 px-4 py-4 md:px-6 md:py-6">{children}</main>
      </div>
    </div>
  )
}

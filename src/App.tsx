import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Layout } from './components/layout/Layout'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { BudgetPage } from './pages/BudgetPage'
import { InsightsPage } from './pages/InsightsPage'
import { OverviewPage } from './pages/OverviewPage'
import { ReportsPage } from './pages/ReportsPage'
import { TransactionsPage } from './pages/TransactionsPage'
import { useAppStore } from './store/useAppStore'

export default function App() {
  const activePage = useAppStore((s) => s.activePage)
  const darkMode = useAppStore((s) => s.darkMode)
  const setIsLoading = useAppStore((s) => s.setIsLoading)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration((state) => {
      if (state) {
        document.documentElement.classList.toggle('dark', state.darkMode)
      }
    })
    return unsub
  }, [])

  useEffect(() => {
    const t = window.setTimeout(() => setIsLoading(false), 1200)
    return () => window.clearTimeout(t)
  }, [setIsLoading])

  return (
    <>
      <Layout>
        {activePage === 'overview' && <OverviewPage />}
        {activePage === 'transactions' && <TransactionsPage />}
        {activePage === 'analytics' && <AnalyticsPage />}
        {activePage === 'insights' && <InsightsPage />}
        {activePage === 'budget' && <BudgetPage />}
        {activePage === 'reports' && <ReportsPage />}
      </Layout>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1A2235',
            color: '#F9FAFB',
            border: '1px solid #1F2937',
            borderRadius: '12px',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#10B981', secondary: '#1A2235' },
          },
          error: {
            iconTheme: { primary: '#EF4444', secondary: '#1A2235' },
          },
        }}
      />
    </>
  )
}

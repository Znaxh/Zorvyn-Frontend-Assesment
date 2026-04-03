import { AnimatePresence, motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import { Sidebar } from './Sidebar'

export function MobileDrawer() {
  const sidebarOpen = useAppStore((s) => s.sidebarOpen)
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen)

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            className="fixed inset-0 z-50 bg-black/60 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
          <motion.div
            className="fixed left-0 top-0 z-[60] h-full w-60 md:hidden"
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
          >
            <Sidebar staticNavIndicator onNavigate={() => setSidebarOpen(false)} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

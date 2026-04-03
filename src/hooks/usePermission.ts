import { useAppStore } from '../store/useAppStore'

export function usePermission() {
  const role = useAppStore((s) => s.role)
  return {
    canAdd: role === 'editor' || role === 'admin',
    canEdit: role === 'editor' || role === 'admin',
    canDelete: role === 'admin',
    canExport: role === 'admin',
  }
}

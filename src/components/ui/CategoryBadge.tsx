import { useAppStore } from '../../store/useAppStore'
import type { Category } from '../../types'

const darkClasses: Record<Category, string> = {
  Food: 'bg-[#064E3B] text-[#34D399]',
  Transport: 'bg-[#1E3A5F] text-[#60A5FA]',
  Housing: 'bg-[#3B1F5E] text-[#C084FC]',
  Healthcare: 'bg-[#7F1D1D] text-[#F87171]',
  Shopping: 'bg-[#78350F] text-[#FCD34D]',
  Salary: 'bg-[#064E3B] text-[#6EE7B7]',
  Freelance: 'bg-[#1E3A5F] text-[#93C5FD]',
  Investment: 'bg-[#1F2937] text-[#9CA3AF]',
  Other: 'bg-[#1F2937] text-[#9CA3AF]',
}

const lightClasses: Record<Category, string> = {
  Food: 'bg-[#D1FAE5] text-[#065F46]',
  Transport: 'bg-[#DBEAFE] text-[#1D4ED8]',
  Housing: 'bg-[#F3E8FF] text-[#7C3AED]',
  Healthcare: 'bg-[#FEE2E2] text-[#B91C1C]',
  Shopping: 'bg-[#FEF3C7] text-[#92400E]',
  Salary: 'bg-[#D1FAE5] text-[#047857]',
  Freelance: 'bg-[#DBEAFE] text-[#1E40AF]',
  Investment: 'bg-[#F3F4F6] text-[#374151]',
  Other: 'bg-[#F3F4F6] text-[#374151]',
}

interface CategoryBadgeProps {
  category: Category
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const darkMode = useAppStore((s) => s.darkMode)
  const cls = darkMode ? darkClasses[category] : lightClasses[category]
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold uppercase tracking-widest ${cls}`}
    >
      {category}
    </span>
  )
}

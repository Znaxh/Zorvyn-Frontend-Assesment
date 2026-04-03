import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      colors: {
        base: 'var(--color-bg-base)',
        surface: 'var(--color-bg-surface)',
        card: 'var(--color-bg-card)',
        'card-hover': 'var(--color-bg-card-hover)',
        border: 'var(--color-border)',
        'border-hover': 'var(--color-border-hover)',
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        muted: 'var(--color-text-muted)',
        blue: {
          DEFAULT: '#378ADD',
          dim: 'var(--color-blue-dim)',
        },
        green: {
          DEFAULT: '#10B981',
          dim: 'var(--color-green-dim)',
        },
        red: {
          DEFAULT: '#EF4444',
          dim: 'var(--color-red-dim)',
        },
        amber: {
          DEFAULT: '#F59E0B',
          dim: 'var(--color-amber-dim)',
        },
      },
      keyframes: {
        rowHighlight: {
          '0%': { backgroundColor: 'rgba(55, 138, 221, 0.2)' },
          '100%': { backgroundColor: 'transparent' },
        },
        budgetPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'row-flash': 'rowHighlight 1.5s ease-out forwards',
        'budget-pulse': 'budgetPulse 1.5s ease-in-out infinite',
        shimmer: 'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
} satisfies Config

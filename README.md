# Zorvyn Finance Dashboard

A single-page finance dashboard for tracking income, expenses, budgets, and reports. The application is frontend-only: all figures come from in-app mock data and client-side state. There is no backend or external API.

## Features

- **Overview** with balance, income, and expense KPIs, trend charts, spending breakdown, and recent activity.
- **Transactions** with search, filters, sorting, pagination, and role-based add, edit, delete, and bulk delete.
- **Analytics** for monthly income versus expenses, category trends, and net cashflow.
- **Insights** including savings rate, category highlights, anomaly detection, and summary metrics.
- **Budget** tracking with per-category progress and overall utilization.
- **Reports** with date-range presets, aggregated summaries, and CSV or JSON export (admin only).
- **Dark and light themes** with preference persisted in the browser.
- **Role-based access** (viewer, editor, admin) with immediate UI updates.

## Tech Stack

| Area | Technology |
|------|------------|
| Framework | React 18, Vite 5 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 (dark mode via `class` strategy) |
| State | Zustand 4 with `persist` (localStorage) |
| Charts | Recharts 2.12 |
| Tables | TanStack Table v8 |
| Motion | Framer Motion 11 |
| Icons | Lucide React 0.383 |
| Notifications | react-hot-toast 2 |
| Dates | date-fns 3 |

Typography uses **Syne** for headings and **DM Sans** for body text, loaded via Google Fonts in `src/index.css`.

## Prerequisites

- Node.js 18 or newer (LTS recommended)
- npm (comes with Node.js)

## Getting Started

Clone or copy the project, install dependencies, and start the dev server:

```bash
npm install
npm run dev
```

Open the URL printed in the terminal (typically `http://localhost:5173`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite in development mode with hot reload. |
| `npm run build` | Run TypeScript project build and produce production assets in `dist/`. |
| `npm run preview` | Serve the production build locally for smoke testing. |

Type-checking without emitting files:

```bash
npx tsc --noEmit
```

## Data and Persistence

- Transaction and summary fixtures live in `src/data/mockData.ts`.
- **Transactions** you add, edit, or remove are stored in the browser via Zustand `persist` so changes survive refresh until cleared.
- Theme, role, and active page are also persisted for convenience.

There are no network calls for financial data.

## Roles

| Role | Capabilities |
|------|----------------|
| **Viewer** | Read-only: no add, edit, delete, bulk actions, or export. |
| **Editor** | Add and edit transactions; cannot delete, bulk delete, or export. |
| **Admin** | Full access including delete, bulk delete, and CSV/JSON export. |

Switch roles from the sidebar to verify behavior.

## Project Structure (high level)

```
src/
  components/   UI, layout, charts, transactions, insights, budget
  data/           Mock datasets
  hooks/          Filtered data, insights, permissions
  pages/          One file per main view
  store/          Zustand stores
  types/          Shared TypeScript types
  utils/          Formatting, calculations, filters, export helpers
```

Navigation is **not** handled by React Router: the active view is driven by `activePage` in the app store and rendered conditionally in `App.tsx`.

## License

This repository is marked private in `package.json`. Use and distribution terms are at the discretion of the project owner.

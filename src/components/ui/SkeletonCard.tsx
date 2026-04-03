export function SkeletonCard() {
  return (
    <div className="h-[140px] animate-pulse rounded-xl border border-border bg-card p-5">
      <div className="h-4 w-24 rounded bg-muted/30" />
      <div className="mt-4 h-8 w-40 rounded bg-muted/30" />
      <div className="mt-2 h-3 w-28 rounded bg-muted/20" />
    </div>
  )
}

function Skeleton({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-muted ${className}`} />;
}

export default function MainLoading() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Memuat halaman">
      <div className="space-y-2">
        <Skeleton className="h-4 w-28 bg-purple-100" />
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-4 w-40" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Skeleton className="h-24" />
        <Skeleton className="h-24" />
      </div>

      <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-11 w-2/5" />
      </div>
    </div>
  );
}

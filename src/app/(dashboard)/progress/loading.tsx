export default function ProgressLoading() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <div className="h-9 w-48 rounded-lg bg-muted mb-2" />
          <div className="h-4 w-64 rounded bg-muted" style={{ animationDelay: "50ms" }} />
        </div>
        <div className="h-8 w-28 rounded-lg bg-muted shrink-0" style={{ animationDelay: "100ms" }} />
      </div>

      {/* Level filter */}
      <div className="flex gap-2 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-24 rounded-full bg-muted" style={{ animationDelay: `${i * 60}ms` }} />
        ))}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5" style={{ animationDelay: `${i * 75}ms` }}>
            <div className="h-9 w-12 mx-auto rounded-lg bg-muted mb-2" />
            <div className="h-3 w-20 mx-auto rounded bg-muted" />
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mb-10" style={{ animationDelay: "300ms" }}>
        <div className="flex justify-between mb-2">
          <div className="h-4 w-28 rounded bg-muted" />
          <div className="h-4 w-12 rounded bg-muted" />
        </div>
        <div className="h-2 bg-muted rounded-full" />
      </div>

      {/* Lesson cards */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5" style={{ animationDelay: `${350 + i * 75}ms` }}>
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="h-4 w-3/4 rounded bg-muted" />
              <div className="h-5 w-16 rounded-full bg-muted" />
            </div>
            <div className="h-1 bg-muted rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

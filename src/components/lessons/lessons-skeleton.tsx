function SkeletonCard({ delay = 0 }: { delay?: number }) {
  const style = { animationDelay: `${delay}ms` };
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-6 pb-3">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="h-7 w-7 rounded bg-muted animate-pulse" style={style} />
          <div className="flex items-center gap-1.5 pt-0.5">
            <div className="h-4 w-14 rounded-full bg-muted animate-pulse" style={style} />
            <div className="h-4 w-6 rounded bg-muted animate-pulse" style={style} />
          </div>
        </div>
        <div className="h-4 w-3/4 rounded bg-muted animate-pulse mb-2" style={style} />
        <div className="h-4 w-1/2 rounded bg-muted animate-pulse" style={style} />
      </div>
      <div className="px-6 pb-6 pt-2">
        <div className="h-3 w-full rounded bg-muted animate-pulse mb-1.5" style={style} />
        <div className="h-3 w-5/6 rounded bg-muted animate-pulse mb-4" style={style} />
        <div className="h-1.5 w-full rounded-full bg-muted animate-pulse" style={style} />
      </div>
    </div>
  );
}

function SkeletonGroup({ groupDelay = 0 }: { groupDelay?: number }) {
  return (
    <section>
      <div className="flex items-center gap-3 w-full mb-5">
        <div className="h-5 w-28 rounded bg-muted animate-pulse" style={{ animationDelay: `${groupDelay}ms` }} />
        <div className="flex-1 h-px bg-border" />
        <div className="h-4 w-16 rounded bg-muted animate-pulse" style={{ animationDelay: `${groupDelay}ms` }} />
        <div className="h-4 w-4 rounded bg-muted animate-pulse" style={{ animationDelay: `${groupDelay}ms` }} />
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} delay={groupDelay + i * 100} />
        ))}
      </div>
    </section>
  );
}

export function LessonsSkeleton() {
  return (
    <div className="space-y-14">
      <SkeletonGroup groupDelay={0} />
      <SkeletonGroup groupDelay={300} />
    </div>
  );
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Hero skeleton */}
      <section className="mb-10 sm:mb-16">
        <div className="h-8 w-64 rounded bg-[color:var(--line)] animate-pulse" />
        <div className="mt-1 h-4 w-48 rounded bg-[color:var(--line)] animate-pulse" />
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded bg-[color:var(--line)] animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-[color:var(--line)] animate-pulse" />
        </div>
        <div className="mt-4 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-6 w-20 rounded-full bg-[color:var(--line)] animate-pulse" />
          ))}
        </div>
        <div className="mt-5 flex gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-5 w-5 rounded bg-[color:var(--line)] animate-pulse" />
          ))}
        </div>
      </section>

      {/* Recent Posts skeleton */}
      <section className="mb-10 sm:mb-16">
        <div className="mb-6 flex items-center justify-between">
          <div className="h-5 w-28 rounded bg-[color:var(--line)] animate-pulse" />
          <div className="h-4 w-16 rounded bg-[color:var(--line)] animate-pulse" />
        </div>
        <div className="space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="border-b border-[color:var(--line)] pb-6 last:border-0 last:pb-0">
              <div className="h-5 w-3/4 rounded bg-[color:var(--line)] animate-pulse" />
              <div className="mt-1 h-4 w-full rounded bg-[color:var(--line)] animate-pulse" />
              <div className="mt-1 h-4 w-2/3 rounded bg-[color:var(--line)] animate-pulse" />
              <div className="mt-2 flex gap-3">
                <div className="h-3 w-20 rounded bg-[color:var(--line)] animate-pulse" />
                <div className="h-3 w-14 rounded bg-[color:var(--line)] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects skeleton */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div className="h-5 w-36 rounded bg-[color:var(--line)] animate-pulse" />
          <div className="h-4 w-16 rounded bg-[color:var(--line)] animate-pulse" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-[color:var(--line)] bg-[color:var(--card)] p-4">
              <div className="h-4 w-1/2 rounded bg-[color:var(--line)] animate-pulse" />
              <div className="mt-2 h-3 w-full rounded bg-[color:var(--line)] animate-pulse" />
              <div className="mt-1 h-3 w-4/5 rounded bg-[color:var(--line)] animate-pulse" />
              <div className="mt-3 flex gap-1.5">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-5 w-12 rounded bg-[color:var(--line)] animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

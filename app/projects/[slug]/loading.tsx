export default function Loading() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="h-4 w-32 animate-pulse rounded bg-[color:var(--line)]" />

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="h-9 w-48 animate-pulse rounded bg-[color:var(--line)]" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-[color:var(--line)]" />
      </div>
      <div className="mt-2 h-4 w-12 animate-pulse rounded bg-[color:var(--line)]" />

      <div className="mt-6 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-[color:var(--line)]" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-[color:var(--line)]" />
        <div className="h-4 w-4/5 animate-pulse rounded bg-[color:var(--line)]" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-[color:var(--line)]" />
      </div>

      <div className="mt-10">
        <div className="h-5 w-24 animate-pulse rounded bg-[color:var(--line)]" />
        <div className="mt-4 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="mt-0.5 h-4 w-4 shrink-0 animate-pulse rounded bg-[color:var(--line)]" />
              <div className="h-4 w-full animate-pulse rounded bg-[color:var(--line)]" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="h-5 w-20 animate-pulse rounded bg-[color:var(--line)]" />
        <div className="mt-4 flex flex-wrap gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 w-16 animate-pulse rounded-lg bg-[color:var(--line)]" />
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="h-5 w-12 animate-pulse rounded bg-[color:var(--line)]" />
        <div className="mt-4 flex gap-3">
          <div className="h-9 w-36 animate-pulse rounded-lg bg-[color:var(--line)]" />
          <div className="h-9 w-28 animate-pulse rounded-lg bg-[color:var(--line)]" />
        </div>
      </div>
    </article>
  );
}

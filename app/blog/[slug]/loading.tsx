export default function Loading() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="h-4 w-28 animate-pulse rounded bg-[color:var(--line)]" />

      <div className="mt-8 space-y-3">
        <div className="h-9 w-5/6 animate-pulse rounded bg-[color:var(--line)]" />
        <div className="h-9 w-2/3 animate-pulse rounded bg-[color:var(--line)]" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div className="h-4 w-20 animate-pulse rounded bg-[color:var(--line)]" />
        <div className="h-4 w-14 animate-pulse rounded bg-[color:var(--line)]" />
        <div className="flex gap-1.5">
          <div className="h-5 w-14 animate-pulse rounded-full bg-[color:var(--line)]" />
          <div className="h-5 w-16 animate-pulse rounded-full bg-[color:var(--line)]" />
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            {i % 2 === 0 && (
              <div className="h-6 w-1/2 animate-pulse rounded bg-[color:var(--line)]" />
            )}
            <div className="h-4 w-full animate-pulse rounded bg-[color:var(--line)]" />
            <div className="h-4 w-11/12 animate-pulse rounded bg-[color:var(--line)]" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-[color:var(--line)]" />
          </div>
        ))}
      </div>
    </article>
  );
}

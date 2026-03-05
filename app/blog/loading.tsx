export default function Loading() {
  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-10">
      <div className="h-4 w-24 rounded bg-[color:var(--surface)] animate-pulse" />

      <div className="mt-6 h-9 w-32 rounded bg-[color:var(--surface)] animate-pulse" />
      <div className="mt-2 h-4 w-72 rounded bg-[color:var(--surface)] animate-pulse" />

      <div className="mt-10 space-y-px">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="border-b border-[color:var(--line)] py-6 last:border-0">
            <div className="flex items-center gap-3">
              <div className="h-3 w-20 rounded bg-[color:var(--surface)] animate-pulse" />
              <div className="h-3 w-14 rounded bg-[color:var(--surface)] animate-pulse" />
            </div>
            <div className="mt-2 h-5 w-3/4 rounded bg-[color:var(--surface)] animate-pulse" />
            <div className="mt-1.5 h-4 w-full rounded bg-[color:var(--surface)] animate-pulse" />
            <div className="mt-1 h-4 w-2/3 rounded bg-[color:var(--surface)] animate-pulse" />
            <div className="mt-3 h-4 w-20 rounded bg-[color:var(--surface)] animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  );
}

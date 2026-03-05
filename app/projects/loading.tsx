export default function Loading() {
  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="h-4 w-24 rounded bg-[color:var(--line)] animate-pulse" />

      <div className="mt-6 h-9 w-40 rounded bg-[color:var(--line)] animate-pulse" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--card)] p-5"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="h-5 w-32 rounded bg-[color:var(--line)] animate-pulse" />
              <div className="h-4 w-10 rounded bg-[color:var(--line)] animate-pulse" />
            </div>
            <div className="mt-2 h-4 w-full rounded bg-[color:var(--line)] animate-pulse" />
            <div className="mt-1 h-4 w-4/5 rounded bg-[color:var(--line)] animate-pulse" />
            <div className="mt-4 flex gap-1.5">
              <div className="h-5 w-12 rounded-md border border-[color:var(--line)] bg-[color:var(--line)] animate-pulse" />
              <div className="h-5 w-16 rounded-md border border-[color:var(--line)] bg-[color:var(--line)] animate-pulse" />
              <div className="h-5 w-10 rounded-md border border-[color:var(--line)] bg-[color:var(--line)] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

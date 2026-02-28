import Link from "next/link";

const corePoints = [
  "Full-stack web engineering",
  "System design and implementation",
  "Product-focused problem solving",
];

export default function HomePage() {
  return (
    <div className="hero-wrap">
      <section className="hero mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <p className="mb-6 inline-flex rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]">
          Personal Website
        </p>

        <h1 className="max-w-4xl text-4xl font-semibold leading-tight text-[color:var(--text)] sm:text-6xl">
          Muhammad Faisal Ghozi
          <span className="block text-[color:var(--accent)]">Building useful things with code</span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg">
          I design and build digital products with a clear focus on speed, usability, and measurable impact.
          This is where I share my writing and projects.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link href="/projects" className="btn btn-primary">
            Explore Projects
          </Link>
          <Link href="/blog" className="btn btn-secondary">
            Read the Blog
          </Link>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-3">
          {corePoints.map((point) => (
            <li
              key={point}
              className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--card)] px-5 py-4 text-sm font-medium text-[color:var(--text)]"
            >
              {point}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

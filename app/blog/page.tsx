import Link from "next/link";

import { formatDate, getBlogPosts } from "@/lib/notion";

export const metadata = {
  title: "Blog | mfaisalghozi",
  description: "Notes, essays, and technical articles.",
};

function ArrowLeftIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section className="mx-auto w-full max-w-2xl px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
      >
        <ArrowLeftIcon />
        Back to home
      </Link>

      <h1 className="mt-6 text-4xl font-bold text-[color:var(--text)]">Blog</h1>
      <p className="mt-2 text-[color:var(--muted)]">
        Thoughts on engineering, design systems, and building products with clarity.
      </p>

      <div className="mt-10 space-y-px">
        {posts.map((post) => (
          <article key={post.id}>
            <Link
              href={`/blog/${post.slug}`}
              className="group block border-b border-[color:var(--line)] py-6 last:border-0"
            >
              <div className="flex items-center gap-3 text-xs text-[color:var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon />
                  {formatDate(post.publishedAt)}
                </span>
                <span>{post.readTime}</span>
              </div>
              <h2 className="mt-2 text-xl font-semibold text-[color:var(--text)] transition-colors group-hover:text-[color:var(--accent)]">
                {post.title}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--muted)]">
                {post.summary}
              </p>
              <span className="mt-3 inline-block text-sm font-medium text-[color:var(--accent)]">
                Read article →
              </span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

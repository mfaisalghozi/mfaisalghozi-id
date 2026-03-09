import Link from "next/link";

import { getBlogPostsByMonth, formatMonth, estimateReadTime } from "@/lib/notion";
import { TagPill } from "@/components/tag-pill";
import { DateLink } from "@/components/date-link";

export const revalidate = 1800;

export async function generateMetadata({ params }: { params: Promise<{ month: string }> }) {
  const { month } = await params;
  const monthLabel = formatMonth(`${month}-01`);
  return {
    title: `${monthLabel} | mfaisalghozi Blog`,
    description: `Blog posts from ${monthLabel}.`,
  };
}

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

export default async function MonthPage({ params }: { params: Promise<{ month: string }> }) {
  const { month } = await params;
  const posts = await getBlogPostsByMonth(month);
  const monthLabel = formatMonth(`${month}-01`);

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
      >
        <ArrowLeftIcon />
        Back to all posts
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-[color:var(--text)] sm:text-4xl">
        <span className="text-[color:var(--accent)]">{monthLabel}</span>
      </h1>
      <p className="mt-2 text-[color:var(--muted)]">
        {posts.length} {posts.length === 1 ? "post" : "posts"} in {monthLabel}
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 text-[color:var(--muted)]">No posts found for this month.</p>
      ) : (
        <div className="mt-10 space-y-px">
          {posts.map((post) => (
            <article key={post.id} className="border-b border-[color:var(--line)] py-6 last:border-0">
              <div className="flex items-center gap-3 text-xs text-[color:var(--muted)]">
                <DateLink publishedAt={post.publishedAt} />
                <span>~{estimateReadTime(`${post.title} ${post.summary}`, 5)}</span>
              </div>
              <Link href={`/blog/${post.slug}`} className="group block">
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
              {post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {post.tags.map((t) => (
                    <TagPill key={t} tag={t} />
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

import Link from "next/link";

import { getBlogPostsByMonth, formatMonth } from "@/lib/notion";
import { PostCard } from "@/components/post-card";

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
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}

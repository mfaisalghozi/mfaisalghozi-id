import Link from "next/link";

import { formatDate, getBlogPosts, estimateReadTime } from "@/lib/notion";
import { ArrowLeftIcon, CalendarIcon } from "@/components/icons";

export const revalidate = 1800;

export const metadata = {
  title: "Blog | mfaisalghozi",
  description: "Notes, essays, and technical articles.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
      >
        <ArrowLeftIcon />
        Back to home
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-[color:var(--text)] sm:text-4xl">Blog</h1>
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
                  <CalendarIcon size={12} />
                  {formatDate(post.publishedAt)}
                </span>
                <span>~{estimateReadTime(`${post.title} ${post.summary}`, 5)}</span>
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

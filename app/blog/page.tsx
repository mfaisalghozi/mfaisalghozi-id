import Link from "next/link";

import { formatDate, getBlogPosts } from "@/lib/notion";

export const metadata = {
  title: "Blog | Muhammad Faisal Ghozi",
  description: "Notes, essays, and technical articles powered by Notion.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-semibold text-[color:var(--text)] sm:text-5xl">Blog</h1>
      <p className="mt-4 max-w-2xl text-[color:var(--muted)]">
        Thoughts on engineering, design systems, and building products with clarity.
      </p>

      <div className="mt-10 space-y-4">
        {posts.map((post) => (
          <article
            key={post.id}
            className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--card)] p-6 transition-colors hover:border-[color:var(--accent)]"
          >
            <p className="text-sm text-[color:var(--muted)]">{formatDate(post.publishedAt)}</p>
            <h2 className="mt-2 text-2xl font-semibold text-[color:var(--text)]">{post.title}</h2>
            <p className="mt-3 text-[color:var(--muted)]">{post.summary}</p>

            <Link
              href={post.url}
              target={post.url.startsWith("http") ? "_blank" : undefined}
              rel={post.url.startsWith("http") ? "noreferrer noopener" : undefined}
              className="mt-5 inline-flex text-sm font-semibold text-[color:var(--accent)]"
            >
              Read article
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

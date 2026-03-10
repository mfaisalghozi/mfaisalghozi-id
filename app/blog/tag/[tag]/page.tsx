import Link from "next/link";

import { getBlogPostsByTag } from "@/lib/notion";
import { PostCard } from "@/components/post-card";

export const revalidate = 1800;

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return {
    title: `#${tag} | mfaisalghozi Blog`,
    description: `Blog posts tagged with "${tag}".`,
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

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;

  let posts: Awaited<ReturnType<typeof getBlogPostsByTag>>;
  try {
    posts = await getBlogPostsByTag(decodeURIComponent(tag));
  } catch (err) {
    throw new Error(`Failed to load posts for tag "${tag}": ${err instanceof Error ? err.message : String(err)}`);
  }

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
        <span className="text-[color:var(--accent)]">#{tag}</span>
      </h1>
      <p className="mt-2 text-[color:var(--muted)]">
        {posts.length} {posts.length === 1 ? "post" : "posts"} tagged with &ldquo;{tag}&rdquo;
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 text-[color:var(--muted)]">No posts found for this tag.</p>
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

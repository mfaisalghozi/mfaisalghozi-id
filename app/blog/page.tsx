import Link from "next/link";

import { getBlogPosts } from "@/lib/notion";
import { PostCard } from "@/components/post-card";

export const revalidate = 1800;

const BLOG_DESCRIPTION = "My series of thoughts, contemplation, and engineering idea";

export const metadata = {
  title: "Blog | mfaisalghozi",
  description: BLOG_DESCRIPTION,
  openGraph: {
    title: "Blog | mfaisalghozi",
    description: BLOG_DESCRIPTION,
    url: "https://mfaisalghozi.id/blog",
    siteName: "mfaisalghozi",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "mfaisalghozi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | mfaisalghozi",
    description: BLOG_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof getBlogPosts>>;
  try {
    posts = await getBlogPosts();
  } catch (err) {
    throw new Error(`Failed to load blog posts: ${err instanceof Error ? err.message : String(err)}`);
  }

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
      <p className="mt-2 text-[color:var(--muted)]">{BLOG_DESCRIPTION}</p>

      <div className="mt-10 space-y-px">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}

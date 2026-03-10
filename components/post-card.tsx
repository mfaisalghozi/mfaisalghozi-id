import Link from "next/link";

import { estimateReadTime, type BlogPost } from "@/lib/notion";
import { TagPill } from "@/components/tag-pill";
import { DateLink } from "@/components/date-link";

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="border-b border-[color:var(--line)] py-6 last:border-0">
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
          {post.tags.map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
        </div>
      )}
    </article>
  );
}

import Link from "next/link";

export function TagPill({ tag }: { tag: string }) {
  return (
    <Link
      href={`/blog/tag/${encodeURIComponent(tag)}`}
      className="rounded-full bg-[color:var(--surface)] px-2 py-0.5 text-xs text-[color:var(--muted)] transition-colors hover:text-[color:var(--accent)]"
    >
      #{tag}
    </Link>
  );
}

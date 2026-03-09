import Link from "next/link";

import { formatDate } from "@/lib/notion";

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

export function DateLink({ publishedAt }: { publishedAt: string }) {
  if (!publishedAt) {
    return (
      <span className="flex items-center gap-1.5">
        <CalendarIcon />
        Draft
      </span>
    );
  }

  const month = publishedAt.substring(0, 7);

  return (
    <Link
      href={`/blog/month/${month}`}
      className="flex items-center gap-1.5 transition-colors hover:text-[color:var(--accent)]"
    >
      <CalendarIcon />
      {formatDate(publishedAt)}
    </Link>
  );
}

import Link from "next/link";

import { formatDate } from "@/lib/notion";
import { CalendarIcon } from "@/components/icons";

export function DateLink({ publishedAt }: { publishedAt: string }) {
  if (!publishedAt) {
    return (
      <span className="flex items-center gap-1.5">
        <CalendarIcon size={12} />
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
      <CalendarIcon size={12} />
      {formatDate(publishedAt)}
    </Link>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function ArrowLeftIcon() {
  return (
    <svg
      width="16"
      height="16"
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

interface BackButtonProps {
  defaultHref?: string;
  defaultLabel?: string;
  homeLabel?: string;
}

export default function BackButton({
  defaultHref = "/blog",
  defaultLabel = "Back to all posts",
  homeLabel = "Back to home",
}: BackButtonProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const fromHome = searchParams.get("from") === "home";

  const href = fromHome ? "/" : defaultHref;
  const label = fromHome ? homeLabel : defaultLabel;

  useEffect(() => {
    if (fromHome) {
      router.prefetch("/");
    }
  }, [fromHome, router]);

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
    >
      <ArrowLeftIcon />
      {label}
    </Link>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
  blogHref?: string;
  homeHref?: string;
}

export default function BackButton({
  blogHref = "/blog",
  homeHref = "/",
}: BackButtonProps) {
  const [backHref, setBackHref] = useState(blogHref);
  const [label, setLabel] = useState("Back to all posts");

  useEffect(() => {
    const referrer = document.referrer;
    if (referrer) {
      try {
        const referrerUrl = new URL(referrer);
        const isSameOrigin = referrerUrl.origin === window.location.origin;
        if (isSameOrigin && referrerUrl.pathname === "/") {
          setBackHref(homeHref);
          setLabel("Back to home");
          return;
        }
      } catch {
        // ignore malformed referrer
      }
    }
    setBackHref(blogHref);
    setLabel("Back to all posts");
  }, [blogHref, homeHref]);

  return (
    <Link
      href={backHref}
      className="inline-flex items-center gap-2 text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
    >
      <ArrowLeftIcon />
      {label}
    </Link>
  );
}

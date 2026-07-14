"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ArrowLeftIcon } from "@/components/icons";

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

"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <p className="text-sm font-medium text-[color:var(--accent)]">Something went wrong</p>
      <h1 className="mt-3 text-3xl font-bold text-[color:var(--text)]">An error occurred</h1>
      <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
        {error.message || "An unexpected error occurred. Please try again later."}
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-[color:var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-[color:var(--line)] bg-[color:var(--card)] px-5 py-2.5 text-sm font-medium text-[color:var(--text)] transition-colors hover:border-[color:var(--accent)]"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

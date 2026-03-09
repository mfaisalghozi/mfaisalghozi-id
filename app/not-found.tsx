import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <p className="text-sm font-medium text-[color:var(--accent)]">404</p>
      <h1 className="mt-3 text-3xl font-bold text-[color:var(--text)]">Page not found</h1>
      <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-8">
        <Link
          href="/"
          className="rounded-lg bg-[color:var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

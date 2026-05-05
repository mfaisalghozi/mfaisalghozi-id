import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { getBlogPosts, estimateReadTime } from "@/lib/notion";
import { getProjects } from "@/lib/projects";
import { DateLink } from "@/components/date-link";
import {
  ExternalLinkIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
} from "@/components/icons";

export const revalidate = 1800;

function isSafeUrl(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const { protocol } = new URL(url);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}

export const metadata: Metadata = {
  title: "Muhammad Faisal Ghozi | Software Engineer",
  description:
    "Personal website of Muhammad Faisal Ghozi — software engineer focused on speed, usability, and measurable impact.",
  openGraph: {
    title: "Muhammad Faisal Ghozi",
    description: "Software Engineer & An Optimistic Nihilism",
    url: "https://mfaisalghozi.id",
    type: "website",
  },
};

const personJsonLdString = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Muhammad Faisal Ghozi",
  url: "https://mfaisalghozi.id",
  sameAs: [
    "https://github.com/mfaisalghozi",
    "https://linkedin.com/in/mfaisalghozi",
  ],
}).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/&/g, "\\u0026");

async function RecentPosts() {
  const allPosts = await getBlogPosts();
  const recentPosts = allPosts.slice(0, 5);
  return (
    <div className="space-y-6">
      {recentPosts.map((post) => (
        <article
          key={post.slug}
          className="border-b border-[color:var(--line)] pb-6 last:border-0 last:pb-0"
        >
          <Link href={`/blog/${post.slug}?from=home`}>
            <h3 className="font-semibold text-[color:var(--text)] transition-colors hover:text-[color:var(--accent)]">
              {post.title}
            </h3>
          </Link>
          <p className="mt-1 text-sm leading-relaxed text-[color:var(--muted)]">
            {post.summary}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-[color:var(--muted)]">
            <DateLink publishedAt={post.publishedAt} />
            <span>~{estimateReadTime(post.summary)}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function RecentPostsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="border-b border-[color:var(--line)] pb-6 last:border-0">
          <div className="h-4 w-3/4 animate-pulse rounded bg-[color:var(--surface)]" />
          <div className="mt-2 h-3 w-full animate-pulse rounded bg-[color:var(--surface)]" />
          <div className="mt-1 h-3 w-2/3 animate-pulse rounded bg-[color:var(--surface)]" />
          <div className="mt-2 h-3 w-24 animate-pulse rounded bg-[color:var(--surface)]" />
        </div>
      ))}
    </div>
  );
}

async function FeaturedProjects() {
  const allProjects = await getProjects();
  const featuredProjects = allProjects.slice(0, 6);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {featuredProjects.map((project) => (
        <div
          key={project.slug}
          className="group relative rounded-xl border border-[color:var(--line)] bg-[color:var(--card)] p-4 transition-colors hover:border-[color:var(--accent)]"
        >
          <Link
            href={`/projects/${project.slug}?from=home`}
            className="absolute inset-0 z-0 rounded-xl"
            aria-label={project.name}
          />
          <div className="relative z-10 flex items-start justify-between">
            <h3 className="text-sm font-semibold text-[color:var(--text)] transition-colors group-hover:text-[color:var(--accent)]">{project.name}</h3>
            <div className="ml-2 flex shrink-0 items-center gap-1.5 text-[color:var(--muted)]">
              {isSafeUrl(project.liveUrl) && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative z-10 transition-colors hover:text-[color:var(--text)]"
                >
                  <ExternalLinkIcon />
                </a>
              )}
            </div>
          </div>
          <p className="relative z-10 mt-2 text-xs leading-relaxed text-[color:var(--muted)]">
            {project.description}
          </p>
          <div className="relative z-10 mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-md bg-[color:var(--surface)] px-2 py-0.5 text-xs text-[color:var(--muted)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturedProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-[color:var(--line)] bg-[color:var(--card)] p-4"
        >
          <div className="h-4 w-1/2 animate-pulse rounded bg-[color:var(--surface)]" />
          <div className="mt-2 h-3 w-full animate-pulse rounded bg-[color:var(--surface)]" />
          <div className="mt-1 h-3 w-3/4 animate-pulse rounded bg-[color:var(--surface)]" />
          <div className="mt-3 flex gap-1.5">
            <div className="h-5 w-12 animate-pulse rounded bg-[color:var(--surface)]" />
            <div className="h-5 w-16 animate-pulse rounded bg-[color:var(--surface)]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: personJsonLdString }}
      />
      {/* Hero */}
      <section className="mb-10 sm:mb-16">
        <h1 className="text-3xl font-bold text-[color:var(--text)] sm:text-3xl">Muhammad Faisal Ghozi</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">Software Engineer & An Optimistic Nihilism</p>
        <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
          I build digital products with a clear focus on speed, usability, and measurable
          impact. Passionate about clean code, good design, and tools that make life easier.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Fullstack Developer", "Minimalist", "Essentialist", "Reader"].map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1 text-xs font-medium text-[color:var(--muted)]"
            >
              {skill}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-4 text-[color:var(--muted)]">
          <a
            href="https://github.com/mfaisalghozi"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[color:var(--text)]"
          >
            <GithubIcon />
          </a>
          <a
            href="https://linkedin.com/in/mfaisalghozi"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[color:var(--text)]"
          >
            <LinkedinIcon />
          </a>
          <a
            href="mailto:mfaisalghozi99@gmail.com"
            className="transition-colors hover:text-[color:var(--text)]"
          >
            <MailIcon />
          </a>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="mb-10 sm:mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[color:var(--text)]">Recent Posts</h2>
          <Link
            href="/blog"
            className="text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
          >
            View all →
          </Link>
        </div>
        <Suspense fallback={<RecentPostsSkeleton />}>
          <RecentPosts />
        </Suspense>
      </section>

      {/* Featured Projects */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[color:var(--text)]">Featured Projects</h2>
          <Link
            href="/projects"
            className="text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
          >
            View all →
          </Link>
        </div>
        <Suspense fallback={<FeaturedProjectsSkeleton />}>
          <FeaturedProjects />
        </Suspense>
      </section>
    </div>
  );
}

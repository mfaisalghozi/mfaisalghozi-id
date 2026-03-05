import Link from "next/link";
import { notFound } from "next/navigation";

import { getProjectBySlug, getProjects } from "@/lib/projects";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: `${project.name} | mfaisalghozi`,
    description: project.description,
  };
}

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

function GithubIcon() {
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
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
    </svg>
  );
}

function ExternalLinkIcon() {
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
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0 text-[color:var(--accent)]"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const statusColors: Record<string, string> = {
  Live: "bg-emerald-500/10 text-emerald-500",
  "Open Source": "bg-blue-500/10 text-blue-400",
  "In Progress": "bg-amber-500/10 text-amber-400",
  Archived: "bg-[color:var(--surface)] text-[color:var(--muted)]",
};

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
      >
        <ArrowLeftIcon />
        Back to projects
      </Link>

      <div className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-4xl font-bold text-[color:var(--text)]">{project.name}</h1>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[project.status] ?? statusColors["Archived"]}`}
          >
            {project.status}
          </span>
        </div>
        <p className="mt-2 text-sm text-[color:var(--muted)]">{project.year}</p>
      </div>

      <p className="mt-6 leading-relaxed text-[color:var(--muted)]">{project.overview}</p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-[color:var(--text)]">Highlights</h2>
        <ul className="mt-4 space-y-3">
          {project.highlights.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-[color:var(--muted)]">
              <span className="mt-0.5">
                <CheckIcon />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-[color:var(--text)]">Tech Stack</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="rounded-lg border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1 text-sm text-[color:var(--muted)]"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {(project.githubUrl || project.liveUrl) && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-[color:var(--text)]">Links</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--line)] bg-[color:var(--card)] px-4 py-2 text-sm font-medium text-[color:var(--text)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
              >
                <GithubIcon />
                View on GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <ExternalLinkIcon />
                Live Demo
              </a>
            )}
          </div>
        </section>
      )}

    </article>
  );
}

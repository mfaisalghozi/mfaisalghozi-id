import { notFound } from "next/navigation";

import { getProjectBySlug, getProjects } from "@/lib/projects";
import { isSafeUrl } from "@/lib/utils";
import BackButton from "@/components/back-button";
import { GithubIcon, ExternalLinkIcon, CheckIcon } from "@/components/icons";

export const revalidate = 1800;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  const title = `${project.name} | mfaisalghozi`;
  const url = `https://mfaisalghozi.id/projects/${slug}`;

  return {
    title,
    description: project.description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description: project.description,
      url,
      type: "website",
      siteName: "mfaisalghozi",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description,
      images: ["/opengraph-image"],
    },
  };
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

  let project: Awaited<ReturnType<typeof getProjectBySlug>>;
  try {
    project = await getProjectBySlug(slug);
  } catch (err) {
    throw new Error(`Failed to load project: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!project) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <BackButton defaultHref="/projects" defaultLabel="Back to projects" />

      <div className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold text-[color:var(--text)] sm:text-4xl">{project.name}</h1>
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
                <CheckIcon className="shrink-0 text-[color:var(--accent)]" />
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

      {(isSafeUrl(project.githubUrl) || isSafeUrl(project.liveUrl)) && (
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-[color:var(--text)]">Links</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {isSafeUrl(project.githubUrl) && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[color:var(--line)] bg-[color:var(--card)] px-4 py-2 text-sm font-medium text-[color:var(--text)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
              >
                <GithubIcon size={16} />
                View on GitHub
              </a>
            )}
            {isSafeUrl(project.liveUrl) && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                <ExternalLinkIcon size={16} />
                Live Demo
              </a>
            )}
          </div>
        </section>
      )}

    </article>
  );
}

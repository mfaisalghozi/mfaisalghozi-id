import Link from "next/link";

import { getProjects } from "@/lib/projects";
import { GithubIcon, ExternalLinkIcon, ArrowLeftIcon } from "@/components/icons";

export const revalidate = 1800;

export const metadata = {
  title: "Projects | mfaisalghozi",
  description: "Selected product and engineering projects.",
  openGraph: {
    title: "Projects | mfaisalghozi",
    description: "Selected product and engineering projects.",
    url: "https://mfaisalghozi.id/projects",
    siteName: "mfaisalghozi",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "mfaisalghozi" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | mfaisalghozi",
    description: "Selected product and engineering projects.",
    images: ["/opengraph-image"],
  },
};

export default async function ProjectsPage() {
  let projects: Awaited<ReturnType<typeof getProjects>>;
  try {
    projects = await getProjects();
  } catch (err) {
    throw new Error(`Failed to load projects: ${err instanceof Error ? err.message : String(err)}`);
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
      >
        <ArrowLeftIcon />
        Back to home
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-[color:var(--text)] sm:text-4xl">All Projects</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group rounded-2xl border border-[color:var(--line)] bg-[color:var(--card)] p-5 transition-colors hover:border-[color:var(--accent)]"
          >
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold text-[color:var(--text)] group-hover:text-[color:var(--accent)] transition-colors">
                {project.name}
              </h2>
              <div className="flex shrink-0 items-center gap-2 text-[color:var(--muted)]">
                {project.githubUrl && <GithubIcon size={15} />}
                {project.liveUrl && <ExternalLinkIcon size={15} />}
              </div>
            </div>

            <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted)]">
              {project.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-[color:var(--line)] px-2 py-0.5 text-xs text-[color:var(--muted)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

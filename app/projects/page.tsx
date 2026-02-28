import Link from "next/link";

const projects = [
  {
    name: "Team Workflow Analytics",
    description:
      "A dashboard for tracking software delivery metrics with actionable engineering insights.",
    stack: ["Next.js", "TypeScript", "PostgreSQL"],
    href: "#",
  },
  {
    name: "Internal Design System",
    description:
      "Reusable components and tokens to speed up product development and improve visual consistency.",
    stack: ["React", "Storybook", "Tailwind"],
    href: "#",
  },
  {
    name: "Knowledge Base Search",
    description:
      "Semantic documentation search for support and engineering teams with relevance tuning.",
    stack: ["Node.js", "OpenSearch", "Redis"],
    href: "#",
  },
];

export const metadata = {
  title: "Projects | Muhammad Faisal Ghozi",
  description: "Selected product and engineering projects.",
};

export default function ProjectsPage() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6 sm:py-20">
      <h1 className="text-3xl font-semibold text-[color:var(--text)] sm:text-5xl">Project Showcase</h1>
      <p className="mt-4 max-w-2xl text-[color:var(--muted)]">
        A selection of work focused on product velocity, maintainability, and clear user experience.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.name}
            className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--card)] p-6"
          >
            <h2 className="text-xl font-semibold text-[color:var(--text)]">{project.name}</h2>
            <p className="mt-3 text-[color:var(--muted)]">{project.description}</p>

            <p className="mt-4 text-sm text-[color:var(--muted)]">{project.stack.join(" • ")}</p>

            <Link href={project.href} className="mt-5 inline-flex text-sm font-semibold text-[color:var(--accent)]">
              View details
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

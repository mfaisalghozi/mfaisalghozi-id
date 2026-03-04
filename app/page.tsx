import Link from "next/link";

const recentPosts = [
  {
    title: "The Art of Minimalist Design",
    description:
      "Exploring how less can truly be more when it comes to creating impactful user experiences and interfaces.",
    date: "Jan 28, 2026",
    readTime: "5 min read",
    href: "/blog/the-art-of-minimalist-design",
  },
  {
    title: "How I Build Productive Engineering Systems",
    description:
      "A practical framework for planning, building, and shipping software sustainably.",
    date: "Jan 12, 2026",
    readTime: "6 min read",
    href: "/blog/how-i-build-productive-engineering-systems",
  },
  {
    title: "Designing for Clarity in Personal Branding Websites",
    description:
      "A breakdown of typography, spacing, and hierarchy decisions that improve trust.",
    date: "Nov 9, 2025",
    readTime: "5 min read",
    href: "/blog/designing-for-clarity-in-personal-branding-websites",
  },
  {
    title: "From Idea to Deployment: My Full-Stack Workflow",
    description:
      "A walkthrough of the tools, habits, and decisions that take a project from a rough idea to a live product.",
    date: "Oct 3, 2025",
    readTime: "7 min read",
    href: "/blog/from-idea-to-deployment-my-full-stack-workflow",
  },
  {
    title: "Why I Choose Boring Technology",
    description:
      "Stability, community, and predictability matter more than novelty when you're shipping real products.",
    date: "Sep 15, 2025",
    readTime: "4 min read",
    href: "/blog/why-i-choose-boring-technology",
  },
];

const featuredProjects = [
  {
    name: "Task Manager Pro",
    description:
      "A minimalist task management app with drag-and-drop functionality and real-time collaboration features.",
    stack: ["React", "TypeScript", "Tailwind"],
    href: "/projects/task-manager-pro",
    starred: true,
    external: true,
  },
  {
    name: "Design System Kit",
    description:
      "A comprehensive design system with reusable components, documentation, and Figma integration.",
    stack: ["React", "Storybook", "Figma"],
    href: "/projects/design-system-kit",
    starred: true,
    external: true,
  },
  {
    name: "Portfolio Generator",
    description:
      "An open-source tool that helps developers create beautiful portfolio websites in minutes.",
    stack: ["Next.js", "MDX", "Vercel"],
    href: "/projects/portfolio-generator",
    starred: true,
    external: false,
  },
  {
    name: "Color Palette Builder",
    description:
      "Generate accessible color palettes with real-time contrast checking and export to various formats.",
    stack: ["Vue", "Canvas API", "WCAG"],
    href: "/projects/color-palette-builder",
    starred: false,
    external: true,
  },
];

function CalendarIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function BookmarkIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="14"
      height="14"
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

function GithubIcon() {
  return (
    <svg
      width="18"
      height="18"
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

function LinkedinIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* Hero */}
      <section className="mb-16">
        <h1 className="text-3xl font-bold text-[color:var(--text)]">Muhammad Faisal Ghozi</h1>
        <p className="mt-1 text-sm text-[color:var(--muted)]">Full-stack Engineer & Builder</p>
        <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">
          I design and build digital products with a clear focus on speed, usability, and measurable
          impact. Passionate about clean code, good design, and tools that make life easier.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["UI Designer", "Frontend"].map((skill) => (
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
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[color:var(--text)]">Recent Posts</h2>
          <Link
            href="/blog"
            className="text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
          >
            View all →
          </Link>
        </div>
        <div className="space-y-6">
          {recentPosts.map((post) => (
            <article
              key={post.title}
              className="border-b border-[color:var(--line)] pb-6 last:border-0 last:pb-0"
            >
              <Link href={post.href}>
                <h3 className="font-semibold text-[color:var(--text)] transition-colors hover:text-[color:var(--accent)]">
                  {post.title}
                </h3>
              </Link>
              <p className="mt-1 text-sm leading-relaxed text-[color:var(--muted)]">
                {post.description}
              </p>
              <div className="mt-2 flex items-center gap-3 text-xs text-[color:var(--muted)]">
                <span className="flex items-center gap-1.5">
                  <CalendarIcon />
                  {post.date}
                </span>
                <span>{post.readTime}</span>
              </div>
            </article>
          ))}
        </div>
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
        <div className="grid grid-cols-2 gap-4">
          {featuredProjects.map((project) => (
            <div
              key={project.name}
              className="rounded-xl border border-[color:var(--line)] bg-[color:var(--card)] p-4"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-semibold text-[color:var(--text)]">{project.name}</h3>
                <div className="ml-2 flex shrink-0 items-center gap-1.5 text-[color:var(--muted)]">
                  {project.starred && (
                    <button className="transition-colors hover:text-[color:var(--text)]">
                      <BookmarkIcon />
                    </button>
                  )}
                  {project.external && (
                    <a
                      href={project.href}
                      className="transition-colors hover:text-[color:var(--text)]"
                    >
                      <ExternalLinkIcon />
                    </a>
                  )}
                </div>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[color:var(--muted)]">
                {project.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
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
      </section>
    </div>
  );
}

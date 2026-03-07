import { getProjectsFromNotion } from "./notion";

export type { Project } from "./notion";

const STATIC_PROJECTS: import("./notion").Project[] = [
  {
    id: "static-task-manager-pro",
    slug: "task-manager-pro",
    name: "Task Manager Pro",
    description:
      "A minimalist task management app with drag-and-drop functionality and real-time collaboration features.",
    stack: ["React", "TypeScript", "Tailwind"],
    year: "2025",
    status: "Live",
    overview:
      "Task Manager Pro is a focused productivity tool designed around the principle that task management should be invisible — it gets out of the way and lets you focus on the work. Built with real-time collaboration at its core, teams can coordinate without ever leaving the flow.",
    highlights: [
      "Drag-and-drop task reordering with optimistic UI updates",
      "Real-time collaboration via WebSocket with presence indicators",
      "Keyboard-first navigation for power users",
      "Offline-capable with background sync",
    ],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "static-design-system-kit",
    slug: "design-system-kit",
    name: "Design System Kit",
    description:
      "A comprehensive design system with reusable components, documentation, and Figma integration.",
    stack: ["React", "Storybook", "Figma"],
    year: "2025",
    status: "Open Source",
    overview:
      "Design System Kit provides a shared language between designers and engineers. Every component is documented with usage guidelines, prop tables, and accessibility notes. The Figma plugin keeps design tokens in sync with the codebase.",
    highlights: [
      "60+ accessible components built to WCAG 2.1 AA",
      "Figma plugin for two-way design token sync",
      "Interactive Storybook documentation with live props",
      "Dark mode and theming support via CSS custom properties",
    ],
    githubUrl: "https://github.com",
  },
  {
    id: "static-portfolio-generator",
    slug: "portfolio-generator",
    name: "Portfolio Generator",
    description:
      "An open-source tool that helps developers create beautiful portfolio websites in minutes.",
    stack: ["Next.js", "MDX", "Vercel"],
    year: "2024",
    status: "Open Source",
    overview:
      "Portfolio Generator removes the friction between having a personal brand and building a website. Developers write their content in MDX, configure a single JSON file, and deploy to Vercel in under five minutes. The design is minimal by default and easy to extend.",
    highlights: [
      "MDX-powered content with custom component support",
      "One-click deploy to Vercel with pre-configured CI",
      "SEO-optimized with structured data and Open Graph",
      "Multiple layout themes with CSS variable theming",
    ],
    githubUrl: "https://github.com",
    liveUrl: "https://example.com",
  },
  {
    id: "static-color-palette-builder",
    slug: "color-palette-builder",
    name: "Color Palette Builder",
    description:
      "Generate accessible color palettes with real-time contrast checking and export to various formats.",
    stack: ["Vue", "Canvas API", "WCAG"],
    year: "2024",
    status: "Live",
    overview:
      "Color Palette Builder solves the frustration of building color systems that look great but fail accessibility audits. Every palette is validated against WCAG contrast ratios in real time, and the export options make it easy to drop the result directly into any codebase or design tool.",
    highlights: [
      "Real-time WCAG AA and AAA contrast ratio checking",
      "Export to CSS variables, Tailwind config, or Figma tokens",
      "Perceptually uniform color generation using OKLCH",
      "Palette harmony suggestions based on color theory",
    ],
    liveUrl: "https://example.com",
  },
  {
    id: "static-markdown-editor",
    slug: "markdown-editor",
    name: "Markdown Editor",
    description:
      "A distraction-free markdown editor with live preview, syntax highlighting, and export options.",
    stack: ["React", "CodeMirror", "Electron"],
    year: "2024",
    status: "Open Source",
    overview:
      "Markdown Editor is a desktop app for writers and developers who want a clean, fast environment for writing in Markdown. The split-pane live preview, vim keybindings, and theme support make it a powerful alternative to heavier editors.",
    highlights: [
      "Split-pane live preview with smooth scroll sync",
      "Vim and Emacs keybinding modes via CodeMirror",
      "Export to PDF, HTML, and DOCX",
      "Custom themes with CSS injection support",
    ],
    githubUrl: "https://github.com",
  },
  {
    id: "static-api-documentation-tool",
    slug: "api-documentation-tool",
    name: "API Documentation Tool",
    description:
      "Automatically generate beautiful API documentation from your OpenAPI specifications.",
    stack: ["Node.js", "OpenAPI", "Swagger"],
    year: "2023",
    status: "Archived",
    overview:
      "A CLI tool and web interface that transforms OpenAPI 3.x specs into clean, searchable documentation sites. The generated output is a static site that can be hosted anywhere, with zero runtime dependencies.",
    highlights: [
      "Parses OpenAPI 3.x and Swagger 2.0 specifications",
      "Generates static documentation sites with zero dependencies",
      "Interactive request playground built-in",
      "Custom branding via configuration file",
    ],
    githubUrl: "https://github.com",
  },
  {
    id: "static-image-optimizer",
    slug: "image-optimizer",
    name: "Image Optimizer",
    description:
      "Batch process and optimize images for web with multiple format outputs and compression settings.",
    stack: ["Python", "PIL", "Flask"],
    year: "2023",
    status: "Open Source",
    overview:
      "Image Optimizer is a web-based batch processing tool that converts and compresses images for web delivery. Upload a folder, choose your format and quality settings, and download the optimized archive. It runs locally — no files leave your machine.",
    highlights: [
      "Batch processing with configurable quality and format per output",
      "Converts between JPEG, PNG, WebP, and AVIF",
      "Local processing — all files stay on your machine",
      "CLI and web UI interfaces",
    ],
    githubUrl: "https://github.com",
  },
  {
    id: "static-component-library",
    slug: "component-library",
    name: "Component Library",
    description:
      "A collection of accessible React components built with Tailwind CSS and Radix UI primitives.",
    stack: ["React", "Tailwind", "Radix UI"],
    year: "2023",
    status: "Open Source",
    overview:
      "A carefully curated set of unstyled, accessible components built on Radix UI primitives and styled with Tailwind CSS utility classes. Designed to be copied into your project, not installed as a black-box dependency.",
    highlights: [
      "Built on Radix UI for robust accessibility primitives",
      "Copy-paste components — no black-box dependencies",
      "Fully typed with TypeScript",
      "Comprehensive keyboard navigation and screen reader support",
    ],
    githubUrl: "https://github.com",
  },
];

export async function getProjects(): Promise<import("./notion").Project[]> {
  try {
    const notionProjects = await getProjectsFromNotion();
    return notionProjects ?? STATIC_PROJECTS;
  } catch (err) {
    throw new Error(`Failed to load projects: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function getProjectBySlug(slug: string): Promise<import("./notion").Project | null> {
  try {
    const all = await getProjects();
    return all.find((p) => p.slug === slug) ?? null;
  } catch (err) {
    throw new Error(`Failed to load project: ${err instanceof Error ? err.message : String(err)}`);
  }
}

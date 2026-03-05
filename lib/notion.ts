const NOTION_VERSION = "2022-06-28";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  readTime: string;
};

export type NotionRichTextItem = {
  plain_text: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
  };
  href?: string | null;
};

export type NotionBlock = {
  id: string;
  type: string;
  paragraph?: { rich_text: NotionRichTextItem[] };
  heading_1?: { rich_text: NotionRichTextItem[] };
  heading_2?: { rich_text: NotionRichTextItem[] };
  heading_3?: { rich_text: NotionRichTextItem[] };
  bulleted_list_item?: { rich_text: NotionRichTextItem[] };
  numbered_list_item?: { rich_text: NotionRichTextItem[] };
  code?: { rich_text: NotionRichTextItem[]; language: string };
  quote?: { rich_text: NotionRichTextItem[] };
  divider?: Record<string, never>;
  image?: {
    type: "file" | "external";
    file?: { url: string };
    external?: { url: string };
    caption?: NotionRichTextItem[];
  };
};

type NotionRichText = {
  plain_text: string;
};

type NotionTitleProperty = {
  type: "title";
  title: NotionRichText[];
};

type NotionRichTextProperty = {
  type: "rich_text";
  rich_text: NotionRichText[];
};

type NotionDateProperty = {
  type: "date";
  date: { start: string } | null;
};

type NotionSelectProperty = {
  type: "select";
  select: { name: string } | null;
};

type NotionMultiSelectProperty = {
  type: "multi_select";
  multi_select: { name: string }[];
};

type NotionUrlProperty = {
  type: "url";
  url: string | null;
};

type NotionProperty =
  | NotionTitleProperty
  | NotionRichTextProperty
  | NotionDateProperty
  | NotionSelectProperty
  | NotionMultiSelectProperty
  | NotionUrlProperty
  | { type: string };

type NotionPage = {
  id: string;
  url: string;
  properties: Record<string, NotionProperty>;
};

type NotionQueryResponse = {
  results: NotionPage[];
};

type NotionBlocksResponse = {
  results: NotionBlock[];
};

function readRichText(value: NotionRichText[] | undefined): string {
  return value?.map((item) => item.plain_text).join("") ?? "";
}

function getPropertyByType<T extends NotionProperty["type"]>(
  properties: Record<string, NotionProperty>,
  type: T,
): Extract<NotionProperty, { type: T }> | undefined {
  const match = Object.values(properties).find((property) => property.type === type);
  return match as Extract<NotionProperty, { type: T }> | undefined;
}

function estimateReadTime(text: string): string {
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function normalizePost(page: NotionPage): BlogPost {
  const titleProp = getPropertyByType(page.properties, "title");
  const richTextProp = getPropertyByType(page.properties, "rich_text");
  const dateProp = getPropertyByType(page.properties, "date");

  const title = readRichText(titleProp?.title) || "Untitled";
  const summary = readRichText(richTextProp?.rich_text) || "No summary provided.";
  const publishedAt = dateProp?.date?.start ?? "";
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  return {
    id: page.id,
    title,
    slug,
    summary,
    publishedAt,
    readTime: estimateReadTime(summary),
  };
}

export function formatDate(dateString: string) {
  if (!dateString) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(dateString));
}

const SAMPLE_POSTS: BlogPost[] = [
  {
    id: "sample-1",
    title: "How I Build Productive Engineering Systems",
    slug: "how-i-build-productive-engineering-systems",
    summary: "A practical framework for planning, building, and shipping software sustainably.",
    publishedAt: "2026-01-12",
    readTime: "6 min read",
  },
  {
    id: "sample-2",
    title: "Designing for Clarity in Personal Branding Websites",
    slug: "designing-for-clarity-in-personal-branding-websites",
    summary: "A breakdown of typography, spacing, and hierarchy decisions that improve trust.",
    publishedAt: "2025-11-09",
    readTime: "5 min read",
  },
  {
    id: "sample-3",
    title: "The Art of Minimalist Design",
    slug: "the-art-of-minimalist-design",
    summary:
      "Exploring how less can truly be more when it comes to creating impactful user experiences and interfaces.",
    publishedAt: "2026-01-28",
    readTime: "5 min read",
  },
  {
    id: "sample-4",
    title: "From Idea to Deployment: My Full-Stack Workflow",
    slug: "from-idea-to-deployment-my-full-stack-workflow",
    summary:
      "A walkthrough of the tools, habits, and decisions that take a project from a rough idea to a live product.",
    publishedAt: "2025-10-03",
    readTime: "7 min read",
  },
  {
    id: "sample-5",
    title: "Why I Choose Boring Technology",
    slug: "why-i-choose-boring-technology",
    summary:
      "Stability, community, and predictability matter more than novelty when you're shipping real products.",
    publishedAt: "2025-09-15",
    readTime: "4 min read",
  },
];

const SAMPLE_BLOCKS: Record<string, NotionBlock[]> = {
  "sample-1": [
    {
      id: "b1-1",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "Building productive engineering systems is less about finding the perfect tool and more about establishing repeatable processes that reduce friction and amplify output. After years of trial and error, I've distilled this into a few core principles.",
          },
        ],
      },
    },
    {
      id: "b1-2",
      type: "heading_2",
      heading_2: {
        rich_text: [{ plain_text: "Start With Constraints" }],
      },
    },
    {
      id: "b1-3",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "Every system I build starts by defining what success looks like and what the hard limits are — time, team size, technical debt tolerance. Constraints aren't obstacles; they're the scaffolding that makes decisions faster and clearer.",
          },
        ],
      },
    },
    {
      id: "b1-4",
      type: "heading_2",
      heading_2: {
        rich_text: [{ plain_text: "Automate the Boring Stuff" }],
      },
    },
    {
      id: "b1-5",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "Every repetitive action your team performs manually is a candidate for automation. CI/CD pipelines, linters, formatters, test runners — these aren't luxuries, they're foundations. If a machine can do it, it should.",
          },
        ],
      },
    },
    {
      id: "b1-6",
      type: "heading_2",
      heading_2: {
        rich_text: [{ plain_text: "Ship Small, Ship Often" }],
      },
    },
    {
      id: "b1-7",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "Large batches of work are where risk hides. Small, focused pull requests are easier to review, easier to revert, and easier to reason about. Pair this with feature flags and you get deployment confidence without sacrificing pace.",
          },
        ],
      },
    },
    {
      id: "b1-8",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "These aren't revolutionary ideas — but the teams that consistently apply them compound their productivity over time. The secret is consistency, not cleverness.",
          },
        ],
      },
    },
  ],
  "sample-2": [
    {
      id: "b2-1",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "A personal branding website is often the first impression you leave on potential collaborators, employers, or clients. Getting the visual clarity right is not a detail — it's the whole point.",
          },
        ],
      },
    },
    {
      id: "b2-2",
      type: "heading_2",
      heading_2: {
        rich_text: [{ plain_text: "Typography Sets the Tone" }],
      },
    },
    {
      id: "b2-3",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "Pick one strong typeface for headings and one reliable workhorse for body text. A sans-serif like Space Grotesk pairs well with a monospace like IBM Plex Mono for a technical yet approachable aesthetic. Avoid novelty fonts — they age fast and distract from the message.",
          },
        ],
      },
    },
    {
      id: "b2-4",
      type: "heading_2",
      heading_2: {
        rich_text: [{ plain_text: "Hierarchy Over Decoration" }],
      },
    },
    {
      id: "b2-5",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "Every element on the page should answer: what does the visitor need to know next? Use size, weight, and spacing to guide the eye. Decorative elements only earn their place if they reinforce the message.",
          },
        ],
      },
    },
    {
      id: "b2-6",
      type: "heading_2",
      heading_2: {
        rich_text: [{ plain_text: "Whitespace Is Not Wasted Space" }],
      },
    },
    {
      id: "b2-7",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "Generous padding and margins signal confidence. They tell the reader: take your time, this content is worth it. Crowded layouts feel rushed; spacious layouts feel considered. When in doubt, add more space.",
          },
        ],
      },
    },
  ],
  "sample-3": [
    {
      id: "b3-1",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "Minimalism in design is not about removing elements arbitrarily — it's about intentionality. Every element serves a purpose, and nothing is there just for decoration.",
          },
        ],
      },
    },
    {
      id: "b3-2",
      type: "heading_2",
      heading_2: {
        rich_text: [{ plain_text: "The Core Principles" }],
      },
    },
    {
      id: "b3-3",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "When we strip away the unnecessary, what remains becomes more powerful. White space isn't empty space; it's breathing room for your content. Typography doesn't need to be flashy to be effective.",
          },
        ],
      },
    },
    {
      id: "b3-4",
      type: "heading_2",
      heading_2: {
        rich_text: [{ plain_text: "Why Less is More" }],
      },
    },
    {
      id: "b3-5",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "In a world saturated with visual noise, minimalist design stands out by being quiet. It respects the user's attention and cognitive load. Clean interfaces lead to clearer thinking and better user experiences.",
          },
        ],
      },
    },
    {
      id: "b3-6",
      type: "heading_2",
      heading_2: {
        rich_text: [{ plain_text: "Practical Applications" }],
      },
    },
    {
      id: "b3-7",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "Start by removing one element at a time. Ask yourself: does this serve the user's goal? If not, it's probably decorative. Focus on hierarchy, contrast, and whitespace to guide the user's eye naturally through your design.",
          },
        ],
      },
    },
    {
      id: "b3-8",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "Remember: minimalism is a journey, not a destination. Keep refining, keep simplifying, and always put the user first.",
          },
        ],
      },
    },
  ],
  "sample-4": [
    {
      id: "b4-1",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "Every project starts as a vague idea. The gap between that idea and a deployed product is where most developers struggle. Here's the workflow I've refined over the years to close that gap consistently.",
          },
        ],
      },
    },
    {
      id: "b4-2",
      type: "heading_2",
      heading_2: { rich_text: [{ plain_text: "1. Define the Problem First" }] },
    },
    {
      id: "b4-3",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "Before writing a single line of code, I write a one-paragraph problem statement. Who has this problem? How are they solving it today? What does success look like? This single habit eliminates entire categories of wasted work.",
          },
        ],
      },
    },
    {
      id: "b4-4",
      type: "heading_2",
      heading_2: { rich_text: [{ plain_text: "2. Sketch, Don't Design" }] },
    },
    {
      id: "b4-5",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "I spend 20 minutes with a pen and paper before opening Figma or a code editor. Low-fidelity sketches are fast to throw away and help me think through flow before committing to implementation details.",
          },
        ],
      },
    },
    {
      id: "b4-6",
      type: "heading_2",
      heading_2: { rich_text: [{ plain_text: "3. Pick Your Stack and Commit" }] },
    },
    {
      id: "b4-7",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "Tech paralysis kills projects. I default to Next.js + Tailwind + Postgres for anything web-based. Boring, reliable, and fast to ship. The stack should be invisible — the product is what matters.",
          },
        ],
      },
    },
    {
      id: "b4-8",
      type: "heading_2",
      heading_2: { rich_text: [{ plain_text: "4. Deploy Early, Deploy Often" }] },
    },
    {
      id: "b4-9",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "I push to production on day one — even if it's just a landing page. Real deployment surfaces real problems. CI/CD via GitHub Actions + Vercel means shipping is a git push, not an event.",
          },
        ],
      },
    },
    {
      id: "b4-10",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "The goal is a tight loop: idea → code → deploy → feedback → repeat. The faster that loop spins, the better the product becomes.",
          },
        ],
      },
    },
  ],
  "sample-5": [
    {
      id: "b5-1",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "Every year, the JavaScript ecosystem produces a wave of new frameworks, runtimes, and paradigms. And every year, I resist the urge to adopt most of them. Here's why I keep choosing boring technology — and why I think you should too.",
          },
        ],
      },
    },
    {
      id: "b5-2",
      type: "heading_2",
      heading_2: { rich_text: [{ plain_text: "Boring Means Proven" }] },
    },
    {
      id: "b5-3",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "When a technology has been around for 5+ years, you're not a beta tester. The rough edges have been filed down. The footguns are documented. The Stack Overflow answers exist. You spend your time building, not debugging the tool itself.",
          },
        ],
      },
    },
    {
      id: "b5-4",
      type: "heading_2",
      heading_2: { rich_text: [{ plain_text: "Boring Means Hireable" }] },
    },
    {
      id: "b5-5",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "If you're building a team or handing off a project, boring technology means a larger talent pool. React, PostgreSQL, and Node.js developers are everywhere. Developers for that new compile-to-WASM framework you adopted last month are not.",
          },
        ],
      },
    },
    {
      id: "b5-6",
      type: "heading_2",
      heading_2: { rich_text: [{ plain_text: "When to Choose Exciting Technology" }] },
    },
    {
      id: "b5-7",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            plain_text:
              "I'm not a Luddite. I adopt new tools when they solve a real problem I currently have, not a hypothetical one. The bar is simple: does this make my product better for users, or my team faster? If yes, evaluate it seriously. If no, defer.",
          },
        ],
      },
    },
    {
      id: "b5-8",
      type: "quote",
      quote: {
        rich_text: [
          {
            plain_text:
              "Choose boring technology by default. Reserve innovation tokens for the parts of your product that are genuinely novel.",
          },
        ],
      },
    },
  ],
};

export async function getBlogPosts(): Promise<BlogPost[]> {
  const notionApiKey = process.env.NOTION_API_KEY;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;

  if (!notionApiKey || !notionDatabaseId) {
    return SAMPLE_POSTS;
  }

  const response = await fetch(
    `https://api.notion.com/v1/databases/${notionDatabaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionApiKey}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page_size: 20 }),
      next: { revalidate: 1800 },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to load Notion blog posts: ${response.status}`);
  }

  const payload = (await response.json()) as NotionQueryResponse;

  return payload.results
    .map(normalizePost)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug) ?? null;
}

// ── Projects ─────────────────────────────────────────────────────────────────

export type Project = {
  id: string;
  slug: string;
  name: string;
  description: string;
  stack: string[];
  year: string;
  status: "Live" | "Open Source" | "In Progress" | "Archived";
  overview: string;
  highlights: string[];
  githubUrl?: string;
  liveUrl?: string;
};

function getNamedProperty(
  properties: Record<string, NotionProperty>,
  name: string,
): NotionProperty | undefined {
  return properties[name];
}

function normalizeProject(page: NotionPage): Project {
  const props = page.properties;

  const titleProp = getNamedProperty(props, "Name");
  const name =
    titleProp?.type === "title" ? readRichText((titleProp as NotionTitleProperty).title) || "Untitled" : "Untitled";

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

  const descProp = getNamedProperty(props, "Description");
  const description =
    descProp?.type === "rich_text"
      ? readRichText((descProp as NotionRichTextProperty).rich_text)
      : "";

  const stackProp = getNamedProperty(props, "Stack");
  const stack =
    stackProp?.type === "multi_select"
      ? (stackProp as NotionMultiSelectProperty).multi_select.map((s) => s.name)
      : [];

  const yearProp = getNamedProperty(props, "Year");
  const year =
    yearProp?.type === "rich_text"
      ? readRichText((yearProp as NotionRichTextProperty).rich_text)
      : "";

  const statusProp = getNamedProperty(props, "Status");
  const statusValue =
    statusProp?.type === "select" ? (statusProp as NotionSelectProperty).select?.name ?? "" : "";
  const status = (["Live", "Open Source", "In Progress", "Archived"].includes(statusValue)
    ? statusValue
    : "Archived") as Project["status"];

  const overviewProp = getNamedProperty(props, "Overview");
  const overview =
    overviewProp?.type === "rich_text"
      ? readRichText((overviewProp as NotionRichTextProperty).rich_text)
      : "";

  const highlightsProp = getNamedProperty(props, "Highlights");
  const highlightsRaw =
    highlightsProp?.type === "rich_text"
      ? readRichText((highlightsProp as NotionRichTextProperty).rich_text)
      : "";
  const highlights = highlightsRaw
    .split("\n")
    .map((h) => h.replace(/^[\s•\-*]+/, "").trim())
    .filter(Boolean);

  const githubProp = getNamedProperty(props, "Github");
  const githubUrl =
    githubProp?.type === "url" ? (githubProp as NotionUrlProperty).url ?? undefined : undefined;

  const liveProp = getNamedProperty(props, "Live");
  const liveUrl =
    liveProp?.type === "url" ? (liveProp as NotionUrlProperty).url ?? undefined : undefined;

  return { id: page.id, slug, name, description, stack, year, status, overview, highlights, githubUrl, liveUrl };
}

export async function getProjectsFromNotion(): Promise<Project[] | null> {
  const notionApiKey = process.env.NOTION_API_KEY;
  const notionProjectsDatabaseId = process.env.NOTION_PROJECTS_DATABASE_ID;

  if (!notionApiKey || !notionProjectsDatabaseId) {
    return null;
  }

  const response = await fetch(
    `https://api.notion.com/v1/databases/${notionProjectsDatabaseId}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${notionApiKey}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ page_size: 50 }),
      next: { revalidate: 1800 },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to load Notion projects: ${response.status}`);
  }

  const payload = (await response.json()) as NotionQueryResponse;
  return payload.results.map(normalizeProject);
}

// ── Blog post blocks ──────────────────────────────────────────────────────────

export async function getPostBlocks(postId: string): Promise<NotionBlock[]> {
  const notionApiKey = process.env.NOTION_API_KEY;

  if (!notionApiKey) {
    return SAMPLE_BLOCKS[postId] ?? [];
  }

  const response = await fetch(`https://api.notion.com/v1/blocks/${postId}/children`, {
    headers: {
      Authorization: `Bearer ${notionApiKey}`,
      "Notion-Version": NOTION_VERSION,
    },
    next: { revalidate: 1800 },
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as NotionBlocksResponse;
  return payload.results;
}

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

type NotionProperty =
  | NotionTitleProperty
  | NotionRichTextProperty
  | NotionDateProperty
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
      next: { revalidate: 300 },
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
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    return [];
  }

  const payload = (await response.json()) as NotionBlocksResponse;
  return payload.results;
}

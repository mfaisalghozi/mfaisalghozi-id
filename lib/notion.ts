const NOTION_VERSION = "2022-06-28";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  url: string;
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

type NotionUrlProperty = {
  type: "url";
  url: string | null;
};

type NotionProperty =
  | NotionTitleProperty
  | NotionRichTextProperty
  | NotionDateProperty
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

function normalizePost(page: NotionPage): BlogPost {
  const titleProp = getPropertyByType(page.properties, "title");
  const richTextProp = getPropertyByType(page.properties, "rich_text");
  const dateProp = getPropertyByType(page.properties, "date");
  const urlProp = getPropertyByType(page.properties, "url");

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
    url: urlProp?.url ?? page.url,
  };
}

function formatDate(dateString: string) {
  if (!dateString) {
    return "Draft";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const notionApiKey = process.env.NOTION_API_KEY;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;

  if (!notionApiKey || !notionDatabaseId) {
    return [
      {
        id: "sample-1",
        title: "How I Build Productive Engineering Systems",
        slug: "how-i-build-productive-engineering-systems",
        summary: "A practical framework for planning, building, and shipping software sustainably.",
        publishedAt: "2026-01-12",
        url: "#",
      },
      {
        id: "sample-2",
        title: "Designing for Clarity in Personal Branding Websites",
        slug: "designing-for-clarity-in-personal-branding-websites",
        summary: "A breakdown of typography, spacing, and hierarchy decisions that improve trust.",
        publishedAt: "2025-11-09",
        url: "#",
      },
    ];
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
      body: JSON.stringify({
        page_size: 20,
      }),
      next: {
        revalidate: 300,
      },
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

export { formatDate };

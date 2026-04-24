import Image from "next/image";
import { notFound } from "next/navigation";

import {
  estimateReadTime,
  getBlogPosts,
  getPostBySlug,
  getPostBlocks,
  type NotionBlock,
  type NotionRichTextItem,
} from "@/lib/notion";
import BackButton from "@/components/back-button";
import { TagPill } from "@/components/tag-pill";
import { DateLink } from "@/components/date-link";

export const revalidate = 1800;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const title = `${post.title} | mfaisalghozi`;
  const url = `https://mfaisalghozi.id/blog/${slug}`;

  return {
    title,
    description: post.summary,
    openGraph: {
      title,
      description: post.summary,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      authors: ["Muhammad Faisal Ghozi"],
      siteName: "mfaisalghozi",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.summary,
      images: ["/opengraph-image"],
    },
    alternates: {
      canonical: url,
    },
  };
}

function renderRichText(items: NotionRichTextItem[]): React.ReactNode {
  return items.map((item, i) => {
    let node: React.ReactNode = item.plain_text;
    const isHighlighted = item.annotations?.color?.endsWith("_background");

    if (item.annotations?.code) {
      node = (
        <code
          key={i}
          className="rounded bg-[color:var(--surface)] px-1.5 py-0.5 font-mono text-sm text-[color:var(--accent)]"
        >
          {node}
        </code>
      );
    } else if (item.annotations?.bold) {
      node = (
        <strong
          key={i}
          className={isHighlighted ? "rounded px-1 py-0.5 bg-[color:var(--highlight-bg)] text-[color:var(--highlight-text)]" : undefined}
        >
          {node}
        </strong>
      );
    } else if (item.annotations?.italic) {
      node = (
        <em
          key={i}
          className={isHighlighted ? "rounded px-1 py-0.5 bg-[color:var(--highlight-bg)] text-[color:var(--highlight-text)]" : undefined}
        >
          {node}
        </em>
      );
    } else {
      node = (
        <span
          key={i}
          className={isHighlighted ? "rounded px-1 py-0.5 bg-[color:var(--highlight-bg)] text-[color:var(--highlight-text)]" : undefined}
        >
          {node}
        </span>
      );
    }

    if (item.href) {
      let safeHref: string | undefined;
      try {
        const parsed = new URL(item.href);
        if (parsed.protocol === "https:" || parsed.protocol === "http:") {
          safeHref = item.href;
        }
      } catch {
        // malformed URL — skip rendering as a link
      }
      if (safeHref) {
        return (
          <a
            key={i}
            href={safeHref}
            className="underline underline-offset-2 hover:text-[color:var(--accent)]"
            target="_blank"
            rel="noopener noreferrer"
          >
            {node}
          </a>
        );
      }
      return node;
    }

    return node;
  });
}

function BlockChildren({ blocks }: { blocks: NotionBlock[] }) {
  return (
    <div className="ml-1 mt-1 border-l border-[color:var(--line)] pl-4">
      {groupListItems(blocks)}
    </div>
  );
}

function BlockRenderer({ block }: { block: NotionBlock }) {
  const children =
    block.children && block.children.length > 0 ? (
      <BlockChildren blocks={block.children} />
    ) : null;

  switch (block.type) {
    case "heading_1":
      return (
        <>
          <h1 className="mt-10 text-3xl font-semibold text-[color:var(--text)]">
            {renderRichText(block.heading_1?.rich_text ?? [])}
          </h1>
          {children}
        </>
      );

    case "heading_2":
      return (
        <>
          <h2 className="mt-10 text-2xl font-semibold text-[color:var(--text)]">
            {renderRichText(block.heading_2?.rich_text ?? [])}
          </h2>
          {children}
        </>
      );

    case "heading_3":
      return (
        <>
          <h3 className="mt-8 text-xl font-semibold text-[color:var(--text)]">
            {renderRichText(block.heading_3?.rich_text ?? [])}
          </h3>
          {children}
        </>
      );

    case "paragraph": {
      const text = block.paragraph?.rich_text ?? [];
      if (text.length === 0) return <div className="h-4" />;
      return (
        <>
          <p className="mt-5 leading-relaxed text-[color:var(--muted)]">
            {renderRichText(text)}
          </p>
          {children}
        </>
      );
    }

    case "bulleted_list_item":
      return (
        <>
          <li className="mt-2 leading-relaxed text-[color:var(--muted)]">
            {renderRichText(block.bulleted_list_item?.rich_text ?? [])}
          </li>
          {children}
        </>
      );

    case "numbered_list_item":
      return (
        <>
          <li className="mt-2 leading-relaxed text-[color:var(--muted)]">
            {renderRichText(block.numbered_list_item?.rich_text ?? [])}
          </li>
          {children}
        </>
      );

    case "quote":
      return (
        <>
          <blockquote className="mt-6 border-l-2 border-[color:var(--accent)] pl-4 italic text-[color:var(--muted)]">
            {renderRichText(block.quote?.rich_text ?? [])}
          </blockquote>
          {children}
        </>
      );

    case "code":
      return (
        <>
          <pre className="mt-6 overflow-x-auto rounded-xl bg-[color:var(--surface)] p-4 font-mono text-sm text-[color:var(--text)]">
            <code>{block.code?.rich_text.map((t) => t.plain_text).join("")}</code>
          </pre>
          {children}
        </>
      );

    case "divider":
      return <hr className="my-8 border-[color:var(--line)]" />;

    case "image": {
      const src =
        block.image?.type === "file"
          ? block.image.file?.url
          : block.image?.external?.url;
      if (!src) return null;
      const caption = block.image?.caption?.map((t) => t.plain_text).join("") ?? "";
      return (
        <figure className="mt-8">
          <div className="relative w-full overflow-hidden rounded-xl">
            <Image
              src={src}
              alt={caption || "Blog image"}
              width={1200}
              height={675}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 800px"
              className="w-full object-cover"
            />
          </div>
          {caption && (
            <figcaption className="mt-2 text-center text-xs text-[color:var(--muted)]">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    default:
      return null;
  }
}

function groupListItems(blocks: NotionBlock[]): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "bulleted_list_item") {
      const items: NotionBlock[] = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        items.push(blocks[i]);
        i++;
      }
      result.push(
        <ul key={`ul-${i}`} className="mt-4 list-disc space-y-1 pl-6">
          {items.map((b) => (
            <BlockRenderer key={b.id} block={b} />
          ))}
        </ul>,
      );
    } else if (block.type === "numbered_list_item") {
      const items: NotionBlock[] = [];
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        items.push(blocks[i]);
        i++;
      }
      result.push(
        <ol key={`ol-${i}`} className="mt-4 list-decimal space-y-1 pl-6">
          {items.map((b) => (
            <BlockRenderer key={b.id} block={b} />
          ))}
        </ol>,
      );
    } else {
      result.push(<BlockRenderer key={block.id} block={block} />);
      i++;
    }
  }

  return result;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post: Awaited<ReturnType<typeof getPostBySlug>>;
  try {
    post = await getPostBySlug(slug);
  } catch (err) {
    throw new Error(`Failed to load blog post: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!post) notFound();

  let blocks: Awaited<ReturnType<typeof getPostBlocks>>;
  try {
    blocks = await getPostBlocks(post.id);
  } catch (err) {
    throw new Error(`Failed to load blog post content: ${err instanceof Error ? err.message : String(err)}`);
  }

  const blocksText = blocks
    .flatMap((b) => {
      const richText =
        b.paragraph?.rich_text ??
        b.heading_1?.rich_text ??
        b.heading_2?.rich_text ??
        b.heading_3?.rich_text ??
        b.bulleted_list_item?.rich_text ??
        b.numbered_list_item?.rich_text ??
        b.quote?.rich_text ??
        b.code?.rich_text ??
        [];
      return richText.map((t) => t.plain_text);
    })
    .join(" ");
  const readTime = estimateReadTime(blocksText);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: "Muhammad Faisal Ghozi",
      url: "https://mfaisalghozi.id",
    },
    url: `https://mfaisalghozi.id/blog/${post.slug}`,
    publisher: {
      "@type": "Person",
      name: "Muhammad Faisal Ghozi",
      url: "https://mfaisalghozi.id",
    },
  };

  return (
    <article className="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BackButton />

      <h1 className="mt-8 text-3xl font-bold leading-tight text-[color:var(--text)] sm:text-4xl">
        {post.title}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[color:var(--muted)]">
        <DateLink publishedAt={post.publishedAt} />
        <span>{readTime}</span>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        )}
      </div>

      <div className="mt-8">{groupListItems(blocks)}</div>

    </article>
  );
}

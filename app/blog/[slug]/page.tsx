import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  formatDate,
  getPostBySlug,
  getPostBlocks,
  type NotionBlock,
  type NotionRichTextItem,
} from "@/lib/notion";

export const revalidate = 1800;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} | mfaisalghozi`,
    description: post.summary,
  };
}

function renderRichText(items: NotionRichTextItem[]): React.ReactNode {
  return items.map((item, i) => {
    let node: React.ReactNode = item.plain_text;

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
      node = <strong key={i}>{node}</strong>;
    } else if (item.annotations?.italic) {
      node = <em key={i}>{node}</em>;
    } else {
      node = <span key={i}>{node}</span>;
    }

    if (item.href) {
      return (
        <a
          key={i}
          href={item.href}
          className="underline underline-offset-2 hover:text-[color:var(--accent)]"
          target="_blank"
          rel="noopener noreferrer"
        >
          {node}
        </a>
      );
    }

    return node;
  });
}

function BlockRenderer({ block }: { block: NotionBlock }) {
  switch (block.type) {
    case "heading_1":
      return (
        <h1 className="mt-10 text-3xl font-semibold text-[color:var(--text)]">
          {renderRichText(block.heading_1?.rich_text ?? [])}
        </h1>
      );

    case "heading_2":
      return (
        <h2 className="mt-10 text-2xl font-semibold text-[color:var(--text)]">
          {renderRichText(block.heading_2?.rich_text ?? [])}
        </h2>
      );

    case "heading_3":
      return (
        <h3 className="mt-8 text-xl font-semibold text-[color:var(--text)]">
          {renderRichText(block.heading_3?.rich_text ?? [])}
        </h3>
      );

    case "paragraph": {
      const text = block.paragraph?.rich_text ?? [];
      if (text.length === 0) return <div className="mt-6" />;
      return (
        <p className="mt-5 leading-relaxed text-[color:var(--muted)]">
          {renderRichText(text)}
        </p>
      );
    }

    case "bulleted_list_item":
      return (
        <li className="mt-2 leading-relaxed text-[color:var(--muted)]">
          {renderRichText(block.bulleted_list_item?.rich_text ?? [])}
        </li>
      );

    case "numbered_list_item":
      return (
        <li className="mt-2 leading-relaxed text-[color:var(--muted)]">
          {renderRichText(block.numbered_list_item?.rich_text ?? [])}
        </li>
      );

    case "quote":
      return (
        <blockquote className="mt-6 border-l-2 border-[color:var(--accent)] pl-4 italic text-[color:var(--muted)]">
          {renderRichText(block.quote?.rich_text ?? [])}
        </blockquote>
      );

    case "code":
      return (
        <pre className="mt-6 overflow-x-auto rounded-xl bg-[color:var(--surface)] p-4 font-mono text-sm text-[color:var(--text)]">
          <code>{block.code?.rich_text.map((t) => t.plain_text).join("")}</code>
        </pre>
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
              width={800}
              height={450}
              className="w-full object-cover"
              unoptimized
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

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const blocks = await getPostBlocks(post.id);

  return (
    <article className="mx-auto max-w-2xl px-6 py-10">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
      >
        <ArrowLeftIcon />
        Back to all posts
      </Link>

      <h1 className="mt-8 text-4xl font-bold leading-tight text-[color:var(--text)]">
        {post.title}
      </h1>

      <div className="mt-4 flex items-center gap-4 text-sm text-[color:var(--muted)]">
        <span className="flex items-center gap-1.5">
          <CalendarIcon />
          {formatDate(post.publishedAt)}
        </span>
        <span>{post.readTime}</span>
      </div>

      <div className="mt-8">{groupListItems(blocks)}</div>

    </article>
  );
}

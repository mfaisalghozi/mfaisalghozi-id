# mfaisalghozi.id

Personal website built with Next.js (App Router) with three pages:

- Landing page (`/`)
- Blog list page (`/blog`) powered by Notion CMS
- Project showcase page (`/projects`)

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Notion API as CMS for blog list

## Local development

1. Install dependencies:

```bash
pnpm install
```

2. Copy env variables:

```bash
cp .env.example .env.local
```

3. Add your Notion credentials in `.env.local`:

```bash
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

4. Run development server:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Notion database notes

- Share the Notion database with your internal integration.
- The blog list parser reads common property types:
  - `title` for post title
  - first `rich_text` property for summary
  - first `date` property for publish date
  - first `url` property for custom external URL (optional)
- If Notion env variables are not set, the blog page shows sample fallback posts.

## Domain

Set your production domain to `mfaisalghozi.id` in your hosting provider (for example, Vercel project domain settings).

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install      # install dependencies
pnpm dev          # start dev server at http://localhost:3000
pnpm build        # production build
pnpm start        # serve production build
pnpm lint         # run ESLint
```

Environment variables are required for Notion integration. Copy `.env.example` to `.env.local` and fill in:
- `NOTION_API_KEY` — Notion internal integration secret
- `NOTION_DATABASE_ID` — ID of the blog Notion database
- `NOTION_PROJECTS_DATABASE_ID` — ID of the projects Notion database

Without these, the blog falls back to hardcoded sample posts/blocks in `lib/notion.ts`, and projects fall back to the static array in `lib/projects.ts`.

## Architecture

This is a **Next.js 16 App Router** personal website deployed to `mfaisalghozi.id`.

**Pages:**
- `/` — Landing page (`app/page.tsx`)
- `/blog` — Blog list fetched from Notion (`app/blog/page.tsx`)
- `/blog/[slug]` — Individual blog post; slug is derived from post title (`app/blog/[slug]/page.tsx`)
- `/projects` — Project showcase (`app/projects/page.tsx`)
- `/projects/[slug]` — Individual project detail (`app/projects/[slug]/page.tsx`)

**Data layers:**
- `lib/notion.ts` — All Notion API calls (raw `fetch`, not the Notion SDK). Normalizes database pages into `BlogPost` objects and fetches page blocks. Blog post slugs are generated from titles. Responses are cached for 300 s via `next: { revalidate: 300 }`.
- `lib/projects.ts` — Async `getProjects()` / `getProjectBySlug()` that fetch from Notion (`NOTION_PROJECTS_DATABASE_ID`) with fallback to a static array. `Project` type is defined in `lib/notion.ts`.

**Theming:**
- Dark/light mode via `data-theme` attribute on `<html>` (toggled by `components/theme-toggle.tsx`).
- All colors are CSS custom properties defined in `app/globals.css` (variables: `--bg`, `--surface`, `--card`, `--text`, `--muted`, `--line`, `--accent`). Use these variables for all new UI, not hard-coded colors.
- Fonts: Space Grotesk (sans, `--font-space-grotesk`) and IBM Plex Mono (mono, `--font-ibm-plex-mono`), both loaded via `next/font/google`.

**Package manager:** pnpm (use `pnpm`, not `npm` or `yarn`).

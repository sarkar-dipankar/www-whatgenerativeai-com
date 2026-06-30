# Agents

This repo is the Astro + Tailwind implementation of **whatgenerativeai.com** — a multilingual (10-language) marketing + docs site for the GenAI Playbook, optimized for classic SEO and AI-search citation (Google AI Overviews, Perpity, ChatGPT, Claude).

## Stack
- Astro 7+ (static output) + Tailwind CSS v4 + TypeScript strict
- Content collections for `docs/` and `posts/` with Zod frontmatter schema
- i18n: en (default) + it, pl, ta, ko, he, fi, ar, nl, de. Non-en routes: `/<lang>/...`
- Pagefind for in-site search; `@astrojs/sitemap`, `@astrojs/rss`

## Project layout (target)
```
src/
  content/docs/        # chapters, per-language .<lang>.md suffix
  content/posts/       # announcements
  content/config.ts    # collection schemas
  i18n/                # UI strings + lang metadata
  components/          # Tailwind UI (BaseLayout, Sidebar, Toc, LanguageSwitcher, ThemeToggle, Search, Hero, Footer)
  layouts/
  pages/
  styles/
public/
  llms.txt  robots.txt  manifest.webmanifest  images
```

## Conventions
- Markdown chapters keep frontmatter: `title, description, slug, date, author, tags, categories, weight, lang, draft`.
- Every page emits canonical + hreflang alternates (29→10 langs), OG/Twitter, JSON-LD (`WebSite`, `Organization`, `Article`, `BreadcrumbList`, `FAQPage`).
- `llms.txt` at root; each chapter has a concise AI-friendly summary section.
- No client JS except Pagefind + theme toggle; LCP must be fast.
- Authors: Dipankar Sarkar — keep an author bio page for E-E-A-T.

## Commands
- Build: `npm run build` (also runs `astro check`)
- Dev: `npm run dev`
- Preview: `npm run preview`

## Notes for agents
- Do NOT commit unless explicitly asked.
- When editing content, preserve existing markdown body; only modify frontmatter/structure as instructed.
- Keep all 10 languages in sync when adding new chapters or FAQ blocks.
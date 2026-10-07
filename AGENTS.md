# Agents

This repo is the Astro + Tailwind implementation of **whatgenerativeai.com** — the buyer-facing decision and activation layer for business AI adoption, built around the open GenAI and Agentic AI Playbooks (10 languages). Positioning: *work out where AI is worth using, decide what to buy or build, and get the right workflow into practice.* Paid engagements are delivered by Neul Labs (disclosed on every commercial page). Optimised for classic SEO and AI-search citation.

## Stack
- Astro 7+ (static output) + Tailwind CSS v4 + TypeScript strict
- Content collections for `docs/`, `posts/` and `guides/` with Zod frontmatter schema in `src/content.config.ts`
- i18n: en (default) + it, pl, ta, ko, he, fi, ar, nl, de. Non-en routes: `/<lang>/...`
- Pagefind for in-site search; `@astrojs/sitemap`, `@astrojs/rss`

## Project layout (target)
```
src/
  content/docs/        # chapters, per-language .<lang>.md suffix
  content/posts/       # announcements
  content/guides/      # English decision + workflow guides (buyer decision layer)
  content.config.ts    # collection schemas
  data/                # offers, buying situations, tools, clusters, chapter next steps, site constants
  lib/                 # alternates (hreflang), brief/scorecard/economics (tool logic)
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
- Every page emits canonical + hreflang alternates (only for languages that really exist), OG/Twitter, JSON-LD (`WebSite`, `Organization`, `Article`, `BreadcrumbList`, `Service` on offers).
- `llms.txt` at root; each chapter has a concise AI-friendly summary section.
- No client JS except Pagefind, the theme toggle, the Turnstile forms (`/contact/`, `/work-with-us/intake/`) and the page-scoped decision tools under `/tools/`. Tools: no third-party scripts, no tracking, results computed in the browser, and the methodology rendered statically so it is readable/indexable without JS. LCP must be fast.
- Commercial/decision pages (`/start/`, `/guides/`, `/tools/`, `/work-with-us/`, `/evidence/`) are English-only by design. Pass `alternates` to `BaseLayout` on any page that does not exist in all 10 languages at the same path (use `collectionAlternates` for docs/posts).
- Do not add new FAQPage JSON-LD (Google stopped showing FAQ rich results); keep visible Q&A content.
- Offer prices and copy live in `src/data/offers.ts`; disclosure wording lives in `src/data/site.ts` + `Disclosure.astro` — keep them in sync.
- Guides: every claim must be sourced or clearly marked as a hypothetical example; update `reviewed:` only after a genuine human review.
- Authors: Dipankar Sarkar — keep an author bio page for E-E-A-T.

## Commands
- Build: `npm run build` (also runs `astro check`)
- Dev: `npm run dev`
- Preview: `npm run preview`

## Notes for agents
- Do NOT commit unless explicitly asked.
- When editing content, preserve existing markdown body; only modify frontmatter/structure as instructed.
- Keep all 10 languages in sync when adding new playbook chapters. UI strings for localized pages live in `src/i18n/index.ts`.
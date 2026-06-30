import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import pagefind from "astro-pagefind";
import compress from "astro-compress";
import tailwindcss from "@tailwindcss/vite";
import remarkToc from "remark-toc";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export const LANGUAGES = ["en", "it", "pl", "ta", "ko", "he", "fi", "ar", "nl", "de"] as const;
export type Language = (typeof LANGUAGES)[number];
export const DEFAULT_LANG: Language = "en";

export const SITE = {
  url: "https://www.whatgenerativeai.com",
  name: "What Generative AI",
  title: "What Generative AI — The GenAI Playbook for Business Leaders",
  description:
    "The open-source GenAI Playbook: a practical, executive guide to implementing Generative AI in your organization. Strategy, security, people, data, and real-world use cases — in 10 languages.",
  author: "Dipankar Sarkar",
  email: "me@dipankar.name",
  twitter: "@dipankarsarkar",
  github: "https://github.com/terraprompt/whatgenerativeai",
};

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  output: "static",
  trailingSlash: "always",
  i18n: {
    defaultLocale: DEFAULT_LANG,
    locales: [...LANGUAGES],
    routing: { prefixDefaultLocale: false, redirectToDefaultLocale: false },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: DEFAULT_LANG,
        locales: Object.fromEntries(LANGUAGES.map((l) => [l, l])),
      },
    }),
    pagefind(),
    compress(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    syntaxHighlight: "shiki",
    shikiConfig: { theme: "github-dark" },
    remarkPlugins: [remarkToc],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }],
    ],
  },
});
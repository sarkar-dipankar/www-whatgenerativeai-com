import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

// Generate unique IDs from the full filename (including lang suffix)
// so that e.g. agents-tools-mcp.md and agents-tools-mcp.it.md don't collide
// even if they share the same `slug` frontmatter.
const generateId = ({ entry }: { entry: string; base: string }): string => {
  // entry is the relative path from base, e.g. "agents-tools-mcp.it.md"
  return entry.replace(/\.md$/, "");
};

const docs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs", generateId }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string().optional(),
    date: z.coerce.date().optional(),
    author: z.string().default("Dipankar Sarkar"),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    weight: z.number().default(0),
    lang: z.enum(["en", "it", "pl", "ta", "ko", "he", "fi", "ar", "nl", "de"]).default("en"),
    draft: z.boolean().default(false),
    bookFlatSection: z.boolean().optional(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts", generateId }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    slug: z.string().optional(),
    date: z.coerce.date().optional(),
    author: z.string().default("Dipankar Sarkar"),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    lang: z.enum(["en", "it", "pl", "ta", "ko", "he", "fi", "ar", "nl", "de"]).default("en"),
    draft: z.boolean().default(false),
  }),
});

export const collections = { docs, posts };
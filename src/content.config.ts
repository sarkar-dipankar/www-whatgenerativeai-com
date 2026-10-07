import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const docs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/docs" }),
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
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
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

// Decision and workflow guides — English-only buyer decision layer.
// Body shape: answer → when it applies → options → what to check → worked example → next step.
const guides = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/guides" }),
  schema: z.object({
    title: z.string(),
    /** <title> override when `title` exceeds the 30–65 char SEO window. */
    seoTitle: z.string().max(65).optional(),
    description: z.string(),
    slug: z.string(),
    kind: z.enum(["decision", "workflow"]),
    cluster: z.string(),
    question: z.string(),
    answer: z.string(),
    appliesWhen: z.array(z.string()).default([]),
    alternatives: z.array(z.string()).default([]),
    offer: z.string().optional(),
    tool: z.string().optional(),
    relatedChapters: z.array(z.string()).default([]),
    relatedPosts: z.array(z.string()).default([]),
    weight: z.number().default(50),
    date: z.coerce.date(),
    reviewed: z.coerce.date(),
    author: z.string().default("Dipankar Sarkar"),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { docs, posts, guides };
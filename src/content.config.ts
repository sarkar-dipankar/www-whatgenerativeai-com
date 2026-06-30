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

export const collections = { docs, posts };
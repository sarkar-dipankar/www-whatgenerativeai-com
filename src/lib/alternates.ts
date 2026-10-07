import { getCollection } from "astro:content";
import type { LanguageCode } from "../i18n";

export interface Alternate {
  lang: LanguageCode;
  path: string;
}

const LANG_SUFFIX = /\.(it|pl|ta|ko|he|fi|ar|nl|de)$/;

/** Base filename shared by an English entry and its translations, e.g. "internal" for internal.md / internal.nl.md. */
export function entryBase(entry: { id: string; filePath?: string }): string {
  const file = entry.filePath?.split("/").pop() ?? entry.id;
  return file.replace(/\.mdx?$/, "").replace(LANG_SUFFIX, "");
}

export function entrySlug(entry: { id: string; data: { slug?: string } }): string {
  return entry.data.slug ?? entry.id.replace(/\.md$/, "");
}

/**
 * hreflang alternates for a docs/posts entry: only languages that actually
 * have a translation of the same source file, using each language's real slug.
 */
export async function collectionAlternates(
  collection: "docs" | "posts",
  base: string,
  section: string,
): Promise<Alternate[]> {
  const entries = await getCollection(collection, (e) => !e.data.draft && entryBase(e) === base);
  return entries.map((e) => ({
    lang: e.data.lang as LanguageCode,
    path: `${e.data.lang === "en" ? "" : `/${e.data.lang}`}${section}${entrySlug(e)}/`,
  }));
}

/** Alternates for a page that only exists in English. */
export function englishOnly(path: string): Alternate[] {
  return [{ lang: "en", path }];
}

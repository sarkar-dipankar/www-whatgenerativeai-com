import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const docs = (await getCollection("docs", (e) => e.data.lang === "en" && !e.data.draft && !e.id.startsWith("_index")))
    .sort((a, b) => (a.data.weight ?? 99) - (b.data.weight ?? 99));
  const posts = (await getCollection("posts", (e) => e.data.lang === "en" && !e.data.draft && !e.id.startsWith("_index")))
    .sort((a, b) => +new Date(b.data.date ?? 0) - +new Date(a.data.date ?? 0));
  const items = [
    ...docs.map((d) => ({
      title: d.data.title,
      description: d.data.description ?? "",
      pubDate: d.data.date ?? new Date(),
      link: `/docs/genai-playbook/${d.data.slug}/`,
    })),
    ...posts.map((p) => ({
      title: p.data.title,
      description: p.data.description ?? "",
      pubDate: p.data.date ?? new Date(),
      link: `/posts/${p.data.slug}/`,
    })),
  ];
  return rss({
    title: "What Generative AI — The GenAI Playbook",
    description: "Practical, executive-grade guide to implementing Generative AI in your organization.",
    site: context.site,
    items,
  });
}
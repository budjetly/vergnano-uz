import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n";
import { products, collections } from "@/lib/products";
import { SITE_URL } from "@/lib/seo";

const lastModified = new Date();

function entry(path: string, priority: number, changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]): MetadataRoute.Sitemap {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `${SITE_URL}/${l}${path}`;
  languages["x-default"] = `${SITE_URL}/uz${path}`;
  return locales.map((l) => ({
    url: `${SITE_URL}/${l}${path}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: { languages },
  }));
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entry("", 1, "weekly"),
    ...entry("/products", 0.9, "weekly"),
    ...entry("/about", 0.6, "monthly"),
    ...entry("/contact", 0.6, "monthly"),
    ...collections.flatMap((c) => entry(`/${c}`, 0.8, "weekly")),
    ...products.flatMap((p) => entry(`/products/${p.id}`, 0.7, "weekly")),
  ];
}

import type { MetadataRoute } from "next";
import { EDITION_DETAILS } from "@/lib/editions";
import { ARTICLES } from "@/lib/journal";

const BASE = "https://avorio-kappa.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/collezione", "/atelier", "/journal", "/regali", "/contatto"];
  return [
    ...pages.map((p) => ({ url: `${BASE}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...EDITION_DETAILS.map((e) => ({ url: `${BASE}/collezione/${e.slug}`, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...ARTICLES.map((a) => ({ url: `${BASE}/journal/${a.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}

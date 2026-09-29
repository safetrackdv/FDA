import type { MetadataRoute } from "next";
import { SEO_DRUGS } from "@/lib/seo-drugs";

const BASE = "https://safetrackdv.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["/", "/check", "/pricing", "/recalls", "/login", "/signup"];
  const drugPages = SEO_DRUGS.map((d) => `/recalls/${d.slug}`);
  return [...staticPages, ...drugPages].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: path.startsWith("/recalls/") ? "daily" : "weekly",
    priority: path === "/" ? 1 : path.startsWith("/recalls/") ? 0.8 : 0.6,
  }));
}

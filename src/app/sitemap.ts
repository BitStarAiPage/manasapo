import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** 公開するページの一覧。ページを増やしたらここにも足す */
const pages = ["", "/seasonal-course", "/inquiry-learning"];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((path) => ({ url: `${site.url}${path}` }));
}

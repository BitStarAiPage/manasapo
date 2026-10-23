import type { MetadataRoute } from "next";
import { site } from "@/content/site";

/** 制作用・比較用のページは検索に出さない */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/alt", "/fv-editor", "/api/", "/thanks"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}

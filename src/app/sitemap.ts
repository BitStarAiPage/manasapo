import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/cms";
import { site } from "@/content/site";

/** 公開するページの一覧。ページを増やしたらここにも足す */
const pages = ["", "/seasonal-course", "/inquiry-learning", "/blog"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ブログ記事は管理画面（CMS）から取る。取れないときは固定ページだけを出す
  const articles = await getArticles();

  return [
    ...pages.map((path) => ({ url: `${site.url}${path}` })),
    ...articles.map((article) => ({
      url: `${site.url}/blog/${encodeURIComponent(article.key)}`,
      lastModified: article.publishedAt ?? undefined,
    })),
  ];
}

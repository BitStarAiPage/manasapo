import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, toPlainText } from "@/lib/cms";
import { LinkButton } from "@/components/ui/button";
import { Wrap } from "@/components/ui/wrap";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "記事が見つかりません" };

  const description = article.excerpt || toPlainText(article.content, 120);
  const url = `/blog/${encodeURIComponent(article.key)}`;
  // サムネイルがある記事は、SNS で共有したときの画像もそれにする（無ければサイト共通の画像）
  const images = article.thumbnail ? [article.thumbnail] : undefined;

  return {
    title: article.title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", title: article.title, description, url, images },
    twitter: { card: "summary_large_image", title: article.title, description, images },
  };
}

/** ブログ記事。本文は管理画面で作った HTML を、危ない記述を除いてから表示する（src/lib/cms.ts） */
export default async function BlogArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <article className="bg-white py-10 lg:py-16">
      <Wrap>
        <div className="mx-auto max-w-[46rem]">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {article.category && (
              <span className="rounded-full bg-sun px-3 py-0.5 text-xs font-bold">
                {article.category}
              </span>
            )}
            {article.date && (
              <time dateTime={article.publishedAt ?? undefined} className="font-bold text-ink-soft">
                {article.date}
              </time>
            )}
          </div>

          <h1 className="mt-3 text-[1.625rem] leading-[1.5] tracking-[0.02em] sm:text-3xl lg:text-[2.125rem]">
            {article.title}
          </h1>

          {article.thumbnail && (
            <div className="relative mt-6 aspect-[3/2] overflow-hidden rounded-xl bg-mint">
              {/* eslint-disable-next-line @next/next/no-img-element -- 管理画面の配信元から直接読む */}
              <img
                src={article.thumbnail}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          )}

          <div
            className="cms-content mt-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {article.externalLink && (
            <a
              href={article.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block font-bold underline underline-offset-4"
            >
              関連ページを見る
            </a>
          )}

          <div className="mt-12 flex justify-center">
            <LinkButton href="/blog" variant="ghost">
              ブログ一覧へ戻る
            </LinkButton>
          </div>
        </div>
      </Wrap>
    </article>
  );
}

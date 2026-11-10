import type { Metadata } from "next";
import Link from "next/link";
import { getArticles } from "@/lib/cms";
import { Wrap } from "@/components/ui/wrap";

export const metadata: Metadata = {
  title: "ブログ",
  description: "北海道岩見沢市の学習塾まなサポのブログです。教室の様子やお知らせを掲載しています。",
  alternates: { canonical: "/blog" },
};

/**
 * ブログ一覧。記事は管理画面（CMS）から毎回取得する（src/lib/cms.ts）。
 * カードはトップの「コース紹介」と同じ、黒い枠の白いカードにそろえている。
 */
export default async function BlogIndexPage() {
  const articles = await getArticles();

  return (
    <section className="bg-ivory py-10 lg:py-16">
      <Wrap>
        <p className="text-lg font-black">BLOG</p>
        <h1 className="mt-2 text-[2rem] leading-[1.25] tracking-[0.03em] sm:text-4xl lg:text-5xl">
          ブログ
        </h1>
        <p className="mt-4 text-base leading-[1.95]">教室の様子やお知らせを掲載しています。</p>

        {articles.length === 0 ? (
          <p className="mt-10 rounded-xl border-2 border-ink/10 bg-white px-6 py-10 text-center text-base text-ink-soft">
            現在公開中の記事はありません。
          </p>
        ) : (
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:mt-10 lg:grid-cols-3 lg:gap-8">
            {articles.map((article) => (
              <li key={article.key}>
                <Link
                  href={`/blog/${article.key}`}
                  className="flex h-full flex-col overflow-hidden rounded-xl border-2 border-ink bg-white transition-colors hover:bg-sun/20"
                >
                  <div className="relative aspect-[3/2] bg-mint">
                    {article.thumbnail ? (
                      // 画像は管理画面の配信元から直接読む（配信元が決まっていないため next/image を使わない）
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.thumbnail}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : (
                      // サムネイルが無い記事はロゴを薄く置く
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src="/images/logo.png"
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 m-auto w-[36%] opacity-40 mix-blend-multiply"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
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
                    <h2 className="text-lg leading-[1.6] font-black">{article.title}</h2>
                    {article.excerpt && (
                      <p className="text-sm leading-[1.85] text-ink-soft">{article.excerpt}</p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Wrap>
    </section>
  );
}

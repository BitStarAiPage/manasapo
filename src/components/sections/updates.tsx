import Link from "next/link";
import { updateMedia } from "@/content/media";
import { getArticles, type Article } from "@/lib/cms";
import { socialLinks } from "@/content/site";
import { floatStyle } from "@/lib/reveal";
import { LinkButton } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { Wrap } from "@/components/ui/wrap";

const instagram = socialLinks[0];

/** TOP に並べる新着記事の数 */
const LATEST_COUNT = 3;

/**
 * 「最近のまなサポ」。ブログ（管理画面の記事）の新着を3件並べる（2026-11 のご依頼）。
 * 新着が届くまでは支給写真3枚（updateMedia）のまま（2026-11 のご指示）。記事が1〜2件のあいだは、
 * 足りない枠を写真で埋める。管理画面から取れないときも写真3枚になる。
 * 記事は60秒ごとに取り直すので、管理画面で公開してから TOP に出るまで最大1分ほどかかる。
 */
export async function Updates() {
  const articles = (await getArticles({ revalidate: 60 })).slice(0, LATEST_COUNT);

  return (
    <section id="updates" className="bg-white py-8 lg:py-14">
      <Wrap>
        <div className="grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-start lg:gap-12">
          <div className="lg:pt-2">
            {/* PC だけ2行にする。この見出しは `lg:grid-cols-[auto_1fr_auto]` の auto 側にいるので、
                1行のままだと見出しの列が横に伸びて写真の列が狭くなる。
                1023px 以下は横幅が足りないので1行のまま。 */}
            <h2 className="text-2xl leading-[1.25] tracking-[0.03em] sm:text-3xl">
              <span className="lg:block">最近の</span>
              <span className="lg:block">まなサポ</span>
            </h2>
            {/* ブログ（管理画面の記事）の一覧へ。見出しの真下に置き、スマホでも写真より先に見える位置にする */}
            <LinkButton href="/blog" variant="ghost" size="sm" className="mt-4 lg:mt-6">
              記事一覧を見る<span aria-hidden="true" className="ml-1">→</span>
            </LinkButton>
          </div>

          {/* 新着記事を左から並べ、3件に足りない分は支給写真で埋める（記事0件なら写真3枚のまま） */}
          <ul className="grid gap-6 sm:grid-cols-3">
            {articles.map((article) => (
              <li key={article.key}>
                <ArticleCard article={article} />
              </li>
            ))}
            {updateMedia.slice(0, LATEST_COUNT - articles.length).map((item) => (
              <li key={item.label}>
                <Photo
                  media={item}
                  showLabel={false}
                  sizes="(max-width: 640px) 90vw, 28vw"
                  className="rounded-xl"
                />
                <p className="mt-2 text-sm font-bold">{item.label}</p>
              </li>
            ))}
          </ul>

          <a
            href={instagram.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 self-start font-bold hover:underline lg:flex-col lg:items-center lg:gap-1 lg:text-center"
          >
            <InstagramIcon />
            <span className="text-sm">
              Instagram
              <span className="hidden lg:block">はこちら</span>
            </span>
            <span aria-hidden="true">→</span>
          </a>
        </div>

      </Wrap>
    </section>
  );
}

/** 新着記事1件。写真の並びと同じ大きさ（3:2・角丸）にそろえ、下に日付とタイトルを出す */
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/blog/${article.key}`} className="group block">
      <div className="relative aspect-[3/2] overflow-hidden rounded-xl bg-mint">
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
          // サムネイルが無い記事はロゴを薄く置く（ブログ一覧と同じ）
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/logo.png"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 m-auto w-[36%] opacity-40 mix-blend-multiply"
          />
        )}
      </div>
      {article.date && (
        <time dateTime={article.publishedAt ?? undefined} className="mt-2 block text-xs font-bold text-ink-soft">
          {article.date}
        </time>
      )}
      <p className="mt-1 line-clamp-2 text-sm leading-[1.6] font-bold group-hover:underline">
        {article.title}
      </p>
    </Link>
  );
}

function InstagramIcon() {
  return (
    // 隣の → は動かさない。ひとつのリンクの中で2つ動くとうるさくなる
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="float-slow h-7 w-7 shrink-0"
      style={floatStyle(5.4, 1.2)}
    >
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.6" cy="6.4" r="1.4" fill="currentColor" />
    </svg>
  );
}

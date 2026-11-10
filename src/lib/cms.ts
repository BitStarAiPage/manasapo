/**
 * CMS（管理画面 admin.bsap.tokyo）からブログ記事を取得する。
 * 同じ管理画面と連携している studymate_poper の実装（app/_lib/cms.ts）に合わせている。
 *
 * エンドポイント（2026-11-11 支給）：
 *   https://admin.bsap.tokyo/api/v1/public/contents/website/2672a650-d3de-48af-b16f-96016e5bd2bb?types=article,event,card
 * 環境変数で差し替えられる：
 *   CMS_API_BASE   … 既定 https://admin.bsap.tokyo
 *   CMS_WEBSITE_ID … website の UUID
 *   CMS_CONTENTS_URL … 上記2つの代わりに、エンドポイントを直接指定する場合
 *
 * レスポンス形：{ success, data: Content[], pagination: { total, limit, offset, hasMore }, _meta }
 * Content（article）：id / type / title / slug / excerpt / content(HTML) /
 *   thumbnail: { url, alt } | null / category | null / categories[] / displayOrder / publishedAt / externalLink
 *
 * ★ 2026-11-11 時点で記事は 0 件。event / card は今のところサイトに出していない。
 */

const API_BASE = process.env.CMS_API_BASE ?? "https://admin.bsap.tokyo";
const WEBSITE_ID =
  process.env.CMS_WEBSITE_ID ?? "2672a650-d3de-48af-b16f-96016e5bd2bb";

export const CMS_ENDPOINT =
  process.env.CMS_CONTENTS_URL ??
  `${API_BASE}/api/v1/public/contents/website/${WEBSITE_ID}`;

/** CMS の応答を待つ上限。遅いときはページの表示を優先して打ち切る */
const TIMEOUT_MS = 5000;

type CmsThumbnail = { url?: string | null; alt?: string | null } | null;

type CmsCategory = { name?: string | null; slug?: string | null } | null;

/** card の本文。管理画面で追加した項目が { label, value } で並ぶ */
type CmsCardField = { label?: string | null; value?: string | null };

/** card だけが持つ追加情報 */
type CmsMetadata = {
  buttonText?: string | null;
  images?: { url?: string | null; alt?: string | null }[] | null;
  links?: { label?: string | null; url?: string | null }[] | null;
} | null;

/** API から返ってくる 1 件分。未確認の項目があるため index signature を持たせている */
type CmsContent = {
  id: string;
  type: string;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  /** article は HTML 文字列、card は項目の配列 */
  content?: string | CmsCardField[] | null;
  thumbnail?: CmsThumbnail;
  metadata?: CmsMetadata;
  category?: CmsCategory;
  categories?: CmsCategory[] | null;
  displayOrder?: number | null;
  publishedAt?: string | null;
  url?: string | null;
  externalLink?: string | null;
  [key: string]: unknown;
};

/** サイト側で使う記事の形 */
export type Article = {
  id: string;
  /** 記事ページの URL に使う。slug が無い・重複する場合は id を使う */
  key: string;
  title: string;
  /** 表示用の日付（2026.04.01） */
  date: string;
  /** 並べ替え用の ISO 日付 */
  publishedAt: string | null;
  category: string;
  excerpt: string;
  thumbnail?: string;
  /** 本文 HTML（formatContent で表示用に整えたもの） */
  content: string;
  /** 外部サイトの記事を登録している場合のリンク先 */
  externalLink?: string;
};

function str(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== ""
    ? value.trim()
    : undefined;
}

/** 公開日。未設定・不正な値のときは undefined */
function publishedDate(item: CmsContent): Date | undefined {
  const value = str(item.publishedAt);
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

/** HTML タグを落として一覧用の短い文章にする */
export function toPlainText(html: string, max = 90): string {
  const text = html
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

/** 2026.04.01 の形にする */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}.${m}.${d}`;
}

/** 本文に埋め込んでよい iframe の配信元（動画・地図） */
const ALLOWED_IFRAME_SRC =
  /^https:\/\/(www\.youtube\.com|www\.youtube-nocookie\.com|player\.vimeo\.com|www\.google\.com\/maps)[/?]/;

/**
 * CMS の本文 HTML から、スクリプトとして動きうる記述を取り除く。
 * 本文はそのまま dangerouslySetInnerHTML で出すため、管理画面に不正な HTML が
 * 入っても閲覧者側で実行されないようにしておく。見出し・段落・リンク・画像などはそのまま残す。
 */
export function sanitizeHtml(html: string): string {
  return (
    html
      // 中身ごと消すタグ
      .replace(/<(script|style|noscript|template)\b[\s\S]*?<\/\1\s*>/gi, "")
      // 許可していない配信元の iframe
      .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe\s*>/gi, (tag) => {
        const src = tag.match(/\ssrc\s*=\s*["']([^"']*)["']/i)?.[1] ?? "";
        return ALLOWED_IFRAME_SRC.test(src) ? tag : "";
      })
      // タグだけ消すもの（閉じ忘れ・単独タグも含む）
      .replace(
        /<\/?(script|style|noscript|template|object|embed|applet|base|link|meta|form|input|button|textarea|select)\b[^>]*>/gi,
        "",
      )
      // onclick などのイベント属性
      .replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
      // javascript: / vbscript: / data:text/html の URL
      .replace(
        /\s(href|src|xlink:href|action|formaction)\s*=\s*(["']?)\s*(javascript|vbscript|data:text\/html)[^"'\s>]*\2/gi,
        "",
      )
      // 別タブで開くリンクには rel="noopener noreferrer" を付ける
      .replace(/<a\b(?![^>]*\srel\s*=)([^>]*\starget\s*=\s*["']?_blank[^>]*)>/gi, '<a$1 rel="noopener noreferrer">')
  );
}

/**
 * CMS のリッチエディタが出す本文 HTML を表示用に整える。
 * エディタは1行ごとに <p> で囲むため、そのままだと行ごとに段落の余白が入り、
 * 空行として入れた <p></p> は逆に高さが無くなってしまう。
 *
 * 空段落の置換を先に行うこと（逆にすると空段落が <br /> に巻き込まれて検出できない）。
 */
export function formatContent(content: string): string {
  let formatted = sanitizeHtml(content);
  // 空の段落は意図的な空行なので、高さ固定のスペーサーにする
  formatted = formatted.replace(/<p>\s*<\/p>/g, '<div class="h-6"></div>');
  // 段落の区切りはただの改行にして、段落の余白を入れない
  formatted = formatted.replace(/<\/p>\s*<p>/g, "<br />");
  return formatted;
}

async function fetchContents(types: string): Promise<CmsContent[]> {
  try {
    const res = await fetch(`${CMS_ENDPOINT}?types=${types}`, {
      // キャッシュしない。管理画面で公開・下書きに戻す・編集した内容が、次に開いたときすぐ反映される
      // （キャッシュすると、期限切れ後も最初の1回は古い内容が出るため、下書きに戻した記事が残って見えた）
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) return [];
    const json: unknown = await res.json();
    const data = (json as { data?: unknown })?.data;
    return Array.isArray(data) ? (data as CmsContent[]) : [];
  } catch {
    // CMS が落ちている・遅いときでもページ自体は表示できるようにする
    return [];
  }
}

function toArticle(item: CmsContent, usedKeys: Set<string>): Article {
  const slug = str(item.slug);
  // slug は重複することがあるため、既に使われていれば id を使う
  const key = slug && !usedKeys.has(slug) ? slug : item.id;
  usedKeys.add(key);

  const content = str(item.content) ?? "";
  const rawExcerpt = str(item.excerpt) ?? "";
  const category =
    str(item.category?.name) ??
    str(item.categories?.[0]?.name) ??
    "お知らせ";

  return {
    id: item.id,
    key,
    title: str(item.title) ?? "（無題）",
    date: formatDate(item.publishedAt),
    publishedAt: str(item.publishedAt) ?? null,
    category,
    // 要約は script などを除いてから作る（中身の文字がそのまま説明文に残らないように）
    excerpt: toPlainText(rawExcerpt || sanitizeHtml(content)),
    thumbnail: str(item.thumbnail?.url),
    content: formatContent(content),
    externalLink: str(item.externalLink),
  };
}

/** 公開済みの記事を新しい順で返す */
export async function getArticles(): Promise<Article[]> {
  const contents = await fetchContents("article");
  const now = Date.now();
  const usedKeys = new Set<string>();

  return contents
    .filter((item) => item.type === "article")
    .filter((item) => {
      // 公開日が未来のものは出さない（未設定は公開扱い）
      const published = publishedDate(item);
      return !published || published.getTime() <= now;
    })
    .sort((a, b) => {
      const at = new Date(a.publishedAt ?? 0).getTime();
      const bt = new Date(b.publishedAt ?? 0).getTime();
      if (bt !== at) return bt - at;
      return (a.displayOrder ?? 0) - (b.displayOrder ?? 0);
    })
    .map((item) => toArticle(item, usedKeys));
}

/** key（slug または id）で 1 件取り出す */
export async function getArticle(key: string): Promise<Article | undefined> {
  const articles = await getArticles();
  return articles.find(
    (article) => article.key === key || article.id === key,
  );
}

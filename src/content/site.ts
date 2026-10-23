export const site = {
  name: "まなサポ",
  /**
   * 公開先の URL。OGP の画像の絶対 URL・canonical・sitemap・robots・フォーム送信後の戻り先に使う。
   * 独自ドメインに移ったらここだけ直す
   */
  url: "https://manasapo.vercel.app",
  logoAlt: "まなサポ PRIVATE CLASS",
  /**
   * ロゴ横（ヘッダー・フッター）とページタイトルに出すキャッチ。
   * ロゴ横では後ろに `name` を続けて「学び抜く力をつける個別指導塾 まなサポ」と表示する
   * （2026-10 の修正指示）。タイトルは「まなサポ｜〜」になるので name を重ねない。
   */
  tagline: "学び抜く力をつける個別指導塾",
  catchphrase: "「教わる」から、「自分で学べる」へ。",
  description:
    "北海道岩見沢市の学習塾まなサポ。最大1対2の個別指導で基本を固め、一人ひとりに合った「学び方」を一緒につくります。小学生・中学生・高校生対象。無料体験受付中。",
} as const;

/**
 * ヘッダーのメニュー。`/` から始めているのは、トップ以外のページ（/inquiry-learning など）
 * からもトップの各セクションへ飛べるようにするため。トップ上では同じページ内のスクロールになる。
 */
export const nav = [
  { label: "コース紹介", href: "/#courses" },
  { label: "特徴", href: "/#features" },
  { label: "まなサポの人たち", href: "/#people" },
  { label: "生徒の変化", href: "/#changes" },
  // 講習会だけは別ページ（2026-10-15 の修正指示）
  { label: "講習会", href: "/seasonal-course" },
  { label: "アクセス", href: "/#access" },
] as const;

export const access = {
  mapUrl: "https://maps.app.goo.gl/Q7Axkqc6sxdB1ezG7",
  address: "北海道岩見沢市南町８条２丁目２−１２ 2 階C号室",
  businessDays: "毎週月〜土曜日（日・祝休み）",
  hours: [
    "月〜金：15:00~22:00（最終入室21:00）",
    "土曜日：17:30~20:30",
  ],
  tel: { label: "080-6134-7257(セノオ)", href: "tel:08061347257" },
  email: {
    label: "info@iwa-manasapo.com",
    href: "mailto:info@iwa-manasapo.com",
  },
  /**
   * お問い合わせフォームの送信先（FormSubmit の AJAX 窓口。上の email 宛てに届く）。
   * ★ 最初の1通を送ると、FormSubmit から info@iwa-manasapo.com に「Activate Form」のメールが届く。
   *   そのボタンを押すまでは、フォームから送っても届かない（画面には送信エラーと表示される）。
   */
  formEndpoint: "https://formsubmit.co/ajax/info@iwa-manasapo.com",
  /** JavaScript が動かない環境向けの通常送信の窓口。送信後は _next の /thanks へ戻す */
  formAction: "https://formsubmit.co/info@iwa-manasapo.com",
} as const;

export const socialLinks = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/manasapo_iwamizawa/",
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/channel/UCgFuVxiVQH6fojbE5bsf_Bw/about",
  },
  {
    name: "音声配信",
    href: "https://stand.fm/channels/6821e1584d20b5ed88828c33",
  },
] as const;

/** フォームの学年選択肢。原稿の対象（小1〜高3）から増やさないこと。 */
export const gradeOptions = [
  "小学1年生",
  "小学2年生",
  "小学3年生",
  "小学4年生",
  "小学5年生",
  "小学6年生",
  "中学1年生",
  "中学2年生",
  "中学3年生",
  "高校1年生",
  "高校2年生",
  "高校3年生",
] as const;

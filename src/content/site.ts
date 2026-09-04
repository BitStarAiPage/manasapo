export const site = {
  name: "まなサポ",
  logoAlt: "まなサポ PRIVATE CLASS",
  tagline: "小学生・中学生・高校生の学習塾",
  catchphrase: "「教わる」から、「自分で学べる」へ。",
  description:
    "北海道岩見沢市の学習塾まなサポ。最大1対2の個別指導で基本を固め、一人ひとりに合った「学び方」を一緒につくります。小学生・中学生・高校生対象。無料体験受付中。",
} as const;

export const nav = [
  { label: "まなサポについて", href: "#philosophy" },
  { label: "コース紹介", href: "#courses" },
  { label: "まなサポの人たち", href: "#people" },
  { label: "アクセス", href: "#access" },
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
    label: "manasapo.iwamizawa@gmail.com",
    href: "mailto:manasapo.iwamizawa@gmail.com",
  },
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
    href: "https://stand.fm/channels/6821e1584d20b5ed88828c33?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAacMF3W7pTCFGW-WkamU6-YIJyWU75VeW-zg-rvxY9H3fRn_yHfgqfrNQEGwrQ_aem_4toBjjCGJGE2-wVgVp8SFg",
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

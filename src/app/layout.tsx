import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { RevealOnScroll } from "@/components/ui/reveal-on-scroll";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { site } from "@/content/site";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name}｜${site.tagline}`,
    template: `%s｜${site.name}`,
  },
  description: site.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      data-scroll-behavior="smooth"
      className={`${notoSansJP.variable} h-full antialiased`}
    >
      <head>
        {/* JS が動かない環境では、登場アニメーション待ちのイラストが隠れたままになる。
            その場合だけ初期状態を打ち消して、最初から見えるようにしておく */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: "[data-reveal]{opacity:1!important;transform:none!important}",
            }}
          />
        </noscript>
      </head>
      <body className="flex min-h-full flex-col">
        <CutoutOutlineFilter />
        {/* data-reveal が付いたイラストを、画面に入った順に表示していく */}
        <RevealOnScroll />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

/**
 * 切り抜き写真の黄色い縁取りを描く SVG フィルタ。`cutout-outline` から参照する。
 * アルファをぼかしてから急峻な階調変換で切り直すと、角の立たない輪郭が取れる。
 * - stdDeviation … 縁の太さ（大きいほど太い。実測でおよそ 1.3 倍が px 幅）
 * - feFuncA の slope / intercept … しきい値。slope を上げるほど縁がくっきりする
 */
function CutoutOutlineFilter() {
  return (
    <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0 overflow-hidden">
      <filter
        id="cutout-outline"
        x="-15%"
        y="-15%"
        width="130%"
        height="130%"
        colorInterpolationFilters="sRGB"
      >
        <feGaussianBlur in="SourceAlpha" stdDeviation="3.4" result="blurred" />
        <feComponentTransfer in="blurred" result="thickened">
          <feFuncA type="linear" slope="30" intercept="-3" />
        </feComponentTransfer>
        {/* 縁の色。globals.css のブランドカラーを参照する（属性ではなく style でないと var() が効かない） */}
        <feFlood style={{ floodColor: "var(--color-orange)" }} result="outlineColor" />
        <feComposite in="outlineColor" in2="thickened" operator="in" result="outline" />
        <feMerge>
          <feMergeNode in="outline" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </svg>
  );
}

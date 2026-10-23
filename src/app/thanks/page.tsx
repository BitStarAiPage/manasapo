import type { Metadata } from "next";
import { access } from "@/content/site";
import { LinkButton } from "@/components/ui/button";
import { Wrap } from "@/components/ui/wrap";

export const metadata: Metadata = {
  title: "お問い合わせありがとうございます",
  robots: { index: false, follow: false },
};

/**
 * お問い合わせフォームの送信後に移るページ（FormSubmit の初期サンクスページの代わり）。
 * フォームから送れたときだけ来るページなので、検索には出さず sitemap にも入れない。
 */
export default function ThanksPage() {
  return (
    <section className="bg-sun py-10 lg:py-16">
      <Wrap>
        <div className="mx-auto max-w-[46rem] rounded-xl bg-white px-6 py-10 text-center sm:px-10 lg:py-14">
          <p className="text-lg font-black">送信完了</p>
          <h1 className="mt-3 text-[1.625rem] leading-[1.4] tracking-[0.02em] sm:text-4xl">
            お問い合わせありがとうございます
          </h1>
          <div className="mt-6 space-y-2 text-base leading-[1.95]">
            <p>内容を確認のうえ、担当よりご連絡いたします。</p>
            <p>お急ぎの場合は、お電話でもお気軽にお問い合わせください。</p>
          </div>
          <a
            href={access.tel.href}
            className="mt-6 inline-block text-xl font-black underline underline-offset-4"
          >
            {access.tel.label}
          </a>
          <div className="mt-8 flex justify-center">
            <LinkButton href="/">トップへ戻る</LinkButton>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/button";
import { Wrap } from "@/components/ui/wrap";

export const metadata: Metadata = {
  title: "探究学習事業",
};

/**
 * 探究学習事業のページ。トップの「探究学習事業」カードから移ってくる。
 * 内容は未支給で、今後厚くなる予定とのこと（2026-10 の修正指示）。
 * それまでは「準備中」だけを出す。事業名と「準備中」以外の文言は補わない。
 */
export default function InquiryLearningPage() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <Wrap>
        <div className="flex flex-col items-center gap-8 rounded-xl border-2 border-mint-deep bg-mint px-6 py-16 text-center lg:py-24">
          <h1 className="text-[1.75rem] leading-[1.25] tracking-[0.03em] sm:text-4xl lg:text-5xl">
            探究学習事業
          </h1>
          <p className="text-lg font-black tracking-[0.35em] text-ink-soft sm:text-xl">
            準備中
          </p>
        </div>
        <div className="mt-10 flex justify-center">
          <LinkButton href="/" variant="ghost">
            トップへ戻る
          </LinkButton>
        </div>
      </Wrap>
    </section>
  );
}

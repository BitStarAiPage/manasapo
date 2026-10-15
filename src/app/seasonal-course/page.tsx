import type { Metadata } from "next";
import { LinkButton } from "@/components/ui/button";
import { Wrap } from "@/components/ui/wrap";

export const metadata: Metadata = {
  title: "夏・冬の講習会",
  description:
    "まなサポの夏・冬の講習会。科目数・授業数に制限なく、一人ひとりの目標や学習状況に合わせた超オーダーメイドのカリキュラムで受講できます。",
};

/**
 * 夏・冬の講習会のページ。ヘッダーの「講習会」から移ってくる。
 * 文言は 2026-10-15 の修正指示（2稿）の原文のまま。写真は未支給なので置いていない。
 */
const points = [
  {
    number: "01",
    title: "お手頃価格で、たくさん学べる",
    body: [
      "夏・冬のまとまった休みは、苦手を克服したり、得意を伸ばしたりするチャンスです。",
      "まなサポの講習会では、受講しやすい価格で、必要な授業をしっかり受けることができます。",
    ],
  },
  {
    number: "02",
    title: "科目数・授業数に制限なし",
    body: [
      "「苦手な数学は特に集中して受けたい」\n「英語と数学中心にしつつも、暗記できない日本史も対策したい」など、受講の仕方は自由です。",
      "一律のコースではなく、必要な科目・必要な授業数を組み合わせて受講できます。",
    ],
  },
  {
    number: "03",
    title: "一人ひとりに合わせた超オーダーメイドカリキュラム",
    body: [
      "事前の面談などで、現在の学習状況や目標、困っていることを確認し、一人ひとりに合った講習内容を組み立てます。",
    ],
    examples: [
      "「この科目・この単元を強化したい」",
      "「夏休み・冬休みに、勉強する習慣をつけたい」",
      "「通常授業の科目数を増やす前に試してみたい」",
    ],
    after: [
      "など、受講の目的は人それぞれです。",
      "何を、どれくらい、どのように学ぶかを一緒に考えながら、その子に合ったカリキュラムを作成します。",
    ],
  },
];

export default function SeasonalCoursePage() {
  return (
    <>
      {/* 導入。トップの FV と同じ黄色の面にして、サイトの続きだと分かるようにする */}
      <section className="bg-sun py-12 lg:py-20">
        <Wrap>
          <p className="text-lg font-black">夏・冬の講習会</p>
          <h1 className="mt-3 text-[2.25rem] leading-[1.3] tracking-[0.02em] sm:text-5xl lg:text-6xl">
            必要な科目を、
            <br className="sm:hidden" />
            必要なだけ。
          </h1>
          <p className="mt-5 text-lg font-black sm:text-xl lg:text-2xl">
            一人ひとりに合わせた超オーダーメイド講習
          </p>
          <div className="mt-8 max-w-[40rem] space-y-1 text-base leading-[1.95] sm:text-lg">
            <p>まなサポでは、毎年夏休み・冬休みに講習会を実施しています。</p>
            <p>科目数や授業数に制限はありません。</p>
            <p>一人ひとりの目標や学習状況に合わせて、あなただけのカリキュラムを作成します。</p>
          </div>
        </Wrap>
      </section>

      {/* 3つの特徴。白地にして、黄色の導入・締めと交互に並べている。
          番号は白地だと黄色の文字が沈むので、黒の数字に黄色のマーカーを引いている */}
      <section className="bg-white py-12 lg:py-20">
        <Wrap>
          <h2 className="text-[1.75rem] leading-[1.3] tracking-[0.03em] sm:text-4xl lg:text-5xl">
            まなサポの講習会
            <br className="sm:hidden" />
            <span className="sm:ml-4">3つの特徴</span>
          </h2>

          {/* 3列だと 03 だけ本文が長く飛び出して見えるので、PC は2列にして
              左に 01・02 を縦に積み、右の 03 を2段ぶんの高さに通している */}
          <ol className="mt-10 grid gap-12 lg:mt-14 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-12">
            {points.map((point, index) => (
              <li
                key={point.number}
                className={`border-t-2 border-ink/15 pt-6 ${
                  index === 2 ? "lg:col-start-2 lg:row-span-2 lg:row-start-1" : ""
                }`}
              >
                <p aria-hidden="true" className="inline-block bg-[linear-gradient(transparent_55%,var(--color-sun)_55%)] px-1 text-5xl leading-none font-black lg:text-6xl">
                  {point.number}
                </p>
                <h3 className="mt-4 text-xl leading-[1.5] sm:text-[1.375rem]">{point.title}</h3>
                <div className="mt-4 space-y-3 text-base leading-[1.95]">
                  {point.body.map((text) => (
                    <p key={text} className="whitespace-pre-line">
                      {text}
                    </p>
                  ))}
                  {point.examples && (
                    <>
                      <p>たとえば、</p>
                      <ul className="space-y-2 rounded-xl bg-ivory px-4 py-4 text-[0.875rem] font-bold ring-2 ring-sun sm:px-5 sm:text-base">
                        {point.examples.map((text) => (
                          <li key={text}>{text}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {point.after?.map((text) => (
                    <p key={text}>{text}</p>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </Wrap>
      </section>

      {/* 締めのお問い合わせ。ページのゴールなので、文字もボタンも本文より一段大きくしている */}
      <section className="bg-sun py-16 lg:py-24">
        <Wrap className="flex flex-col items-center gap-8 text-center lg:gap-10">
          <p className="text-[1.375rem] leading-[1.5] font-black sm:text-3xl lg:text-4xl">
            講習会についての
            <br className="sm:hidden" />
            ご相談・お申し込みは
          </p>
          <LinkButton href="/#contact" size="lg" className="w-full max-w-[24rem] sm:w-auto sm:max-w-none">
            お問い合わせはこちら
          </LinkButton>
        </Wrap>
      </section>
    </>
  );
}

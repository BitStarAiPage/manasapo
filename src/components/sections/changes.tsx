import { media } from "@/content/media";
import { Photo } from "@/components/ui/photo";
import { Wrap } from "@/components/ui/wrap";

const intro =
  "まなサポの成長は、ある日突然テストが50点上がる、というものではありません。わからないままにしなくなった、自分で考えるようになった、自分に合う勉強方法を見つけたなど、小さな変化がじわじわ積み重なって、本当の学力になっています。じわじわ、でも確実に本質的に伸びていく。それが、まなサポの生徒たちに見られる変化の特徴です。";

const caseParagraphs = [
  "定期テストで何を勉強していいかわからなかった生徒が、定期テスト前になると毎回自分なりの儀式のような勉強法をするように。",
  "大きなホワイトボードいっぱいに、テスト範囲の内容を自分でまとめて整理します。",
  "これは板書でも、教科書の書き写しでもありません。自分で仕組みを理解し、頭の中を整理しながら、もう一度自分の言葉でまとめ直しているのです。",
  "この方法を続けてもう4年。今ではすっかり、その生徒自身の「学びの勝ちパターン」になっています。まなサポでは、いつしかこの勉強法を「呪い」と呼ぶようになりました。",
];

export function Changes() {
  return (
    <section id="changes" className="scroll-mt-24 bg-ivory py-12 lg:py-16">
      <Wrap>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-[2.5rem] sm:text-5xl lg:text-6xl leading-[1.25] tracking-[0.03em]">生徒の変化</h2>
            <p className="mt-6 max-w-[38rem] text-base leading-[1.95] sm:text-lg">{intro}</p>

            <h3 className="mt-10 text-lg sm:text-xl">
              CASE 01　4年間続く、テスト前の「呪い」勉強法
            </h3>
            <div className="mt-4 max-w-[38rem] space-y-4">
              {caseParagraphs.map((text) => (
                <p key={text} className="text-base leading-[1.95]">
                  {text}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:pt-10">
            <Photo
              media={media.case01}
              sizes="(max-width: 1024px) 90vw, 44vw"
              className="rounded-xl"
            />
          </div>
        </div>
      </Wrap>
    </section>
  );
}

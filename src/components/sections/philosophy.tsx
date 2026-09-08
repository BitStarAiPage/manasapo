import { media } from "@/content/media";
import { Photo } from "@/components/ui/photo";
import { Wrap } from "@/components/ui/wrap";

const paragraphs = [
  "先生に教えてもらえば、その問題は解けるかもしれません。\nでも、それだけでテストで点が取れるでしょうか...？",
  "まなサポが目指すのは、「自分で学べる力」。隣に先生がいなくても、自分で課題に向き合い、自分なりに考え続けることができる力です。",
  "その力は勉強だけでなく、将来出会う新しい課題や未知のことにも、自分で考え、挑戦していける一生ものの武器となります。",
  "まずは「教わる」も大事...！でも最終的には「自分で学べる」へ。\nそんなお子さまの成長に、とことん付き合います。",
];

export function Philosophy() {
  return (
    <section id="philosophy" className="scroll-mt-24 bg-ivory py-12 lg:py-16">
      <Wrap>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
          <div>
            {/* PC は2行、1023px 以下は1行。
                PC で1行にすると左カラム（1024px で 484px）に 683px 必要で入らない。
                1023px 以下は逆に全幅を使えるので1行に収まる。
                スマホの `8.1vw` は、1行に必要な 429px を 375px 幅（使えるのは 335px）に
                収めるための伸縮。320px でも収まる上限で、494px 以上は 2.5rem で頭打ち。
                ★ 文字を増やすと必要な幅が変わるので、その時は vw も測り直すこと。 */}
            <h2 className="text-[clamp(1.5rem,8.1vw,2.5rem)] leading-[1.25] tracking-[0.03em] sm:text-5xl lg:text-6xl xl:text-[4.5rem]">
              <span className="lg:block">一生ものの</span>
              <span className="lg:block">「学び方」を。</span>
            </h2>

            <div className="mt-8 max-w-[38rem] space-y-6">
              {paragraphs.map((text) => (
                <p key={text} className="text-base leading-[1.95] whitespace-pre-line sm:text-lg">
                  {text}
                </p>
              ))}
            </div>
          </div>

          <div className="lg:pt-6">
            <Photo
              media={media.philosophy}
              sizes="(max-width: 1024px) 90vw, 44vw"
              className="rounded-xl"
            />
          </div>
        </div>
      </Wrap>
    </section>
  );
}

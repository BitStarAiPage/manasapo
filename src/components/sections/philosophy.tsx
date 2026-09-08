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
    <section id="philosophy" className="scroll-mt-24 bg-ivory py-16 lg:py-24">
      <Wrap>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.9fr] lg:gap-14">
          <div>
            <h2 className="text-[2.5rem] sm:text-5xl lg:text-6xl xl:text-[4.5rem]">
              一生ものの
              <br />
              「学び方」を。
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

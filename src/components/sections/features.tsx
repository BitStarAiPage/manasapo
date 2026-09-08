import { features } from "@/content/features";
import { featureMedia } from "@/content/media";
import { Photo } from "@/components/ui/photo";
import { Wrap } from "@/components/ui/wrap";

export function Features() {
  return (
    <section id="features" className="on-ink scroll-mt-24 bg-ink py-10 text-white lg:py-16">
      <Wrap>
        <h2 className="text-[2rem] sm:text-4xl lg:text-5xl leading-[1.25] tracking-[0.03em]">まなサポの特徴</h2>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-16">
          {features.map((feature, index) => (
            <div
              key={feature.number}
              className="grid gap-6 sm:grid-cols-[1.15fr_0.85fr] sm:items-start"
            >
              <div>
                {/* 番号は leading-none なので箱が数字にぴったり付く。見出しは2行あって
                    背が高いため、上揃えにすると番号だけ上に寄って見える（実測でスマホ 6px）。
                    中央揃えにして、見出しが1行でも2行でも中心がそろうようにしている */}
                <div className="flex items-center gap-4">
                  <p
                    aria-hidden="true"
                    className="text-5xl leading-none font-black text-sun lg:text-6xl"
                  >
                    {feature.number}
                  </p>
                  <h3 className="text-xl whitespace-pre-line sm:text-[1.375rem]">
                    {feature.title}
                  </h3>
                </div>
                <p className="mt-4 text-base leading-[1.95] text-white/85">{feature.body}</p>
              </div>

              <Photo
                media={featureMedia[index]}
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 24vw"
                className="rounded-xl"
              />
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

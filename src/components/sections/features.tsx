import { features } from "@/content/features";
import { featureMedia } from "@/content/media";
import { MarkedText } from "@/components/ui/doodles";
import { Photo } from "@/components/ui/photo";
import { Wrap } from "@/components/ui/wrap";

export function Features() {
  return (
    <section id="features" className="on-ink scroll-mt-24 bg-ink py-16 text-white lg:py-24">
      <Wrap>
        <h2 className="text-[2rem] sm:text-4xl lg:text-5xl">
          {/* 白抜き文字なので、重なる部分が潰れないよう帯は浅めにかける */}
          <MarkedText className="text-sun" drop="0.04em" height="0.34em">
            <span className="text-white">まなサポの特徴</span>
          </MarkedText>
        </h2>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-x-14 lg:gap-y-16">
          {features.map((feature, index) => (
            <div
              key={feature.number}
              className="grid gap-6 sm:grid-cols-[1.15fr_0.85fr] sm:items-start"
            >
              <div>
                <div className="flex items-start gap-4">
                  <p
                    aria-hidden="true"
                    className="text-5xl leading-none font-black text-sun lg:text-6xl"
                  >
                    {feature.number}
                  </p>
                  <h3 className="pt-1 text-xl whitespace-pre-line sm:text-[1.375rem]">
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

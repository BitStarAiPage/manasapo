import { heroAltCutouts, heroAltPhotos } from "@/content/media";
import { LinkButton } from "@/components/ui/button";
import { CutoutPhoto } from "@/components/ui/cutout-photo";
import { Photo } from "@/components/ui/photo";
import { Wrap } from "@/components/ui/wrap";

/**
 * 別案の FV（/alt）。中央にコピーを置き、その周り（上中央・左下・右下）に
 * 写真を散らす。各写真の角から切り抜きが1つずつ飛び出して、面の外に人が立つ。
 *
 * 現行案（hero.tsx）との違いは FV だけで、以降のセクションは共通です。
 *
 * 切り抜きは `bottom` で位置を決めている（`top` ではない）。
 * 素材ごとに縦横比が違っても「写真のこの高さに立つ」が揃うため。
 */
type Corner = "left" | "right";

const CUTOUT_POSITION: Record<Corner, string> = {
  left: "bottom-[80%] left-[-12%] w-[40%]",
  right: "bottom-[76%] right-[-12%] w-[40%]",
};

/** 写真1枚＋その角に立つ切り抜き1つ。FV の最小単位。 */
function PhotoWithCutout({
  index,
  corner,
  preload = false,
  sizes,
}: {
  index: number;
  corner: Corner;
  preload?: boolean;
  sizes: string;
}) {
  return (
    <div className="relative">
      <Photo media={heroAltPhotos[index]} preload={preload} sizes={sizes} />

      <CutoutPhoto
        media={heroAltCutouts[index]}
        showPlaceholder
        sizes={sizes}
        className={`absolute z-10 ${CUTOUT_POSITION[corner]}`}
      />
    </div>
  );
}

export function HeroAlt() {
  return (
    <section id="hero" className="relative overflow-hidden bg-sun pb-12 lg:pb-16">
      <Wrap>
        {/* 上段：中央より少し左に1枚。切り抜きは右肩から飛び出す */}
        <div className="mx-auto mt-10 w-[72%] sm:w-[54%] lg:mt-14 lg:w-[36%] lg:-translate-x-[4%]">
          <PhotoWithCutout
            index={0}
            corner="right"
            preload
            sizes="(max-width: 640px) 72vw, (max-width: 1024px) 54vw, 36vw"
          />
        </div>

        {/* 中央：コピー。写真より前に出す */}
        <div className="relative z-20 mx-auto mt-8 max-w-3xl text-center lg:mt-10">
          <h1 className="text-[2.25rem] leading-[1.2] tracking-tight sm:text-5xl lg:text-[4.25rem]">
            <span className="block">「教わる」から、</span>
            <span className="block">「自分で学べる」へ。</span>
          </h1>

          <p className="mx-auto mt-5 max-w-[32rem] text-sm leading-[1.9] font-medium sm:text-base lg:mt-6">
            自分なりの学び方が身につけば、できることも、見える世界も広がっていく。
            自分の力で次の一歩を踏み出せるよう、とことん付き合います。
          </p>

          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <LinkButton href="#contact">無料体験に申し込む</LinkButton>
            <LinkButton href="#contact" variant="outline">
              お問い合わせ
            </LinkButton>
          </div>
        </div>

        {/* 下段：左右の端に1枚ずつ。切り抜きは外側の肩から飛び出す */}
        <div className="mt-10 flex items-start justify-between gap-4 lg:mt-12 lg:px-[3%]">
          <div className="w-[47%] lg:w-[36%]">
            <PhotoWithCutout
              index={1}
              corner="left"
              sizes="(max-width: 640px) 47vw, (max-width: 1024px) 47vw, 36vw"
            />
          </div>

          <div className="w-[47%] lg:w-[36%]">
            <PhotoWithCutout
              index={2}
              corner="right"
              sizes="(max-width: 640px) 47vw, (max-width: 1024px) 47vw, 36vw"
            />
          </div>
        </div>
      </Wrap>
    </section>
  );
}

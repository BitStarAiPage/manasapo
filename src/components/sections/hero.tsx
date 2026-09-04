import { heroBadgeMedia, media } from "@/content/media";
import { LinkButton } from "@/components/ui/button";
import { CutoutPhoto } from "@/components/ui/cutout-photo";
import { Photo } from "@/components/ui/photo";
import { Wrap } from "@/components/ui/wrap";

/**
 * FV の黄色い余白に散らす生徒のダイカット。
 * 円は敷かず、授業カットと同じく人物の輪郭に沿って縁取る（CutoutPhoto）。
 * 位置は 1440px 時の実測から決めている（見出し1行目 x≤486 / 2行目 x≤623 /
 * リード文 x≤408・y295-432 / ボタン y460-520 / 写真パネル x≥684 /
 * 授業カット x456-798・y≥384）。この隙間に収まる3か所。
 */
const heroBadges = [
  // 見出し1行目の右、写真パネルの手前
  { media: heroBadgeMedia[0], size: "w-[9%]", position: "left-[40.3%] top-[10%]" },
  // リード文と写真パネルの間
  { media: heroBadgeMedia[1], size: "w-[9%]", position: "left-[34.7%] top-[48.5%]" },
  // ボタンの下
  { media: heroBadgeMedia[2], size: "w-[7.6%]", position: "left-[9.4%] top-[89.8%]" },
];

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-sun lg:min-h-[40rem]">
      {/* PC：右端まで抜ける写真パネル。
          幅はキャッチコピーの右端が写真に触れない位置から逆算している。
          広げると見出しが写真に乗るので、下の h1 のサイズとセットで調整すること。 */}
      <div className="absolute inset-y-0 right-0 hidden w-[52%] lg:block">
        <Photo
          media={media.heroMain}
          stretch
          preload
          sizes="52vw"
          className="h-full [border-radius:11rem_0_0_0]!"
        />
      </div>

      {/* PC：前面の切り抜き。パネルの外に出し、ボタンの真横に立たせる。
          left は「Wrap の左端 + 28.5rem」。Wrap は 1440px で頭打ちになって中央寄せに
          変わるため、単純な % だと広い画面でボタンに重なる。calc で中央寄せ分を足している。
          ボタンを隠さないよう pointer-events-none を付けている（装飾なのでクリック不要）。 */}
      <CutoutPhoto
        media={media.heroCutout}
        eager
        sizes="30vw"
        className="pointer-events-none absolute bottom-0 left-[calc(max(0px,(100vw-90rem)/2)+28.5rem)] z-20 hidden w-[24%] lg:block"
      />
      {media.heroCutoutRight.src && (
        <CutoutPhoto
          media={media.heroCutoutRight}
          sizes="18vw"
          className="pointer-events-none absolute right-[-4%] bottom-0 z-20 hidden w-[18%] lg:block"
        />
      )}

      {/* PC：黄色い余白に置く生徒のダイカット。人物の形のまま縁取りが付く。
          position は人物の「中心」を置きたい場所（-translate-1/2 で中心合わせ）。 */}
      {heroBadges.map((badge) => (
        <CutoutPhoto
          key={badge.media.src}
          media={badge.media}
          sizes="10vw"
          className={`pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-1/2 lg:block ${badge.size} ${badge.position}`}
        />
      ))}

      <Wrap className="relative z-30 pt-10 pb-14 lg:pt-16 lg:pb-24">
        <h1 className="text-[2.75rem] leading-[1.3] tracking-tight sm:text-6xl lg:text-[clamp(3rem,4.9vw,4.5rem)]">
          <span className="block">「教わる」から、</span>
          <span className="block">「自分で学べる」へ。</span>
        </h1>

        {/* SP：見出しのすぐ後に写真を見せる */}
        <div className="mt-8 grid grid-cols-5 items-end gap-3 lg:hidden">
          <Photo
            media={media.heroMain}
            preload
            sizes="(max-width: 640px) 62vw, 60vw"
            className="col-span-3 rounded-xl"
          />
          <Photo
            media={media.heroWhiteboard}
            sizes="(max-width: 640px) 38vw, 36vw"
            className="col-span-2 rounded-xl"
          />
        </div>

        <div className="relative mt-8 lg:mt-12 lg:max-w-[24rem]">
          <p className="text-base leading-[1.9] font-medium sm:text-lg lg:max-w-[22rem]">
            自分なりの学び方が身につけば、できることも、見える世界も広がっていく。
            自分の力で次の一歩を踏み出せるよう、とことん付き合います。
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <LinkButton href="#contact">無料体験に申し込む</LinkButton>
            <LinkButton href="#contact" variant="outline">
              お問い合わせ
            </LinkButton>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

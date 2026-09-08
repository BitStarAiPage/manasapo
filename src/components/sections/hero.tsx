import {
  heroCutoutLayout,
  heroCutoutStyle,
  type HeroCutoutId,
  type HeroCutoutLayout,
} from "@/content/hero-layout";
import { heroBadgeMedia, heroPanelPhotos, media, type Media } from "@/content/media";
import { LinkButton } from "@/components/ui/button";
import { CutoutPhoto } from "@/components/ui/cutout-photo";
import { Photo } from "@/components/ui/photo";
import { PhotoCrossfade } from "@/components/ui/photo-crossfade";
import { Wrap } from "@/components/ui/wrap";

/**
 * FV に重ねるダイカット3枚。円は敷かず、人物の輪郭に沿って縁取る（CutoutPhoto）。
 * 素材と重なり順はここ、位置とサイズは `src/content/hero-layout.ts`。
 *
 * 位置は 1440px 時の実測から決めている（見出し1行目 x≤486 / 2行目 x≤623 /
 * リード文 x≤408・y295-432 / ボタン y460-520 / 写真パネル x≥684）。
 * `label` は `/fv-editor` の操作パネルに出る名前。
 */
export const heroCutouts: Record<
  HeroCutoutId,
  {
    media: Media;
    label: string;
    sizes: string;
    layer: string;
    /** 出す画面幅。ダイカットは PC だけなので `lg` 以上に限っている */
    visibility: string;
    eager?: boolean;
  }
> = {
  "girl-front": {
    media: media.heroCutoutRight,
    label: "女の子",
    sizes: "16vw",
    // 写真パネル（z-10）の後ろ。断ち切られた右辺がパネルに完全に隠れる
    layer: "z-0",
    visibility: "hidden lg:block",
    eager: true,
  },
  "boy-book": {
    media: heroBadgeMedia[1],
    label: "男の子（受験本）",
    sizes: "10vw",
    layer: "z-20",
    visibility: "hidden lg:block",
  },
  "boy-board": {
    media: heroBadgeMedia[0],
    label: "男の子（ボード）",
    sizes: "10vw",
    layer: "z-20",
    visibility: "hidden lg:block",
  },
};

/**
 * `cutouts` を渡せるのは `/fv-editor`（開発時のみ）がプレビューに使うため。
 * 通常は既定値のまま。
 */
export function Hero({ cutouts = heroCutoutLayout }: { cutouts?: HeroCutoutLayout[] }) {
  return (
    <section id="hero" className="relative overflow-hidden bg-sun lg:min-h-[40rem]">
      {/* PC：右端まで抜ける写真パネル。数秒ごとに写真が入れ替わる。
          幅はキャッチコピーの右端が写真に触れない位置から逆算している。
          広げると見出しが写真に乗るので、下の h1 のサイズとセットで調整すること。
          z-10 にしているのは、パネルの後ろに回すダイカット（z-0）より前に出すため。 */}
      <div className="absolute inset-y-0 right-0 z-10 hidden w-[52%] lg:block">
        <PhotoCrossfade
          photos={heroPanelPhotos}
          sizes="52vw"
          className="h-full rounded-xl [border-radius:11rem_0_0_0]!"
        />
      </div>

      {/* PC：前面のダイカット。位置は heroCutoutStyle が組み立てる。
          ボタンやリンクを隠さないよう pointer-events-none（装飾なのでクリック不要）。 */}
      {cutouts.map((layout) => {
        const cutout = heroCutouts[layout.id];

        return (
          <CutoutPhoto
            key={layout.id}
            media={cutout.media}
            sizes={cutout.sizes}
            eager={cutout.eager}
            className={`pointer-events-none absolute ${cutout.visibility} ${cutout.layer}`}
            style={heroCutoutStyle(layout)}
          />
        );
      })}

      <Wrap className="relative z-30 pt-10 pb-14 lg:pt-16 lg:pb-24">
        <h1 className="text-[2.75rem] leading-[1.45] tracking-[-0.04em] sm:text-6xl lg:text-[clamp(3rem,4.9vw,4.5rem)]">
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

        <div className="relative mt-8 lg:mt-12 lg:max-w-[26rem]">
          {/* 字間を少し詰め、行長を本文枠いっぱいまで使って行数を減らしている */}
          <p className="text-base leading-[1.9] font-medium tracking-[-0.02em] sm:text-lg lg:max-w-[26rem]">
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

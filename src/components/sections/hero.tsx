import type { CSSProperties } from "react";
import {
  heroCutoutLayout,
  heroCutoutStyle,
  heroNarrowCutoutLayout,
  heroNarrowCutoutStyle,
  type HeroNarrowLayout,
  type HeroCutoutId,
  type HeroCutoutLayout,
} from "@/content/hero-layout";
import { heroBadgeMedia, heroPanelPhotos, media, type Media } from "@/content/media";
import { REVEAL_STAGGER_MS, revealStyle, type RevealOptions } from "@/lib/reveal";
import { LinkButton } from "@/components/ui/button";
import { CutoutPhoto } from "@/components/ui/cutout-photo";
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
    /**
     * ★ `sizes` には必ず画面幅の条件を書くこと。
     *   PC と 1023px 以下で別々の要素を出しているので、条件が無いと
     *   **隠れている方の画像まで実寸で読み込まれる**（1440px で 69KB の無駄があった）。
     *   使わない幅は `1vw` にして、srcset のいちばん小さい候補だけを取らせる。
     *   ★ `1px` ではだめ。next/image は `sizes` の中の **vw の最小値**から候補幅を決めるので、
     *     px 指定は無視されて 640w が下限になってしまう。
     */
    eager?: boolean;
    /**
     * 登場の入り方。配置に合わせて向きを変える。
     * 大きい人物は少し傾けてから戻し（rotate）、小さいものは真下から出す。
     * 時間差は配列の順番から自動で付くので、ここでは delayMs を書かない。
     */
    reveal: RevealOptions;
  }
> = {
  "girl-front": {
    media: media.heroCutoutRight,
    label: "女の子",
    sizes: "(min-width: 1024px) 16vw, 1vw",
    // 写真パネル（z-10）の後ろ。断ち切られた右辺がパネルに完全に隠れる
    layer: "z-0",
    visibility: "hidden lg:block",
    eager: true,
    // 右端の大きい人物。右斜め下から、少し右に傾いた状態で起き上がる
    reveal: { x: 20, y: 35, rotate: 5, scale: 1, durationMs: 800 },
  },
  "boy-book": {
    media: heroBadgeMedia[1],
    label: "男の子（受験本）",
    sizes: "(min-width: 1024px) 10vw, 1vw",
    layer: "z-20",
    visibility: "hidden lg:block",
    // 左下の大きい人物。左斜め下から、少し左に傾いた状態で起き上がる
    reveal: { x: -20, y: 35, rotate: -5, scale: 1, durationMs: 800 },
  },
  "boy-board": {
    media: heroBadgeMedia[0],
    label: "男の子（ボード）",
    sizes: "(min-width: 1024px) 10vw, 1vw",
    layer: "z-20",
    // この1枚だけ PC 限定。見出しと写真パネルの間に置く決まりなのに、
    // タブレットではその隙間が 66px しかなく（自身の幅は 73px）、置くと見出しに乗る。
    visibility: "hidden lg:block",
    // 見出しの横。中央寄りなので傾けず、真下からふわっと出すだけ
    reveal: { y: 30, scale: 0.98, durationMs: 800 },
  },
};

/**
 * タブレットのダイカット3枚の素材。位置は `src/content/hero-layout.ts` の
 * `heroNarrowCutoutLayout`（`/fv-editor` を 768〜1023px で開くと編集できる）。
 */
export const heroNarrowCutouts: Record<
  HeroNarrowLayout["id"],
  { media: Media; label: string; sizes: string }
> = {
  "girl-front": {
    media: media.heroCutoutRight,
    label: "女の子",
    sizes: "(max-width: 1023px) 24vw, 1vw",
  },
  "boy-book": {
    media: heroBadgeMedia[1],
    label: "男の子（受験本）",
    sizes: "(max-width: 1023px) 20vw, 1vw",
  },
  "boy-board": {
    media: heroBadgeMedia[0],
    label: "男の子（ボード）",
    sizes: "(max-width: 1023px) 18vw, 1vw",
  },
};

/**
 * `cutouts` / `narrowCutouts` を渡せるのは `/fv-editor`（開発時のみ）がプレビューに使うため。
 * 通常は既定値のまま。
 */
/**
 * 2コマ風の歩きを1枚ずつずらす。3枚が完全に揃うと1つの塊に見えるため。
 * 動き自体は CSS（globals.css の `.walk-2frame`）が持っていて、ここは遅延だけ。
 * 1周期 0.9s に対して 0 / 0.3 / 0.58 秒。
 */
const WALK_DELAY_SEC = [0, 0.3, 0.58];

const walkStyle = (index: number) =>
  ({ "--walk-delay": `${WALK_DELAY_SEC[index % WALK_DELAY_SEC.length]}s` }) as CSSProperties;

export function Hero({
  cutouts = heroCutoutLayout,
  narrowCutouts = heroNarrowCutoutLayout,
}: {
  cutouts?: HeroCutoutLayout[];
  narrowCutouts?: HeroNarrowLayout[];
}) {
  const narrowIn = (area: HeroNarrowLayout["area"]) =>
    narrowCutouts.filter((item) => item.area === area);
  // min-h を 42rem にしているのは、左下の切り抜き（boy-book）を沈めずに置くため。
  // 40rem だとボタンの下に 183px しか残らず、切り抜きの高さ 205px が入らないので、
  // 足元（本）を FV の外へ逃がすしかなくなる。切り抜きを小さくするなら戻してよい。
  return (
    <section id="hero" className="relative overflow-hidden bg-sun lg:min-h-[42rem]">
      {/* PC：右端まで抜ける写真パネル。数秒ごとに写真が入れ替わる。
          幅はキャッチコピーの右端が写真に触れない位置から逆算している。
          広げると見出しが写真に乗るので、下の h1 のサイズとセットで調整すること。
          z-10 にしているのは、パネルの後ろに回すダイカット（z-0）より前に出すため。 */}
      <div className="absolute inset-y-0 right-0 z-10 hidden w-[52%] lg:block">
        <PhotoCrossfade
          photos={heroPanelPhotos}
          sizes="(min-width: 1024px) 52vw, 1vw"
          className="h-full rounded-xl [border-radius:11rem_0_0_0]!"
        />
      </div>

      {/* PC：前面のダイカット。位置は heroCutoutStyle が組み立てる。
          ボタンやリンクを隠さないよう pointer-events-none（装飾なのでクリック不要）。 */}
      {cutouts.map((layout, index) => {
        const cutout = heroCutouts[layout.id];

        return (
          // 位置と登場アニメーションで層を分けている。理由は2つ：
          // 1. heroCutoutStyle が transform を使うので、同じ要素に登場の transform を重ねられない
          // 2. 縁取り（SVG フィルタ）が乗った要素を動かすと毎フレーム描き直しになって重い
          <div
            key={layout.id}
            className={`pointer-events-none absolute ${cutout.visibility} ${cutout.layer}`}
            style={heroCutoutStyle(layout)}
          >
            <div
              data-reveal=""
              style={revealStyle({ ...cutout.reveal, delayMs: index * REVEAL_STAGGER_MS })}
            >
              {/* 登場（transition）と常時の動き（animation）は同じ要素に重ねられないので、
                  もう一段内側で動かす。2つの transform が掛け合わさる。
                  縁取り（SVG フィルタ）は内側の CutoutPhoto にあるので、
                  ここを動かしてもフィルタの再計算は起きない */}
              <div className="walk-2frame" style={walkStyle(index)}>
                <CutoutPhoto
                  media={cutout.media}
                  sizes={cutout.sizes}
                  eager={cutout.eager}
                  className="relative w-full"
                />
              </div>
            </div>
          </div>
        );
      })}

      <Wrap className="relative z-30 pt-20 pb-16 md:pt-8 lg:pt-16 lg:pb-24">
        {/* 見出しの上余白（pt-20＝80px）は、右に立つ切り抜きの頭が入る高さを確保するため。
            切り抜きの大きさと対。狭めると 500〜639px で頭がヘッダー
            （同じ黄色・z-50）の裏に潜って切れる。
            768px 以上は見出しの横に切り抜きを置かないので pt-8 に戻している。 */}
        <div className="relative">
          <h1 className="text-[2.5rem] leading-[1.45] tracking-[-0.01em] sm:text-6xl md:max-lg:text-[clamp(2.5rem,5.9vw,4rem)] lg:text-[clamp(3rem,4.9vw,4.5rem)]">
            <span className="block md:max-lg:inline">「教わる」から、</span>
            <span className="block md:max-lg:inline">「自分で学べる」へ。</span>
          </h1>

          {/* スマホだけ、見出し1行目の右の余白に立たせる。
              768px 以上では見出しが1行になってこの余白が無くなるので出さない
              （その幅ではサブコピーの右＝ area: "copy" に置いている）。 */}
          <div
            data-cutout-area="headline"
            className="pointer-events-none absolute inset-0 md:hidden"
          >
            {narrowIn("headline").map((item) => (
              <CutoutPhoto
                key={item.id}
                media={heroNarrowCutouts[item.id].media}
                sizes={heroNarrowCutouts[item.id].sizes}
                className="walk-2frame absolute"
                style={{ ...heroNarrowCutoutStyle(item), ...walkStyle(2) }}
              />
            ))}
          </div>
        </div>

        {/* 1023px 以下（スマホ・タブレット共通）：PC の縦帯パネルはこの幅だと
            323x576（縦横比 0.56）の細い帯になり、横長（1.50）の写真がほとんど見えない。
            そこで横長にして見出しの下に敷く。
            高さは `h-[36vh]` で画面の高さに連動させている。比率で決めると、横向きなど
            縦に短い画面（1023x768 など）でコピーが最初の画面から押し出されるため。
            ★ `aspect-*` と `max-h-*` の併用は不可。高さに合わせて幅まで縮み、右に隙間が出る。
            写真を大きく／小さくするときは vh の数字を変える（スマホ 42vh / タブレット 62vh）（`max-h` も対で見ること。
            34rem のままだと iPad Air 縦で先に上限に当たって vh が効かない）。
            `-mx-5 md:-mx-8` は Wrap の左右余白（px-5 / md:px-8）を打ち消して
            画面幅いっぱいにするため。★ Wrap は `px-5 md:px-8` なので切り替えも md。
            sm にすると 640〜767px で左右 12px ずつはみ出して角丸が切れる。 */}
        <div className="relative mt-8 -mx-5 md:-mx-8 lg:hidden">
          {/* 左上の大きな角丸は PC のパネル（11rem）に合わせた表現。幅なりに 5rem にしている */}
          <PhotoCrossfade
            photos={heroPanelPhotos}
            sizes="(max-width: 1023px) 100vw, 1vw"
            className="h-[42vh] max-h-[44rem] min-h-[12rem] rounded-tl-[3rem] md:h-[62vh] md:rounded-tl-[5rem]"
          />

          {/* 写真の下辺に立たせる切り抜き2枚。PC と同じ写真を使う。
              どちらも辺が断ち切られているので、隠せる向きにだけ逃がしている：
              - 女の子 … 右辺が断ち切り → 画面の右外へ出す
              - 男の子 … 左辺が断ち切り → 画面の左外へ出す
              - 下辺はどちらも写真の下端にそろえ、境界線と一致させて目立たなくする
              位置は hero-layout.ts の heroNarrowCutoutLayout（`/fv-editor` で編集できる） */}
          <div data-cutout-area="photo" className="pointer-events-none absolute inset-0">
            {narrowIn("photo").map((item, index) => (
              <CutoutPhoto
                key={item.id}
                media={heroNarrowCutouts[item.id].media}
                sizes={heroNarrowCutouts[item.id].sizes}
                className="walk-2frame absolute"
                style={{ ...heroNarrowCutoutStyle(item), ...walkStyle(index) }}
              />
            ))}
          </div>
        </div>

        <div className="relative mt-8 md:mt-7">
          {/* 行長の指定は本文だけに掛ける。下のボタン列まで掛けると、
              タブレットで幅が足りずボタンの文字が2行に折れる。
              字間を少し詰め、行長を本文枠いっぱいまで使って行数を減らしている。
              `fv`（1400px）以上では文ごとに改行して2行に収める（span を block にする）。
              これより下で2行にしないのは、右の写真パネルが画面幅の 48% から始まるため。
              1行目は 553px 必要で、使える幅は 1400px で 616px・1280px で 558px しかなく、
              それ以下だと結局2行に折り返して合計3行になる。 */}
          <p className="text-base leading-[1.9] font-medium tracking-[-0.02em] sm:text-lg max-lg:max-w-[34rem] lg:max-fv:max-w-[26rem] fv:max-w-[36rem]">
            <span className="fv:block">
              自分なりの学び方が身につけば、できることも、見える世界も広がっていく。
            </span>
            <span className="fv:block">
              自分の力で次の一歩を踏み出せるよう、とことん付き合います。
            </span>
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <LinkButton href="#contact">無料体験に申し込む</LinkButton>
            <LinkButton href="#contact" variant="outline">
              お問い合わせ
            </LinkButton>
          </div>

          {/* タブレット：サブコピー右の余白に立たせる1枚。
                ここに置けるのは輪郭が一周つながっている student-01 だけ。
                女の子（student-04）と受験本の男の子（student-02）は辺が断ち切られていて、
                画面の外か写真の縁でしか切り口を隠せないので、上の写真の上に置いている。 */}
          <div
            data-cutout-area="copy"
            className="pointer-events-none absolute inset-0 hidden md:block lg:hidden"
          >
            {narrowIn("copy").map((item) => (
              <CutoutPhoto
                key={item.id}
                media={heroNarrowCutouts[item.id].media}
                sizes={heroNarrowCutouts[item.id].sizes}
                className="walk-2frame absolute"
                style={{ ...heroNarrowCutoutStyle(item), ...walkStyle(2) }}
              />
            ))}
          </div>
        </div>
      </Wrap>
    </section>
  );
}

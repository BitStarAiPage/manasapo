import type { CSSProperties } from "react";

/**
 * FV に重ねるダイカット（切り抜き写真）5枚の位置とサイズ。
 *
 * 数値は開発サーバーの `/fv-editor` でドラッグして決められます。
 * そこで「保存」を押すと、この配列の `x` / `y` / `width` だけが書き換わります
 * （コメントと `xAnchor` / `yAnchor` はそのまま残ります）。
 *
 * `xAnchor` / `yAnchor` は写真ごとの「置き方」で、編集画面では変わりません。
 * 変えたいときはこのファイルを直接編集してください。
 */

export type HeroCutoutId = "girl-front" | "boy-board" | "boy-book";

export type HeroCutoutLayout = {
  id: HeroCutoutId;
  /**
   * 横位置の基準。写真の幅は常に FV 幅に対する % なので、基準ごとに置き方が違う。
   * - "fv"   … FV 全体の幅に対する % の位置に、写真の「中心」を置く。
   *            幅と同じ母数なので、画面幅が変わっても構図の比率が保たれる
   * - "screen" … 画面の左端に張り付ける。`x` は写真の幅に対する「画面外へはみ出させる %」。
   *              断ち切られた左辺を画面の外へ逃がしたいときに使う
   * - "panel" … 右端を「写真パネルの左端」に合わせる。パネルは画面幅の 48% の位置に
   *              あるので、そこから人物が出てくる表現はこれを使う。`x` はパネルへの
   *              食い込み量（画面幅に対する %）。断ち切られた右辺をパネルに隠せる
   * - "wrap" … 本文の左端を 0% とした本文幅（最大 1440px）に対する % の位置に、
   *            写真の「左端」を置く。1440px より広い画面でもボタンとの間隔が変わらない。
   *            画面が広いほど写真は右へ伸びる（幅は FV 基準で増えるため）
   */
  xAnchor: "fv" | "wrap" | "panel" | "screen";
  /** 横位置（%）。基準と、中心か左端かは xAnchor に従う */
  x: number;
  /**
   * 縦位置の基準。
   * - "center" … FV の高さに対する % の位置に、写真の中心を置く
   * - "bottom" … FV の下端から % ぶん上に、写真の下端を置く。
   *              元画像の下が断ち切られている写真は 0 のまま接地させ、切り口を隠す
   */
  yAnchor: "center" | "bottom";
  /** 縦位置（%）。基準は yAnchor に従う */
  y: number;
  /**
   * 幅の基準。
   * - 省略時 … FV の幅（＝画面幅）に対する %。画面を広げるほど写真も大きくなる
   * - "wrap" … 本文幅（最大 1440px）に対する %。1440px を超えると大きさが止まるので、
   *            本文まわりの決まった隙間に置く写真はこちらにする
   */
  widthAnchor?: "fv" | "wrap";
  /** 写真の幅（%）。基準は widthAnchor に従う。高さは写真の比率から決まる */
  width: number;
};

export const heroCutoutLayout: HeroCutoutLayout[] = [
  // 写真パネルの縁から人が出てくる、承認デザインの表現を担う一枚。
  // この写真は右端と下端が断ち切られているので、右端はパネルに、下端は FV の下端に重ねて隠す。
  // パネル基準にしているのは、どの画面幅でも右辺がパネルの縁に一致させるため
  // （本文基準だと 1640px を超えたあたりからパネルより内側にずれて、直線が露出する）
  { id: "girl-front", xAnchor: "panel", x: 0.4, yAnchor: "bottom", y: 0, widthAnchor: "wrap", width: 16 },
  // 見出しの横に立たせる男の子。見出しとの間隔を保ちたいので本文基準。
  // 幅も本文基準にしないと、広い画面で大きくなりすぎて見出しに届く。
  { id: "boy-board", xAnchor: "wrap", x: 36.58, yAnchor: "bottom", y: 72.14, widthAnchor: "wrap", width: 9.5 },
  // 左下の角の男の子。この写真は左辺が断ち切られているので、画面の左端からはみ出させて
  // 切り口を画面の外へ逃がす。どの画面幅でもはみ出し量が同じになるよう画面左端基準にしている
  // （画面幅の % で置くと、広い画面ほど右へ寄って切り口が出てくる）。
  { id: "boy-book", xAnchor: "screen", x: 4.39, yAnchor: "bottom", y: -0.82, widthAnchor: "wrap", width: 10 },
];

/** 写真パネルの左端の位置（画面幅に対する %）。Hero の写真パネル `w-[52%]` と対になる値 */
export const PANEL_LEFT_PERCENT = 48;

/**
 * 本文（Wrap）の最大幅。`xAnchor: "wrap"` の計算と編集画面の当たり判定で共有する。
 * ★ `src/components/ui/wrap.tsx` の `max-w-[...]` と必ず同じ値にすること。
 *   ずれると、本文基準で置いた切り抜きが本文からずれます。
 */
export const WRAP_MAX_WIDTH = 1640;

/**
 * レイアウト値を CSS に変換する。FV 本体と編集画面のつまみで同じものを使い、
 * ドラッグしている枠と実際の写真が必ず重なるようにしている。
 */
export function heroCutoutStyle(layout: HeroCutoutLayout): CSSProperties {
  const width =
    layout.widthAnchor === "wrap"
      ? `calc(min(100vw, ${WRAP_MAX_WIDTH}px) * ${layout.width} / 100)`
      : `${layout.width}%`;

  let left: string;
  if (layout.xAnchor === "wrap") {
    // 本文が中央寄せに変わるぶん（最大幅を超えた余白の半分）を足してから本文内の % を足す
    left = `calc(max(0px, (100vw - ${WRAP_MAX_WIDTH}px) / 2) + min(100vw, ${WRAP_MAX_WIDTH}px) * ${layout.x} / 100)`;
  } else if (layout.xAnchor === "screen") {
    // 画面の左端から、自分の幅の x% だけはみ出させる
    left = `calc(${width} * ${layout.x} / -100)`;
  } else if (layout.xAnchor === "panel") {
    // 右端をパネルの左端に合わせ、x のぶんだけパネルに食い込ませる
    left = `calc(${PANEL_LEFT_PERCENT + layout.x}vw - ${width})`;
  } else {
    left = `${layout.x}%`;
  }

  // 中心合わせにする軸だけ半分ずらす
  const shiftX = layout.xAnchor === "fv" ? "-50%" : "0";
  const shiftY = layout.yAnchor === "center" ? "-50%" : "0";

  return {
    left,
    ...(layout.yAnchor === "center" ? { top: `${layout.y}%` } : { bottom: `${layout.y}%` }),
    width,
    transform: `translate(${shiftX}, ${shiftY})`,
  };
}

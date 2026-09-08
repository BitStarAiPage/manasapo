import type { CSSProperties } from "react";

/**
 * イラスト（切り抜き写真・アバター・小さなアイコン）の動きを組み立てるヘルパー。
 * 実際の動きは `globals.css` の `[data-reveal]` と `.float-slow` が持っていて、
 * ここは要素ごとに変える数値を CSS 変数として渡すだけ。
 *
 * 数値の意味は CSS 側のコメントを参照。SP での移動量の圧縮（--motion-shift）は
 * CSS が担当するので、ここでは PC の値をそのまま書く。
 */

export type RevealOptions = {
  /**
   * 横方向の入り（px）。配置に合わせる。
   * 左に置いたイラストは -20、右は 20、中央は 0（省略）。
   */
  x?: number;
  /** 下からの入り（px）。既定 30。傾けて出すものは 35。 */
  y?: number;
  /** 出はじめの拡大率。既定 0.98。傾きで見せるものは 1 にする。 */
  scale?: number;
  /** 出はじめの傾き（deg）。左は -5、右は 5。 */
  rotate?: number;
  /** 再生時間（ms）。700〜900 の範囲で使う。 */
  durationMs?: number;
  /** 同じセクションに複数あるときの時間差（ms）。100〜150 ずつずらす。 */
  delayMs?: number;
};

/** 同じセクション内で何番目かに応じた時間差。100〜150ms の範囲に収める。 */
export const REVEAL_STAGGER_MS = 120;

export function revealStyle({
  x,
  y,
  scale,
  rotate,
  durationMs,
  delayMs,
}: RevealOptions = {}): CSSProperties {
  // 既定値は CSS 側の var() のフォールバックに任せ、指定されたものだけを渡す
  return {
    ...(x === undefined ? {} : { "--reveal-x": `${x}px` }),
    ...(y === undefined ? {} : { "--reveal-y": `${y}px` }),
    ...(scale === undefined ? {} : { "--reveal-scale": scale }),
    ...(rotate === undefined ? {} : { "--reveal-rotate": `${rotate}deg` }),
    ...(durationMs === undefined ? {} : { "--reveal-duration": `${durationMs}ms` }),
    ...(delayMs ? { "--reveal-delay": `${delayMs}ms` } : {}),
  } as CSSProperties;
}

/** アバターと小さなアイコンの浮遊用。ダイカットは `walk-2frame`（CSS だけ）で動く */
export type FloatOptions = {
  /** いちばん上がったときの移動量（px、負の値で上）。既定 -6 */
  rise?: number;
  /** 傾きの振れ幅（deg）。0 にすると上下だけ動く。既定 1 */
  tilt?: number;
};

/**
 * 常時ゆっくり動くアニメーションの長さ・ずれ・振れ幅。
 *
 * 同じ動きが揃って見えないよう、要素ごとに違う長さとずれを渡すこと。
 * 振れ幅の既定値は CSS 側の var() のフォールバックに任せ、変えるものだけ渡す。
 */
export function floatStyle(
  durationSec: number,
  delaySec: number,
  { rise, tilt }: FloatOptions = {},
): CSSProperties {
  return {
    "--float-duration": `${durationSec}s`,
    "--float-delay": `${delaySec}s`,
    ...(rise === undefined ? {} : { "--float-rise": `${rise}px` }),
    ...(tilt === undefined ? {} : { "--float-tilt": `${tilt}deg` }),
  } as CSSProperties;
}

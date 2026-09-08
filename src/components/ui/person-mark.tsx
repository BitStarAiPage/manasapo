import { cn } from "@/lib/cn";

/**
 * 人物写真の支給待ちを示す人型のシルエット。
 * 顔を描き込むと「その人」に見えてしまうので、頭と肩だけの無地にしている。
 */
export function PersonMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("text-mint-deep", className ?? "h-16 w-16 sm:h-20 sm:w-20")}
    >
      <circle cx="32" cy="21" r="12" fill="currentColor" />
      <path d="M8 60c0-13.3 10.7-24 24-24s24 10.7 24 24z" fill="currentColor" />
    </svg>
  );
}

/**
 * 円のアバター用の人型。**頭が円の上へ出る**ように描いてある。
 * 「円から人が出ている」表現は伝えたい要素なので、写真が未支給でも同じ見え方にする。
 *
 * ■ 座標の決まりごと（viewBox 100 x 115）
 * - 円は y = 15〜115 の 100 四方。つまり上の 15 は「円の外」にあたる余白。
 * - 頭は y = 9〜43 なので、上に 6（円の 6%）だけ出る。
 * - 首（短い長方形）を挟んで肩が y = 48 から始まり、円の下端まで広がる。
 *   肩を細くすると首だけが伸びて見えるので、頭のすぐ下から広げること。
 * この比率が崩れると頭が出なくなるので、変えるときは円の位置（y=15）を基準に測ること。
 */
export function PersonMarkInCircle({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 115"
      aria-hidden="true"
      className={cn("h-full w-full text-mint-deep", className)}
    >
      <circle cx="50" cy="26" r="17" fill="currentColor" />
      <path d="M42 38h16v13H42z" fill="currentColor" />
      <path d="M6 115a44 67 0 0 1 88 0z" fill="currentColor" />
    </svg>
  );
}

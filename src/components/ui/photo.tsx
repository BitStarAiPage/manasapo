import Image from "next/image";
import type { Media } from "@/content/media";
import { PersonMark } from "@/components/ui/person-mark";
import { cn } from "@/lib/cn";

type PhotoProps = {
  media: Media;
  /** 枠に付ける追加クラス（影・傾きなど） */
  className?: string;
  sizes?: string;
  /** FV など LCP になる写真だけ true。即時読み込み＋優先度を上げる */
  preload?: boolean;
  /** 縦横比ではなく親の高さいっぱいに広げる（高さは className で指定する） */
  stretch?: boolean;
  /** 枠の外にキャプションを出す場合は false にして、枠内のラベル重複を避ける */
  showLabel?: boolean;
};

/**
 * 写真枠。`media.src` があれば実写真を、なければ同じ縦横比のプレースホルダーを表示する。
 * どちらの場合も高さが確定するのでレイアウトは崩れない。
 */
export function Photo({
  media,
  className,
  sizes = "100vw",
  preload = false,
  stretch = false,
  showLabel = true,
}: PhotoProps) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-xl bg-mint", className)}
      style={stretch ? undefined : { aspectRatio: media.ratio }}
    >
      {media.src ? (
        <Image
          src={media.src}
          alt={media.alt}
          fill
          sizes={sizes}
          loading={preload ? "eager" : "lazy"}
          fetchPriority={preload ? "high" : undefined}
          className="object-cover"
          style={media.focus ? { objectPosition: media.focus } : undefined}
        />
      ) : (
        <PhotoPlaceholder
          label={showLabel ? media.label : undefined}
          align={stretch ? "bottom" : "center"}
          kind={media.placeholder}
        />
      )}
    </div>
  );
}

/** 写真の支給待ちを示す枠。完成サイトで架空の写真や実績を装わないための表示。 */
function PhotoPlaceholder({
  label,
  align = "center",
  kind,
}: {
  label?: string;
  align?: "center" | "bottom";
  /** "person" のときは人型のシルエットを出す */
  kind?: "person";
}) {
  return (
    <div
      className={cn(
        "absolute inset-0 flex flex-col items-center gap-2 border-2 border-dashed border-mint-deep bg-mint px-4 text-center",
        align === "bottom" ? "justify-end pb-14" : "justify-center",
      )}
    >
      {kind === "person" && <PersonMark />}
      {label && <span className="text-sm font-bold text-ink-soft">{label}</span>}
      <span className="text-xs text-ink-soft/70">写真準備中</span>
    </div>
  );
}

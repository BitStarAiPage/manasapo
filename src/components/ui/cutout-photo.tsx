import Image from "next/image";
import type { Media } from "@/content/media";
import { cn } from "@/lib/cn";

/**
 * 背景を抜いた人物写真を、黄色い縁取り付きで前面に重ねるための層。
 * 透過PNG/WebPを `media.src` に入れると、アルファに沿って縁取りが出る。
 * 未支給のあいだは同じ位置・比率のプレースホルダーを出すので、構図は崩れない。
 * 位置は呼び出し側が `className` で指定する（`absolute ...` を必ず渡すこと）。
 */
export function CutoutPhoto({
  media,
  className,
  sizes = "24vw",
  showPlaceholder = false,
  eager = false,
}: {
  media: Media;
  className?: string;
  sizes?: string;
  /** FV など LCP になる切り抜きだけ true。即時読み込み＋優先度を上げる */
  eager?: boolean;
  /** 素材が未支給でも枠を出す。構図を確認したい FV で使う。 */
  showPlaceholder?: boolean;
}) {
  // 素材が未支給のあいだは描かない。入れた時点でこの層に乗る。
  if (!media.src) {
    if (!showPlaceholder) return null;

    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-0.5 rounded-t-full border-2 border-dashed border-ink/25 bg-ivory/60 px-3 text-center",
          className,
        )}
        style={{ aspectRatio: media.ratio }}
      >
        <span className="text-xs font-bold text-ink-soft">{media.label}</span>
        <span className="text-[0.6875rem] text-ink-soft/70">透過PNG準備中</span>
      </div>
    );
  }

  return (
    <div className={cn("cutout-outline", className)} style={{ aspectRatio: media.ratio }}>
      <Image
        src={media.src}
        alt={media.alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : undefined}
        className="object-contain object-bottom"
      />
    </div>
  );
}

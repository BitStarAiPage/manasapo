import Image from "next/image";
import type { Media } from "@/content/media";
import { cn } from "@/lib/cn";

/**
 * FV の写真パネル。もとは数秒ごとに写真を入れ替えるスライドだったが、
 * POPER 様の制作ルール（スライダーの自動切り替えは使わない）に合わせて、
 * 2026-10-23 に1枚目だけを出す形にした（写真はもともと1枚なので見た目は同じ）。
 */
export function PhotoCrossfade({
  photos,
  className,
  sizes = "100vw",
}: {
  photos: Media[];
  className?: string;
  sizes?: string;
}) {
  const photo = photos.find((item) => item.src);

  return (
    <div className={cn("relative overflow-hidden bg-mint", className)}>
      {photo && (
        <Image
          src={photo.src as string}
          alt={photo.alt}
          fill
          sizes={sizes}
          loading="eager"
          fetchPriority="high"
          className="object-cover"
          style={photo.focus ? { objectPosition: photo.focus } : undefined}
        />
      )}
    </div>
  );
}

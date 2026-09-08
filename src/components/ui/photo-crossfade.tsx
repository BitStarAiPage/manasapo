"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Media } from "@/content/media";
import { cn } from "@/lib/cn";

/**
 * 同じ枠の中で写真を数秒ごとに入れ替えるスライド。重ねて不透明度を切り替えるだけなので、
 * 切り替わっても高さは動かない。
 *
 * 2枚目以降は装飾扱い（`alt=""` ＋ `aria-hidden`）にしている。
 * 読み上げでは1枚目の説明だけが読まれ、同じ枠の説明が何度も読まれるのを避ける。
 * 「視差効果を減らす」設定の環境では切り替えを行わず、1枚目のまま止める。
 */
export function PhotoCrossfade({
  photos,
  className,
  sizes = "100vw",
  /** 1枚あたりの表示時間（ミリ秒） */
  interval = 6000,
}: {
  photos: Media[];
  className?: string;
  sizes?: string;
  interval?: number;
}) {
  const [current, setCurrent] = useState(0);
  const shown = photos.filter((photo) => photo.src);

  useEffect(() => {
    if (shown.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = setInterval(() => {
      setCurrent((index) => (index + 1) % shown.length);
    }, interval);

    return () => clearInterval(timer);
  }, [shown.length, interval]);

  return (
    <div className={cn("relative overflow-hidden bg-mint", className)}>
      {shown.map((photo, index) => (
        <Image
          key={photo.src}
          src={photo.src as string}
          alt={index === 0 ? photo.alt : ""}
          aria-hidden={index !== 0}
          fill
          sizes={sizes}
          loading={index === 0 ? "eager" : "lazy"}
          fetchPriority={index === 0 ? "high" : undefined}
          className={cn(
            "object-cover transition-opacity duration-1000 motion-reduce:transition-none",
            index === current ? "opacity-100" : "opacity-0",
          )}
          style={photo.focus ? { objectPosition: photo.focus } : undefined}
        />
      ))}
    </div>
  );
}

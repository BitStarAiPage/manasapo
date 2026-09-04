import Image from "next/image";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * 支給されたロゴ画像をそのまま使う（トレース・再生成は禁止）。
 * 元画像の背景は白なので、黄色やアイボリーの面では mix-blend-multiply で馴染ませる。
 * 画像自体は加工していない。
 */
export function Logo({ className, alt = site.logoAlt }: { className?: string; alt?: string }) {
  return (
    <Image
      src="/images/logo.png"
      alt={alt}
      width={399}
      height={347}
      preload
      className={cn("max-w-full mix-blend-multiply", className)}
    />
  );
}

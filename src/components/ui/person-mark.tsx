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

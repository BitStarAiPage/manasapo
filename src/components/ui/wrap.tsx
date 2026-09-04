import { cn } from "@/lib/cn";

/**
 * ページ共通のコンテナ。
 * 採用デザインの左右余白は 1440px 換算で約56pxなので、最大幅を広めに取り
 * 余白そのもので制御する（max-w を狭くすると両端が二重に空いてしまう）。
 * 本文の読みやすい行長は、各セクション側の max-w で別に押さえている。
 */
export function Wrap({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1440px] px-5 md:px-8 lg:px-12 xl:px-14", className)}>
      {children}
    </div>
  );
}

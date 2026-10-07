"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { LinkButton } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Wrap } from "@/components/ui/wrap";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-sun">
      <Wrap>
        {/* モバイルはメニューボタン（56px）が入るので、64px だと上下 4px しか空かない。
            76px にして上下 10px を確保している */}
        <div className="flex h-[4.75rem] items-center gap-4 lg:h-20 lg:gap-6">
          {/* ロゴ横のキャッチ。1行に入らない幅では「〜個別指導塾／まなサポ」の2行にする。
              1行にするのは 1536px 以上だけ（それ未満はナビとボタンに押されて入らない）。
              文字サイズは 14→16→18→20px と段階的に上げている。410px 未満は 16px にすると
              1行目（14文字＝224px）がロゴとメニューボタンの間に入らず「塾」だけ3行目に落ちる。
              `min-w-0` はキャッチが伸びてメニューボタンを押し出さないため */}
          <Link href="/#hero" className="flex min-w-0 items-center gap-3" onClick={close}>
            <Logo className="h-12 w-auto lg:h-16" alt={`${site.name} トップへ`} />
            <span className="block text-sm leading-snug font-bold min-[410px]:text-base sm:text-lg xl:text-xl">
              <span className="block 2xl:inline">{site.tagline}</span>
              <span className="hidden 2xl:inline">　</span>
              <span className="block 2xl:inline">{site.name}</span>
            </span>
          </Link>

          <nav aria-label="サイト内メニュー" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-5 xl:gap-7">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-sm font-bold hover:underline xl:text-base">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* 「無料体験に申し込む」はヘッダーから外した（2026-10 の修正指示）。FV に同じボタンがある */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <LinkButton href="/#contact" size="sm" variant="outline">
              お問い合わせ
            </LinkButton>
          </div>

          {/* メニューボタン。ノートの形にしているぶん「メニュー」の合図が弱いので、
              文字のラベルを添えて分かるようにしている。
              - 表紙 … 角丸の枠線
              - 綴じ … 左寄りの縦線1本
              - 罫線 … もとの3本線。メニューだと分かる形も兼ねる
              押せる範囲は 48x56px で、44px の目安を満たしている。 */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="ml-auto flex h-14 w-12 shrink-0 flex-col items-center justify-center gap-1 lg:hidden"
          >
            <span
              aria-hidden="true"
              className="relative flex h-9 w-[30px] flex-col items-center justify-center gap-[4px] rounded-[5px] border-2 border-ink"
            >
              <span className="absolute inset-y-[3px] left-[6px] w-[2px] rounded-full bg-ink" />
              <span className="block h-[2px] w-3 translate-x-[4px] bg-ink" />
              <span className="block h-[2px] w-3 translate-x-[4px] bg-ink" />
              <span className="block h-[2px] w-3 translate-x-[4px] bg-ink" />
            </span>
            <span className="text-[10px] leading-none font-bold">
              {open ? "とじる" : "メニュー"}
            </span>
          </button>
        </div>
      </Wrap>

      {open && (
        <div id="mobile-menu" className="border-t-2 border-ink/10 bg-sun lg:hidden">
          {/* キャッチコピーはヘッダーに常時出ているので、ここには重ねて置かない */}
          <Wrap className="py-5">
            <ul className="flex flex-col gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} onClick={close} className="block py-3 text-base font-bold">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-3">
              <LinkButton href="/#contact" variant="outline" onClick={close}>
                お問い合わせ
              </LinkButton>
            </div>
          </Wrap>
        </div>
      )}
    </header>
  );
}

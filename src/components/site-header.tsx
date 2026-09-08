"use client";

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
          {/* 1024〜1279px だけ隠す。この幅はナビとボタンが並ぶので入る余地が無い。
              `min-w-0` はロゴの横のキャッチが伸びてメニューボタンを押し出さないため */}
          <a href="#hero" className="flex min-w-0 items-center gap-3" onClick={close}>
            <Logo className="h-12 w-auto lg:h-16" alt={`${site.name} トップへ`} />
            <span className="block text-xs leading-tight font-bold lg:hidden xl:block">
              {site.tagline}
            </span>
          </a>

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

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <LinkButton href="#contact" size="sm">
              無料体験に申し込む
            </LinkButton>
            <LinkButton href="#contact" size="sm" variant="outline">
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
              <LinkButton href="#contact" onClick={close}>
                無料体験に申し込む
              </LinkButton>
              <LinkButton href="#contact" variant="outline" onClick={close}>
                お問い合わせ
              </LinkButton>
            </div>
          </Wrap>
        </div>
      )}
    </header>
  );
}

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
        <div className="flex h-16 items-center gap-4 lg:h-20 lg:gap-6">
          <a href="#hero" className="flex shrink-0 items-center gap-3" onClick={close}>
            <Logo className="h-10 w-auto lg:h-14" alt={`${site.name} トップへ`} />
            <span className="hidden text-xs font-bold leading-tight xl:block">{site.tagline}</span>
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

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="ml-auto flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[5px] rounded-full border-2 border-ink lg:hidden"
          >
            <span className="sr-only">{open ? "メニューを閉じる" : "メニューを開く"}</span>
            <span aria-hidden="true" className="block h-[2px] w-5 bg-ink" />
            <span aria-hidden="true" className="block h-[2px] w-5 bg-ink" />
            <span aria-hidden="true" className="block h-[2px] w-5 bg-ink" />
          </button>
        </div>
      </Wrap>

      {open && (
        <div id="mobile-menu" className="border-t-2 border-ink/10 bg-sun lg:hidden">
          <Wrap className="py-5">
            <p className="text-xs font-bold">{site.tagline}</p>
            <ul className="mt-4 flex flex-col gap-1">
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

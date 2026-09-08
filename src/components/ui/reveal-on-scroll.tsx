"use client";

import { useEffect } from "react";

/**
 * `data-reveal` が付いた要素を、画面に入った時点で一度だけ表示する。
 *
 * ページ全体で1つだけ layout.tsx に置く。各セクションはサーバーコンポーネントのまま
 * `data-reveal` を書くだけでよく、セクションごとに "use client" を足さずに済む。
 *
 * - しきい値 0.18 … 要素が2割ほど画面に入ったら再生する（指定は 15〜20%）
 * - 一度 in にしたら unobserve する。戻したり再生し直したりはしない
 * - IntersectionObserver が無い環境ではすべて即表示にする（隠れたままにしない）
 *
 * prefers-reduced-motion のときは CSS 側が初期状態を作らないので、
 * ここで in を付けても付けなくても見た目は変わらない。
 */
export function RevealOnScroll() {
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (targets.length === 0) return;

    const show = (el: Element) => el.setAttribute("data-reveal", "in");

    if (typeof IntersectionObserver === "undefined") {
      targets.forEach(show);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          show(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.18 },
    );

    for (const el of targets) {
      if (el.dataset.reveal === "in") continue;
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}

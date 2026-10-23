"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * 1〜2文字だけが次の行に落ちる行（「す。」「ム！」など）を、その文の字間を少し詰めて前の行に戻す。
 * POPER の制作ルール（スマホの改行）に沿った処理で、2026-10-23 の指示で PC の幅にも掛けている。
 *
 * ■ CSS で1か所ずつ直さない理由
 *   落ちる箇所は画面幅ごとに違い（390px と 1280px で別の文）、ある幅に合わせて詰めると
 *   別の幅で新しく落ちる。表示している幅で実際に測って、落ちている文だけを直す。
 *
 * ■ やっていること
 *   1. main の中の「文字を直接持つ要素」（見出し・段落・リストなど）を集める
 *   2. 1文字ずつ位置を測って行に分け、行末（要素の終わり、または \n の改行）の行が
 *      1〜2文字だけで、その前の行と同じ段落の続きなら「落ちている」とみなす
 *   3. その要素だけ letter-spacing を 0.01em ずつ、最大 0.05em まで詰める。
 *      詰めても直らない文は元に戻す（読みにくくなるほどは詰めない）
 *   画面幅の変更・フォント読み込み・アコーディオンの開閉のたびに測り直す。
 *
 * 文の幅を短くする調整（途中の改行・text-wrap: balance）はルールで禁止されているので使わない。
 */

const MAX_TIGHTEN_EM = 0.05;
const STEP_EM = 0.01;
const ORPHAN_MAX_CHARS = 2;
const MARK = "data-orphan-fix";

type Line = { top: number; count: number; endsWithBreak: boolean };

/** 要素の文字を行ごとに数える。空白は数えない */
function measureLines(el: HTMLElement): Line[] {
  const lines: Line[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let node: Node | null;
  let pendingBreak = false;

  while ((node = walker.nextNode())) {
    const text = node.textContent ?? "";
    if (!node.parentElement?.getClientRects().length) continue;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === "\n") {
        pendingBreak = true;
        continue;
      }
      if (/\s/.test(ch)) continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      const rect = range.getClientRects()[0];
      if (!rect || rect.width === 0) continue;
      const center = rect.top + rect.height / 2;
      const last = lines[lines.length - 1];
      if (last && Math.abs(last.top - center) < rect.height / 2) {
        last.count++;
      } else {
        if (last) last.endsWithBreak = pendingBreak;
        lines.push({ top: center, count: 1, endsWithBreak: false });
      }
      pendingBreak = false;
    }
  }
  if (lines.length) lines[lines.length - 1].endsWithBreak = true;
  return lines;
}

/** 前の行から押し出された 1〜2文字だけの行があるか */
function hasOrphan(el: HTMLElement) {
  const lines = measureLines(el);
  return lines.some(
    (line, i) =>
      i > 0 &&
      line.endsWithBreak &&
      line.count <= ORPHAN_MAX_CHARS &&
      !lines[i - 1].endsWithBreak,
  );
}

/**
 * 文字を直接持つまとまり（段落・見出し・リスト項目の中の見出しなど）だけを対象にする。
 * - 子孫にブロック要素を含む入れ物は除く（見出しと本文を別々に測れないため）
 * - 対象の中にある inline の span は、親と二重に数えないよう親だけを残す
 */
function collectTargets(root: HTMLElement) {
  const isInline = (el: Element) => getComputedStyle(el).display.startsWith("inline");
  const allInline = (el: Element): boolean =>
    [...el.children].every(
      (child) => !child.textContent?.trim() || (isInline(child) && allInline(child)),
    );

  const leaves = new Set(
    [...root.querySelectorAll<HTMLElement>("*")].filter(
      (el) =>
        !["SCRIPT", "STYLE", "svg", "IFRAME"].includes(el.tagName) &&
        el.textContent?.trim() &&
        el.getClientRects().length &&
        allInline(el),
    ),
  );
  return [...leaves].filter((el) => !(el.parentElement && leaves.has(el.parentElement)));
}

function fixOrphans(root: HTMLElement) {
  const targets = collectTargets(root);

  // 前回詰めた分を外してから測る（幅が変わると不要になっていることがある）
  for (const el of root.querySelectorAll<HTMLElement>(`[${MARK}]`)) {
    el.style.letterSpacing = "";
    el.removeAttribute(MARK);
  }

  for (const el of targets) {
    if (!hasOrphan(el)) continue;
    const style = getComputedStyle(el);
    const fontSize = parseFloat(style.fontSize);
    const base = style.letterSpacing === "normal" ? 0 : parseFloat(style.letterSpacing);

    let fixed = false;
    for (let em = STEP_EM; em <= MAX_TIGHTEN_EM + 1e-6; em += STEP_EM) {
      el.style.letterSpacing = `${base - em * fontSize}px`;
      if (!hasOrphan(el)) {
        fixed = true;
        break;
      }
    }
    if (fixed) el.setAttribute(MARK, "");
    else el.style.letterSpacing = "";
  }
}

export function OrphanFix() {
  // サイト内でページを移ったとき（フォーム送信後の /thanks など）も測り直す。
  // layout に置いているので、pathname を見ないと最初に開いたページでしか動かない
  const pathname = usePathname();

  useEffect(() => {
    const root = document.querySelector("main");
    if (!root) return;

    let frame = 0;
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => fixOrphans(root));
    };

    // 幅の変化だけを拾う（高さの変化＝アコーディオンの開閉は toggle で拾う）
    let lastWidth = window.innerWidth;
    const onResize = () => {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      schedule();
    };

    document.fonts.ready.then(schedule);
    schedule();
    window.addEventListener("resize", onResize);
    // <details> の toggle はバブリングしないので capture で拾う
    root.addEventListener("toggle", schedule, true);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      root.removeEventListener("toggle", schedule, true);
    };
  }, [pathname]);

  return null;
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Hero, heroCutouts } from "@/components/sections/hero";
import {
  heroCutoutLayout,
  heroCutoutStyle,
  WRAP_MAX_WIDTH,
  type HeroCutoutLayout,
} from "@/content/hero-layout";

/**
 * FV のダイカット5枚を、実際の FV の上でドラッグして位置と大きさを決める画面。
 * 開発サーバーでだけ開ける（`/fv-editor`）。
 *
 * 表示しているのは本番と同じ `<Hero />` で、座標だけをこの画面の state から渡している。
 * つまみは写真とまったく同じ CSS（`heroCutoutStyle`）で置くので、枠と写真は必ず重なる。
 * 「保存」を押すと `src/content/hero-layout.ts` の数値が書き換わり、トップページに反映される。
 */

type SaveState = {
  kind: "idle" | "saving" | "saved" | "error";
  message?: string;
};

type Stage = { width: number; height: number };

/** 横位置の入力欄の見出し。基準ごとに意味が違うので言葉を変える */
const X_LABEL: Record<HeroCutoutLayout["xAnchor"], string> = {
  fv: "中心X",
  wrap: "左端（本文）",
  panel: "パネル食込",
  screen: "左はみ出し",
};

/** 0.01% 刻み。1440px で 0.15px 相当なので、丸めで写真がずれて見えることはない */
const round = (value: number) => Math.round(value * 100) / 100;

/** FV の外へ大きく逃げて見失わない程度に止める */
const clampPosition = (value: number) => Math.min(115, Math.max(-15, value));
const clampWidth = (value: number) => Math.min(40, Math.max(2, value));

/**
 * 横方向は基準ごとに「1% が何 px か」が違う。
 * "wrap" は本文幅（最大 1440px）が母数なので、広い画面ほど 1% が小さくなる。
 */
const percentPerPixelX = (layout: HeroCutoutLayout, stage: Stage) =>
  100 / (layout.xAnchor === "wrap" ? Math.min(stage.width, WRAP_MAX_WIDTH) : stage.width);

/** 下端基準の写真は、下に動かすほど値が減る */
const verticalSign = (layout: HeroCutoutLayout) => (layout.yAnchor === "bottom" ? -1 : 1);

export function FvEditor() {
  const [layout, setLayout] = useState<HeroCutoutLayout[]>(heroCutoutLayout);
  const [selected, setSelected] = useState(0);
  const [save, setSave] = useState<SaveState>({ kind: "idle" });
  const [tooNarrow, setTooNarrow] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    index: number;
    pointerX: number;
    pointerY: number;
    base: HeroCutoutLayout;
    stage: Stage;
  } | null>(null);

  // ダイカットは lg（1024px）以上でしか出ないので、狭い窓では編集できないことを伝える
  useEffect(() => {
    const check = () => setTooNarrow(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const update = useCallback((index: number, patch: Partial<HeroCutoutLayout>) => {
    setSave({ kind: "idle" });
    setLayout((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }, []);

  const handlePointerDown = (index: number) => (event: React.PointerEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    drag.current = {
      index,
      pointerX: event.clientX,
      pointerY: event.clientY,
      base: layout[index],
      stage: { width: rect.width, height: rect.height },
    };
    setSelected(index);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current) return;

    const { base, stage } = current;
    update(current.index, {
      x: round(
        clampPosition(base.x + (event.clientX - current.pointerX) * percentPerPixelX(base, stage)),
      ),
      y: round(
        clampPosition(
          base.y + ((event.clientY - current.pointerY) * verticalSign(base) * 100) / stage.height,
        ),
      ),
    });
  };

  const handlePointerUp = () => {
    drag.current = null;
  };

  // 矢印キーで微調整。Shift で 1%、単独で 0.1%
  const handleKeyDown = (index: number) => (event: React.KeyboardEvent<HTMLDivElement>) => {
    const item = layout[index];
    const step = event.shiftKey ? 1 : 0.1;
    const vertical = step * verticalSign(item);
    const moves: Record<string, Partial<HeroCutoutLayout>> = {
      ArrowLeft: { x: round(clampPosition(item.x - step)) },
      ArrowRight: { x: round(clampPosition(item.x + step)) },
      ArrowUp: { y: round(clampPosition(item.y - vertical)) },
      ArrowDown: { y: round(clampPosition(item.y + vertical)) },
    };
    const patch = moves[event.key];
    if (!patch) return;

    event.preventDefault();
    update(index, patch);
  };

  const handleSave = async () => {
    setSave({ kind: "saving" });
    try {
      const response = await fetch("/api/fv-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(layout),
      });
      const body = await response.json();
      setSave(
        response.ok
          ? {
              kind: "saved",
              message: "src/content/hero-layout.ts を更新しました",
            }
          : { kind: "error", message: body.error ?? "保存できませんでした" },
      );
    } catch {
      setSave({
        kind: "error",
        message: "保存できませんでした（開発サーバーが動いているか確認してください）",
      });
    }
  };

  const current = layout[selected];

  const code = layout
    .map(
      (item) =>
        `  { id: "${item.id}", xAnchor: "${item.xAnchor}", x: ${item.x}, yAnchor: "${item.yAnchor}", y: ${item.y}, width: ${item.width} },`,
    )
    .join("\n");

  return (
    <div className="min-h-dvh bg-neutral-100 pb-64 text-ink">
      <header className="border-b-2 border-ink bg-white px-6 py-4">
        <h1 className="text-lg font-black">FV ダイカットの位置調整</h1>
        <p className="mt-1 text-sm text-ink-soft">
          写真をドラッグして動かします。選択中は矢印キーで 0.1%、Shift + 矢印で 1% ずつ動きます。
          この画面は開発サーバーでだけ開けます。
        </p>
        {tooNarrow && (
          <p className="mt-2 rounded-lg bg-sun px-3 py-2 text-sm font-bold">
            ダイカットは画面幅 1024px 以上でしか表示されません。ウィンドウを広げてください。
          </p>
        )}
      </header>

      <div ref={stageRef} className="relative">
        <Hero cutouts={layout} />

        {/* 写真とまったく同じ座標・比率で重ねる透明なつまみ。Hero 側は pointer-events-none */}
        <div className="pointer-events-none absolute inset-0 z-40 hidden lg:block">
          {layout.map((item, index) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-label={`${heroCutouts[item.id].label}を動かす`}
              onPointerDown={handlePointerDown(index)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onKeyDown={handleKeyDown(index)}
              onFocus={() => setSelected(index)}
              className={`pointer-events-auto absolute cursor-grab touch-none rounded-md border-2 transition-colors active:cursor-grabbing ${heroCutouts[item.id].visibility} ${
                selected === index
                  ? "border-blue-600 bg-blue-500/15"
                  : "border-blue-600/40 hover:bg-blue-500/10"
              }`}
              style={{
                ...heroCutoutStyle(item),
                aspectRatio: heroCutouts[item.id].media.ratio,
              }}
            >
              <span className="absolute -top-6 left-0 rounded bg-blue-600 px-1.5 py-0.5 text-[11px] font-bold whitespace-nowrap text-white">
                {heroCutouts[item.id].label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 操作パネル。FV の下端に重なるので、既定では1行に収まる高さにしている */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-ink bg-white px-6 py-3">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
            <div className="flex flex-wrap gap-1.5">
              {layout.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(index)}
                  className={`rounded-full border-2 px-3 py-1.5 text-xs font-bold ${
                    selected === index
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-ink/20 hover:border-ink"
                  }`}
                >
                  {heroCutouts[item.id].label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <NumberField
                label={X_LABEL[current.xAnchor]}
                value={current.x}
                onChange={(value) => update(selected, { x: round(clampPosition(value)) })}
              />
              <NumberField
                label={current.yAnchor === "bottom" ? "下端から" : "中心Y"}
                value={current.y}
                onChange={(value) => update(selected, { y: round(clampPosition(value)) })}
              />
              <NumberField
                label="幅"
                value={current.width}
                onChange={(value) => update(selected, { width: round(clampWidth(value)) })}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                disabled={save.kind === "saving"}
                className="rounded-full bg-ink px-6 py-2.5 text-sm font-bold text-white disabled:opacity-50"
              >
                {save.kind === "saving" ? "保存中..." : "この位置で保存"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLayout(heroCutoutLayout);
                  setSave({ kind: "idle" });
                }}
                className="rounded-full border-2 border-ink px-6 py-2.5 text-sm font-bold"
              >
                保存済みの位置に戻す
              </button>
              {save.message && (
                <span
                  role="status"
                  className={`text-sm font-bold ${
                    save.kind === "error" ? "text-red-700" : "text-green-800"
                  }`}
                >
                  {save.message}
                </span>
              )}
            </div>
          </div>

          <details className="mt-2">
            <summary className="cursor-pointer text-xs font-bold text-ink-soft">
              保存される内容（hero-layout.ts）
            </summary>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-neutral-900 p-3 text-[11px] leading-relaxed text-neutral-100">
              {code}
            </pre>
          </details>
        </div>
      </div>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="flex w-[5.5rem] flex-col gap-1 text-[11px] font-bold">
      {label}
      <input
        type="number"
        step={0.1}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!Number.isNaN(next)) onChange(next);
        }}
        className="w-full rounded border-2 border-ink/20 px-2 py-1 text-sm font-normal outline-none focus:border-ink"
      />
    </label>
  );
}

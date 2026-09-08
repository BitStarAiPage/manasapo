"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Hero, heroCutouts, heroNarrowCutouts } from "@/components/sections/hero";
import {
  heroCutoutLayout,
  heroCutoutStyle,
  heroNarrowCutoutLayout,
  heroNarrowCutoutStyle,
  WRAP_MAX_WIDTH,
  type HeroCutoutLayout,
  type HeroNarrowLayout,
} from "@/content/hero-layout";

/**
 * FV のダイカットを、実際の FV の上でドラッグして位置と大きさを決める画面。
 * 開発サーバーでだけ開ける（`/fv-editor`）。
 *
 * 表示しているのは本番と同じ `<Hero />` で、座標だけをこの画面の state から渡している。
 * つまみは写真とまったく同じ CSS で置くので、枠と写真は必ず重なる。
 * 「保存」を押すと `src/content/hero-layout.ts` の数値が書き換わり、トップページに反映される。
 *
 * ■ PC とタブレットで編集対象が変わる
 *   ダイカットは画面幅ごとに置き方がまったく違い、CSS のブレークポイントは
 *   ウィンドウ幅を見るので、1つの窓で両方を同時には出せない。
 *   そのため**ウィンドウ幅で編集対象を切り替える**：
 *     1024px 以上 … PC の3枚（heroCutoutLayout）
 *     768〜1023px … タブレットの3枚（heroNarrowCutoutLayout）
 *   タブレット版を触るときはウィンドウを 834px くらいまで狭めてください
 *   （検証ツールのデバイスツールバーでも可）。
 */

type SaveState = { kind: "idle" | "saving" | "saved" | "error"; message?: string };
type Stage = { width: number; height: number };
type Mode = "pc" | "narrow";
type Rect = { left: number; top: number; width: number; height: number };

/** 横位置の入力欄の見出し。基準ごとに意味が違うので言葉を変える */
const X_LABEL: Record<HeroCutoutLayout["xAnchor"], string> = {
  fv: "中心X",
  wrap: "左端（本文）",
  panel: "パネル食込",
  screen: "左はみ出し",
};

const AREA_LABEL: Record<HeroNarrowLayout["area"], string> = {
  photo: "写真の上",
  copy: "サブコピー右",
  headline: "見出しの右",
};

/** 0.01% 刻み。1440px で 0.15px 相当なので、丸めで写真がずれて見えることはない */
const round = (value: number) => Math.round(value * 100) / 100;

/** FV の外へ大きく逃げて見失わない程度に止める */
const clampPosition = (value: number) => Math.min(115, Math.max(-15, value));
const clampWidth = (value: number) => Math.min(40, Math.max(2, value));
/** タブレットの y は px。上下 200px の範囲に収める */
const clampOffset = (value: number) => Math.min(200, Math.max(-200, value));

/**
 * 横方向は基準ごとに「1% が何 px か」が違う。
 * "wrap" は本文幅（最大 1640px）が母数なので、広い画面ほど 1% が小さくなる。
 */
const percentPerPixelX = (layout: HeroCutoutLayout, stage: Stage) =>
  100 / (layout.xAnchor === "wrap" ? Math.min(stage.width, WRAP_MAX_WIDTH) : stage.width);

/** 下端基準の写真は、下に動かすほど値が減る */
const verticalSign = (layout: HeroCutoutLayout) => (layout.yAnchor === "bottom" ? -1 : 1);

export function FvEditor() {
  const [mode, setMode] = useState<Mode>("pc");
  const [pcLayout, setPcLayout] = useState<HeroCutoutLayout[]>(heroCutoutLayout);
  const [narrowLayout, setNarrowLayout] = useState<HeroNarrowLayout[]>(heroNarrowCutoutLayout);
  const [selected, setSelected] = useState(0);
  const [save, setSave] = useState<SaveState>({ kind: "idle" });
  const [areas, setAreas] = useState<Partial<Record<HeroNarrowLayout["area"], Rect>>>({});

  const stageRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    index: number;
    pointerX: number;
    pointerY: number;
    basePc?: HeroCutoutLayout;
    baseNarrow?: HeroNarrowLayout;
    stage: Stage;
    areaWidth?: number;
  } | null>(null);

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      setMode(w >= 1024 ? "pc" : "narrow");
      setSelected(0);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /**
   * タブレットのつまみは「写真の上」「サブコピー右」の2つの枠の中に置く。
   * 枠の位置はページの中身で決まるので、実測してその場所に重ねる。
   */
  useLayoutEffect(() => {
    if (mode !== "narrow") return;

    const measure = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const base = stage.getBoundingClientRect();
      const next: Partial<Record<HeroNarrowLayout["area"], Rect>> = {};
      for (const area of ["photo", "copy", "headline"] as const) {
        const el = stage.querySelector(`[data-cutout-area="${area}"]`);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        // 表示されていない枠は 0x0 で返るので飛ばす。
        // "copy" はスマホ（768px 未満）では出ないため、ここで落ちる
        if (r.width < 1) continue;
        next[area] = {
          left: r.left - base.left,
          top: r.top - base.top,
          width: r.width,
          height: r.height,
        };
      }
      setAreas(next);
    };

    measure();
    window.addEventListener("resize", measure);
    // 画像の読み込みで写真の高さが決まるので、少し待ってからもう一度測る
    const timer = setTimeout(measure, 600);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(timer);
    };
  }, [mode, narrowLayout]);

  const updatePc = useCallback((index: number, patch: Partial<HeroCutoutLayout>) => {
    setSave({ kind: "idle" });
    setPcLayout((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }, []);

  const updateNarrow = useCallback((index: number, patch: Partial<HeroNarrowLayout>) => {
    setSave({ kind: "idle" });
    setNarrowLayout((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }, []);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const index = Number(event.currentTarget.dataset.index);
    const stage = stageRef.current;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    drag.current = {
      index,
      pointerX: event.clientX,
      pointerY: event.clientY,
      basePc: mode === "pc" ? pcLayout[index] : undefined,
      baseNarrow: mode === "narrow" ? narrowLayout[index] : undefined,
      stage: { width: rect.width, height: rect.height },
      areaWidth: mode === "narrow" ? areas[narrowLayout[index].area]?.width : undefined,
    };
    setSelected(index);
    event.currentTarget.setPointerCapture(event.pointerId);
    event.preventDefault();
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const current = drag.current;
    if (!current) return;
    const dx = event.clientX - current.pointerX;
    const dy = event.clientY - current.pointerY;

    if (current.basePc) {
      const base = current.basePc;
      updatePc(current.index, {
        x: round(clampPosition(base.x + dx * percentPerPixelX(base, current.stage))),
        y: round(clampPosition(base.y + (dy * verticalSign(base) * 100) / current.stage.height)),
      });
      return;
    }

    const base = current.baseNarrow;
    if (!base) return;
    const width = current.areaWidth || current.stage.width;
    updateNarrow(current.index, {
      x: round(clampPosition(base.x + (dx * 100) / width)),
      // y は「枠の下端から上へ何 px」なので、下へ動かすほど減る
      y: Math.round(clampOffset(base.y - dy)),
    });
  };

  const handlePointerUp = () => {
    drag.current = null;
  };

  // 矢印キーで微調整。Shift で大きく動かす
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = Number(event.currentTarget.dataset.index);
    if (mode === "pc") {
      const item = pcLayout[index];
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
      updatePc(index, patch);
      return;
    }

    const item = narrowLayout[index];
    const stepX = event.shiftKey ? 1 : 0.1;
    const stepY = event.shiftKey ? 8 : 1;
    const moves: Record<string, Partial<HeroNarrowLayout>> = {
      ArrowLeft: { x: round(clampPosition(item.x - stepX)) },
      ArrowRight: { x: round(clampPosition(item.x + stepX)) },
      ArrowUp: { y: Math.round(clampOffset(item.y + stepY)) },
      ArrowDown: { y: Math.round(clampOffset(item.y - stepY)) },
    };
    const patch = moves[event.key];
    if (!patch) return;
    event.preventDefault();
    updateNarrow(index, patch);
  };

  const handleSave = async () => {
    setSave({ kind: "saving" });
    try {
      const response = await fetch("/api/fv-layout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "pc" ? { pc: pcLayout } : { narrow: narrowLayout }),
      });
      const body = await response.json();
      setSave(
        response.ok
          ? {
              kind: "saved",
              message: `src/content/hero-layout.ts を更新しました（${mode === "pc" ? "PC" : "1023px 以下"}）`,
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

  const isNarrow = mode === "narrow";
  const items: { id: string; label: string }[] = isNarrow
    ? narrowLayout.map((item) => ({
        // 同じ写真を置き場所ちがいで2件持てるので、名前に場所を添える
        id: `${item.id}-${item.area}`,
        label: `${heroNarrowCutouts[item.id].label}（${AREA_LABEL[item.area]}）`,
      }))
    : pcLayout.map((item) => ({ id: item.id, label: heroCutouts[item.id].label }));

  const code = isNarrow
    ? narrowLayout
        .map(
          (item) =>
            `  { id: "${item.id}", area: "${item.area}", x: ${item.x}, y: ${item.y}, width: ${item.width} },`,
        )
        .join("\n")
    : pcLayout
        .map(
          (item) =>
            `  { id: "${item.id}", xAnchor: "${item.xAnchor}", x: ${item.x}, yAnchor: "${item.yAnchor}", y: ${item.y}, width: ${item.width} },`,
        )
        .join("\n");

  const handleFocus = (event: React.FocusEvent<HTMLDivElement>) => {
    setSelected(Number(event.currentTarget.dataset.index));
  };

  /** つまみの見た目。選択中だけ濃く塗る */
  const handleClass = (index: number) =>
    `pointer-events-auto absolute cursor-grab touch-none rounded-md border-2 transition-colors active:cursor-grabbing ${
      selected === index
        ? "border-blue-600 bg-blue-500/15"
        : "border-blue-600/40 hover:bg-blue-500/10"
    }`;

  return (
    <div className="min-h-dvh bg-neutral-100 pb-64 text-ink">
      <header className="border-b-2 border-ink bg-white px-6 py-4">
        <h1 className="text-lg font-black">
          FV ダイカットの位置調整
          <span className="ml-3 rounded-full bg-ink px-3 py-1 align-middle text-xs text-white">
            {mode === "pc" ? "PC（1024px〜）" : "スマホ・タブレット（〜1023px）"}
          </span>
        </h1>
        <p className="mt-1 text-sm text-ink-soft">
          写真をドラッグして動かします。選択中は矢印キーで微調整、Shift + 矢印で大きく動きます。
          <strong className="ml-1 font-bold text-ink">
            編集する版はウィンドウ幅で切り替わります
          </strong>
          （スマホ・タブレット版を触るときは 1023px 以下まで狭めてください）。
          この画面は開発サーバーでだけ開けます。
        </p>
        {isNarrow && (
          <p className="mt-2 rounded-lg bg-sun px-3 py-2 text-sm font-bold">
            女の子と男の子（受験本）は元画像の辺が断ち切られています。
            女の子を左へ、男の子を右へ動かすと切り口の直線が出ます。上へ動かしても同じです。
            「男の子（ボード）」は 768px 以上でしか出ないので、それより狭いと選べません。
          </p>
        )}
      </header>

      <div ref={stageRef} className="relative">
        {/* 常時アニメーションで写真が数px 揺れると、つまみと写真がずれて見える。
            編集中だけ止める（本番の表示には影響しない） */}
        <style
          dangerouslySetInnerHTML={{
            __html: ".float-slow,.float-ground{animation:none!important}",
          }}
        />
        <Hero cutouts={pcLayout} narrowCutouts={narrowLayout} />

        {/* 写真とまったく同じ座標・比率で重ねる透明なつまみ。Hero 側は pointer-events-none */}
        {mode === "pc" && (
          <div className="pointer-events-none absolute inset-0 z-40 hidden lg:block">
            {pcLayout.map((item, index) => (
              <div
                key={item.id}
                role="button"
                tabIndex={0}
                data-index={index}
                aria-label={`${heroCutouts[item.id].label}を動かす`}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                className={`${handleClass(index)} ${heroCutouts[item.id].visibility}`}
                style={{ ...heroCutoutStyle(item), aspectRatio: heroCutouts[item.id].media.ratio }}
              >
                <Tag>{heroCutouts[item.id].label}</Tag>
              </div>
            ))}
          </div>
        )}

        {/* タブレットは「写真の上」「サブコピー右」の枠に重ねてから、その中に置く */}
        {isNarrow &&
          (["photo", "copy", "headline"] as const).map((area) => {
            const rect = areas[area];
            if (!rect) return null;
            return (
              <div
                key={area}
                className="pointer-events-none absolute z-40"
                style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
              >
                {narrowLayout.map((item, index) =>
                  item.area !== area ? null : (
                    <div
                      key={`${item.id}-${item.area}`}
                      role="button"
                      tabIndex={0}
                      data-index={index}
                      aria-label={`${heroNarrowCutouts[item.id].label}（${AREA_LABEL[item.area]}）を動かす`}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      onPointerCancel={handlePointerUp}
                      onKeyDown={handleKeyDown}
                      onFocus={handleFocus}
                      className={handleClass(index)}
                      style={{
                        ...heroNarrowCutoutStyle(item),
                        aspectRatio: heroNarrowCutouts[item.id].media.ratio,
                      }}
                    >
                      <Tag>{heroNarrowCutouts[item.id].label}</Tag>
                    </div>
                  ),
                )}
              </div>
            );
          })}
      </div>

      {/* 操作パネル。FV の下端に重なるので、既定では1行に収まる高さにしている */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-ink bg-white px-6 py-3">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-wrap items-end gap-x-4 gap-y-3">
            <div className="flex flex-wrap gap-1.5">
              {items.map((item, index) => (
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
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              {isNarrow ? (
                <>
                  <NumberField
                    label={`左端（${AREA_LABEL[narrowLayout[selected].area]}）`}
                    value={narrowLayout[selected].x}
                    onChange={(value) => updateNarrow(selected, { x: round(clampPosition(value)) })}
                  />
                  <NumberField
                    label="下端から(px)"
                    step={1}
                    value={narrowLayout[selected].y}
                    onChange={(value) =>
                      updateNarrow(selected, { y: Math.round(clampOffset(value)) })
                    }
                  />
                  <NumberField
                    label="幅"
                    value={narrowLayout[selected].width}
                    onChange={(value) =>
                      updateNarrow(selected, { width: round(clampWidth(value)) })
                    }
                  />
                </>
              ) : (
                <>
                  <NumberField
                    label={X_LABEL[pcLayout[selected].xAnchor]}
                    value={pcLayout[selected].x}
                    onChange={(value) => updatePc(selected, { x: round(clampPosition(value)) })}
                  />
                  <NumberField
                    label={pcLayout[selected].yAnchor === "bottom" ? "下端から" : "中心Y"}
                    value={pcLayout[selected].y}
                    onChange={(value) => updatePc(selected, { y: round(clampPosition(value)) })}
                  />
                  <NumberField
                    label="幅"
                    value={pcLayout[selected].width}
                    onChange={(value) => updatePc(selected, { width: round(clampWidth(value)) })}
                  />
                </>
              )}
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
                  setPcLayout(heroCutoutLayout);
                  setNarrowLayout(heroNarrowCutoutLayout);
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

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute -top-6 left-0 rounded bg-blue-600 px-1.5 py-0.5 text-[11px] font-bold whitespace-nowrap text-white">
      {children}
    </span>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 0.1,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}) {
  return (
    <label className="flex w-[6.5rem] flex-col gap-1 text-[11px] font-bold">
      {label}
      <input
        type="number"
        step={step}
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

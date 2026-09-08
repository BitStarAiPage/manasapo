import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * `/fv-editor` からの保存先。`src/content/hero-layout.ts` の配列にある
 * `x` / `y` / `width` の数値だけを、送られてきた順に書き換える。
 * コメント・型定義・`id` や「置き方」の指定（`xAnchor` / `area` など）には触れないので、
 * 位置の説明はファイルに残ったままになる。
 *
 * 書き換え範囲を配列の中に限っているのは、説明コメントにも同じ形の例文があるため。
 *
 * 対象は2つ：
 *   pc     … `heroCutoutLayout`（1024px 以上のダイカット3枚）
 *   narrow … `heroNarrowCutoutLayout`（1023px 以下の3枚。スマホ・タブレット共通）
 */

const LAYOUT_FILE = path.join(process.cwd(), "src/content/hero-layout.ts");

/** 書き換え対象の配列。キーは POST のボディのキーと対応する */
const ARRAYS = {
  pc: /(export const heroCutoutLayout: HeroCutoutLayout\[\] = \[)([\s\S]*?)(\n\];)/,
  narrow: /(export const heroNarrowCutoutLayout: HeroNarrowLayout\[\] = \[)([\s\S]*?)(\n\];)/,
} as const;

type Target = keyof typeof ARRAYS;

const ENTRY = /\{[^{}]*\}/g;

type Entry = { id: string; x: number; y: number; width: number };

const isEntry = (value: unknown): value is Entry => {
  if (typeof value !== "object" || value === null) return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.id === "string" &&
    ["x", "y", "width"].every(
      (key) => typeof entry[key] === "number" && Number.isFinite(entry[key]),
    )
  );
};

/** 1つの配列を書き換える。問題があればエラーメッセージを返す */
function rewrite(source: string, target: Target, entries: Entry[]): string | { error: string } {
  const pattern = ARRAYS[target];
  const array = source.match(pattern);
  if (!array) return { error: `hero-layout.ts の ${target} の配列が見つかりません` };

  const found = array[2].match(ENTRY) ?? [];
  if (found.length !== entries.length) {
    return {
      error: `hero-layout.ts の書き換え対象が ${found.length} 件で、送られた ${entries.length} 件と一致しません`,
    };
  }

  // 並び順がずれたまま書き込むと別の写真の位置を壊すので、id の一致を確かめる
  const mismatch = found.findIndex((entry, index) => !entry.includes(`"${entries[index].id}"`));
  if (mismatch >= 0) {
    return { error: `${mismatch + 1} 番目の写真が hero-layout.ts の並びと一致しません` };
  }

  let index = 0;
  return source.replace(pattern, (_match, open: string, body: string, close: string) => {
    const rewritten = body.replace(ENTRY, (entry) => {
      const value = entries[index++];
      return entry
        .replace(/\bx: -?[\d.]+/, `x: ${value.x}`)
        .replace(/\by: -?[\d.]+/, `y: ${value.y}`)
        .replace(/\bwidth: -?[\d.]+/, `width: ${value.width}`);
    });

    return open + rewritten + close;
  });
}

export async function POST(request: Request) {
  // 制作用の画面なので、公開ビルドでは書き込めないようにしておく
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "開発時のみ使用できます" }, { status: 404 });
  }

  const body: unknown = await request.json();
  if (typeof body !== "object" || body === null) {
    return NextResponse.json({ error: "受け取った値の形式が正しくありません" }, { status: 400 });
  }

  const payload = body as Partial<Record<Target, unknown>>;
  const targets = (Object.keys(ARRAYS) as Target[]).filter((key) => payload[key] !== undefined);
  if (targets.length === 0) {
    return NextResponse.json({ error: "書き換える対象が指定されていません" }, { status: 400 });
  }

  for (const target of targets) {
    const value = payload[target];
    if (!Array.isArray(value) || !value.every(isEntry)) {
      return NextResponse.json(
        { error: `${target} の値の形式が正しくありません` },
        { status: 400 },
      );
    }
  }

  let source = await readFile(LAYOUT_FILE, "utf8");
  for (const target of targets) {
    const result = rewrite(source, target, payload[target] as Entry[]);
    if (typeof result !== "string") return NextResponse.json(result, { status: 409 });
    source = result;
  }

  await writeFile(LAYOUT_FILE, source);
  return NextResponse.json({ ok: true });
}

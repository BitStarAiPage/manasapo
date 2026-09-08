import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

/**
 * `/fv-editor` からの保存先。`src/content/hero-layout.ts` の `heroCutoutLayout` 配列にある
 * `x` / `y` / `width` の数値だけを、送られてきた順に書き換える。
 * コメント・型定義・`id` / `xAnchor` / `yAnchor` には触れないので、
 * 位置の説明や「置き方」の指定はファイルに残ったままになる。
 *
 * 書き換え範囲を配列の中に限っているのは、説明コメントにも同じ形の例文があるため。
 */

const LAYOUT_FILE = path.join(process.cwd(), "src/content/hero-layout.ts");
const ARRAY = /(export const heroCutoutLayout: HeroCutoutLayout\[\] = \[)([\s\S]*?)(\n\];)/;
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

export async function POST(request: Request) {
  // 制作用の画面なので、公開ビルドでは書き込めないようにしておく
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "開発時のみ使用できます" }, { status: 404 });
  }

  const body: unknown = await request.json();
  if (!Array.isArray(body) || !body.every(isEntry)) {
    return NextResponse.json({ error: "受け取った値の形式が正しくありません" }, { status: 400 });
  }

  const source = await readFile(LAYOUT_FILE, "utf8");
  const array = source.match(ARRAY);
  if (!array) {
    return NextResponse.json(
      { error: "hero-layout.ts の heroCutoutLayout 配列が見つかりません" },
      { status: 409 },
    );
  }

  const found = array[2].match(ENTRY) ?? [];
  if (found.length !== body.length) {
    return NextResponse.json(
      {
        error: `hero-layout.ts の書き換え対象が ${found.length} 件で、送られた ${body.length} 件と一致しません`,
      },
      { status: 409 },
    );
  }

  // 並び順がずれたまま書き込むと別の写真の位置を壊すので、id の一致を確かめる
  const mismatch = found.findIndex((entry, index) => !entry.includes(`"${body[index].id}"`));
  if (mismatch >= 0) {
    return NextResponse.json(
      {
        error: `${mismatch + 1} 番目の写真が hero-layout.ts の並びと一致しません`,
      },
      { status: 409 },
    );
  }

  let index = 0;
  const updated = source.replace(ARRAY, (_match, open: string, entries: string, close: string) => {
    const rewritten = entries.replace(ENTRY, (entry) => {
      const value = body[index++];
      return entry
        .replace(/\bx: -?[\d.]+/, `x: ${value.x}`)
        .replace(/\by: -?[\d.]+/, `y: ${value.y}`)
        .replace(/\bwidth: -?[\d.]+/, `width: ${value.width}`);
    });

    return open + rewritten + close;
  });

  await writeFile(LAYOUT_FILE, updated);
  return NextResponse.json({ ok: true });
}

import type { Media } from "./media";

/**
 * 講師・スタッフ紹介。氏名・指導科目・趣味・メッセージ・顔写真はいずれも未支給のため、
 * 現状は空配列です。支給されたらここに追加すると `people` セクションに反映されます。
 */
export type Staff = {
  name: string;
  subjects: string;
  hobby: string;
  message: string;
  photo: Media;
};

export const staff: Staff[] = [];

/** 紹介文に必ず載せる項目（支給待ちの内訳をサイト上に示すために使用） */
export const staffProfileItems = [
  "名前",
  "指導科目",
  "趣味・マイブーム",
  "生徒へのメッセージ",
] as const;

/** 写真が未支給のあいだに並べる枠の数。人数を断定するものではありません。 */
export const staffPlaceholderCount = 4;

/**
 * 顔写真だけ先に支給されている状態のための一覧。
 * 氏名・指導科目・趣味・メッセージが揃ったら `staff` に移してください。
 *
 * ★ これらは AI 生成の人物画像（ChatGPT）で、実在の講師・スタッフではありません。
 * `public/images/staff/` に、人物の高さを揃えて書き出し直したものを置いています。
 */
export const staffPlaceholderPhotos: Media[] = [
  { src: "/images/staff/staff-01.webp", alt: "講師・スタッフ", label: "講師・スタッフの写真", ratio: "24 / 25" },
  { src: "/images/staff/staff-02.webp", alt: "講師・スタッフ", label: "講師・スタッフの写真", ratio: "24 / 25" },
  { src: "/images/staff/staff-03.webp", alt: "講師・スタッフ", label: "講師・スタッフの写真", ratio: "24 / 25" },
  { src: "/images/staff/staff-04.webp", alt: "講師・スタッフ", label: "講師・スタッフの写真", ratio: "24 / 25" },
];

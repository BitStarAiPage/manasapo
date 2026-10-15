import type { Media } from "./media";

/**
 * 講師・スタッフ紹介。2026-10 の修正指示の原文のまま（指導科目の「５」も全角のまま）。
 *
 * - 趣味・メッセージは届いている人だけ書く。無い人は項目ごと出さない
 * - 写真は届いている6人分だけ `src` がある（瀬尾さん・仁平さんは 2026-10-15 に追加）。
 *   `src` が無い人は「COMING SOON」の枠を出す（StaffAvatar）
 * - 写真は macOS の Vision で背景を抜き、既存素材と同じ 1200x1250 にそろえたもの（public/images/photos/staff/）。
 *   頭の上端を画像の上端近くに置いているので、円の上から頭が飛び出す
 */
export type Staff = {
  name: string;
  /** 役職。名前の後ろに小さく添える */
  role?: string;
  subjects: string;
  hobby?: string;
  message?: string;
  photo: Media;
  /**
   * 飛び出しレイヤーの右側を何%隠すか（StaffAvatar の popoutRight）。
   * 頭の高さで円の外に手などが出ている写真だけに指定する
   */
  popoutRight?: number;
};

/**
 * 円から頭を飛び出させる深さ（StaffAvatar の popoutClip）。全員で共通にしている。
 * 4枚のアルファを走査し「この行で人物が円の内側に収まる」範囲を実測した：
 *   岩松 15.8〜73.0% / 桑嶋 21.7〜92.3% / 藤原 16.1〜41.4% / 佐々木 15.0〜35.1%
 * 全員に入る 25% を採用。範囲内ならどの値でも見た目は同じ（円の内側では2枚のレイヤーが重なるだけ）。
 * 範囲の外にすると、頭の横が切り取り線で水平に切れて見える。
 *
 * ★ 瀬尾さんの元写真は自撮りで、左肩が写真の左端で切れ、右肩は後ろの人と重なっていた。
 *   左は肩の線を延ばして紺で塗り足し、右は肩の形に沿って手で範囲を足してある。
 *   写真の下端が円の下端に届くよう、ほかの人より少し大きく・低めに置いている（頭の飛び出しは浅い）。
 *
 * ★ 桑嶋さんの元写真は斜め上からのカットで体が右下へ約30°傾いていたため、
 *   切り抜きを時計回りに30°回して起こしてある（そのままだと体が円の右へ寄り、上着が円からはみ出した）。
 *   回したことで元写真の下端の切り口が斜めになるので、人物の高さの 80% で下を切り、円の下端に隠している。
 *   差し替えたら範囲を測り直すこと。
 */
export const STAFF_POPOUT_CLIP = 25;

const photo = (src: string | undefined, name: string): Media => ({
  src,
  alt: src ? `講師 ${name}` : "",
  label: "講師・スタッフの写真",
  ratio: "24 / 25",
});

export const staff: Staff[] = [
  {
    name: "瀬尾ようすけ",
    role: "まなサポ代表・教室長",
    subjects: "小中→５教科・高校→国・数・理",
    hobby: "野球・アウトドアスポーツ・料理",
    message: "学ぶ力は生き抜く力！！一緒にまなサポで身につけよう！！",
    photo: photo("/images/photos/staff/seo.webp", "瀬尾ようすけ"),
  },
  {
    name: "岩松ゆめか",
    role: "副教室長",
    subjects: "小中→５教科・高校→英・数",
    hobby: "写真・音楽を聴くこと（川崎鷹也大好き！）",
    message: "みんなの笑顔が大好きです！！一緒に笑顔の授業をしましょう！！",
    photo: photo("/images/photos/staff/iwamatsu.webp", "岩松ゆめか"),
  },
  {
    name: "桑嶋けいたつ",
    subjects: "小中→５教科・高校→数",
    photo: photo("/images/photos/staff/kuwashima-upright.webp", "桑嶋けいたつ"),
  },
  {
    name: "藤原のりひろ",
    subjects: "小中→５教科・高校→数・英",
    photo: photo("/images/photos/staff/fujiwara.webp", "藤原のりひろ"),
  },
  {
    name: "佐々木ゆうか",
    subjects: "小中→５教科",
    photo: photo("/images/photos/staff/sasaki.webp", "佐々木ゆうか"),
  },
  { name: "樽川みやび", subjects: "小中→５教科", photo: photo(undefined, "樽川みやび") },
  {
    name: "中林りょう",
    subjects: "小中→５教科・高校→数・英",
    photo: photo(undefined, "中林りょう"),
  },
  {
    name: "仁平とうま",
    subjects: "小中→５教科・高校→社",
    photo: photo("/images/photos/staff/nihira.webp", "仁平とうま"),
    // 掲げた右の拳が頭と同じ高さで円の右外にある。飛び出しレイヤーに残すと
    // 腕から切り離された拳だけが浮くので、右側を切って頭だけを出す
    popoutRight: 24,
  },
  { name: "村崎ともや", subjects: "小中→５教科・高校→理", photo: photo(undefined, "村崎ともや") },
];

/**
 * 写真の差し替えはこのファイルだけで完結します。
 *
 * ★ `/images/from-current-site/` の4枚は現行サイト
 *   （https://sites.google.com/view/manasapo/ホーム）から取得したものですが、
 *   2026-09-04 に支給された写真と同一カットであることを確認済みです（＝実写真）。
 *   支給版はトリミング済みの低解像度スクショだったため、こちらの高解像度版を使います。
 *   - teaching.jpg    … ホワイトボードで説明しながら生徒と話す（対話が写る唯一のカット）
 *   - group-study.jpg … マーカーを渡しながら生徒2人とやりとり
 *   - classroom.jpg   … 生徒2人が黙々と学習（縦構図）
 *   - whiteboard.jpg  … ホワイトボードに書く生徒の笑顔（hero-cutout.webp の元カット）
 *   同じ写真を複数箇所で使い回している状態です。
 *
 * ★ `/images/` 直下の room-*.jpg は 2026-09-04 支給の教室内観（人物なし）。まだ未使用。
 *   study-pair / teaching-whiteboard / desk-talk / whiteboard-smile は上記4枚と重複。
 *
 * - `src` に `/images/...` のパスを入れると実写真が表示されます（ファイルは `public/images/` に置く）。
 * - `src` が未設定のあいだは、同じ縦横比のプレースホルダー枠が表示されレイアウトは崩れません。
 * - `label` は写真が未支給のときだけ枠内に出る「入れる予定の内容」で、サイトの本文ではありません。
 * - `focus` は `object-position` の値。顔やホワイトボードが切れるときに調整します。
 */
export type Media = {
  src?: string;
  alt: string;
  label: string;
  /** CSS の aspect-ratio 値（例: "4 / 3"） */
  ratio: string;
  focus?: string;
};

type MediaKey =
  | "heroMain"
  | "heroCutout"
  | "heroCutoutRight"
  | "heroWhiteboard"
  | "philosophy"
  | "courseJunior"
  | "courseSenior"
  | "case01"
  | "message"
  | "classroom";

export const media: Record<MediaKey, Media> = {
  // ★ これは AI 生成画像（ChatGPT）です。まなサポの実際の講師・生徒・教室ではありません。
  //    実写真が用意できたら差し替えてください。
  heroMain: {
    src: "/images/hero-teacher-student.jpg",
    alt: "参考書を開いて生徒に説明する講師",
    label: "生徒と講師が対話している写真",
    ratio: "3 / 2",
  },
  /**
   * FV 前面に重ねる切り抜き（透過PNG/WebP）。黄色い縁取りが自動で付きます。
   * `ratio` は写真そのものの比率ではなく「置き場所の箱」の比率です。
   * 人物が大きすぎる／小さすぎるときはここと Hero の幅指定で調整します。
   */
  heroCutout: {
    src: "/images/hero-cutout-lesson.webp",
    alt: "問題用紙を指しながら生徒に説明する講師",
    label: "切り抜き写真（透過PNG）",
    ratio: "4 / 3",
  },
  /**
   * FV 右端にもう1枚重ねる切り抜き。
   * この写真は元画像の時点で右端・下端が断ち切られているため、宙に浮かせると
   * 縁取りに直線が出る。右にはみ出させ、下は画面下端に接地させて切り口を逃がしている。
   */
  heroCutoutRight: {
    src: "/images/students/student-04.webp",
    alt: "ポーズをとる生徒",
    label: "切り抜き写真（透過PNG）",
    ratio: "1080 / 1031",
  },
  heroWhiteboard: {
    src: "/images/from-current-site/group-study.jpg",
    alt: "生徒とマーカーをやりとりしながら話す講師",
    label: "ホワイトボードに書く写真",
    ratio: "4 / 3",
  },
  philosophy: {
    src: "/images/from-current-site/whiteboard.jpg",
    alt: "ホワイトボードに考えを整理して書き出す生徒",
    label: "自分で考え、整理する生徒の写真",
    ratio: "4 / 3",
  },
  courseJunior: {
    src: "/images/from-current-site/group-study.jpg",
    alt: "小・中学生への個別指導の様子",
    label: "小・中学生への指導写真",
    ratio: "3 / 2",
  },
  courseSenior: {
    src: "/images/from-current-site/classroom.jpg",
    alt: "高校生が学習している様子",
    label: "高校生の学習写真",
    ratio: "3 / 2",
  },
  case01: {
    src: "/images/from-current-site/whiteboard.jpg",
    alt: "ホワイトボード一面にテスト範囲をまとめる生徒",
    label: "「呪い」勉強法のホワイトボード写真",
    ratio: "3 / 2",
  },
  message: {
    src: "/images/from-current-site/classroom.jpg",
    alt: "まなサポの教室",
    label: "瀬尾さん、または教室の写真",
    ratio: "4 / 3",
  },
  classroom: {
    src: "/images/from-current-site/classroom.jpg",
    alt: "まなサポ教室の内観",
    label: "教室の内観・入口の写真",
    ratio: "4 / 3",
  },
};

/** 「最近のまなサポ」の写真枠。投稿本文・日付・URL は未支給。 */
export const updateMedia: Media[] = [
  {
    src: "/images/from-current-site/group-study.jpg",
    alt: "机を囲んで学習する生徒たち",
    label: "教室の様子",
    ratio: "3 / 2",
  },
  {
    src: "/images/from-current-site/whiteboard.jpg",
    alt: "ホワイトボードに書きながら学習する生徒",
    label: "学習の様子",
    ratio: "3 / 2",
  },
  { alt: "イベントの様子", label: "イベント", ratio: "3 / 2" },
];

/** 「まなサポの特徴」01〜04 に添える写真枠。 */
export const featureMedia: Media[] = [
  {
    src: "/images/from-current-site/teaching.jpg",
    alt: "最大1対2の個別指導の様子",
    label: "個別指導の写真",
    ratio: "4 / 3",
  },
  {
    src: "/images/from-current-site/whiteboard.jpg",
    alt: "勉強法を相談している様子",
    label: "勉強法の相談の写真",
    ratio: "4 / 3",
  },
  {
    src: "/images/from-current-site/group-study.jpg",
    alt: "スタッフが生徒の様子を共有している場面",
    label: "スタッフ連携の写真",
    ratio: "4 / 3",
  },
  // 合宿・イベントの写真は現サイトに無いため支給待ち
  { alt: "合宿やイベントの様子", label: "教室外の活動の写真", ratio: "4 / 3" },
];

/**
 * 【別案 FV（/alt）】tabio の FV 構成を踏襲した「写真3枚＋切り抜き3つ」。
 * 写真は横並びのバンドを作り、その上に切り抜きが立つ。
 */
export const heroAltPhotos: Media[] = [
  {
    src: "/images/from-current-site/teaching.jpg",
    alt: "ホワイトボードで説明しながら生徒と話す様子",
    label: "対話している写真",
    ratio: "3 / 2",
    focus: "35% 40%",
  },
  {
    src: "/images/from-current-site/classroom.jpg",
    alt: "生徒2人が並んで学習している様子",
    label: "自習している写真",
    ratio: "3 / 2",
    focus: "50% 45%",
  },
  {
    src: "/images/room-booth.jpg",
    alt: "仕切りで区切られた学習ブース",
    label: "教室の写真",
    ratio: "3 / 2",
    focus: "50% 60%",
  },
];

/**
 * 別案 FV に重ねる切り抜き3つ。背景透過の PNG/WebP が必要です。
 * 未支給のあいだは同じ位置に枠だけ出るので、構図の確認はできます。
 * 作り方: Finder で写真を右クリック →「クイックアクション」→「背景を削除」
 */
export const heroAltCutouts: Media[] = [
  {
    src: "/images/from-current-site/hero-cutout.webp",
    alt: "ホワイトボードに書きながら笑う生徒",
    label: "切り抜き①",
    ratio: "1000 / 787",
  },
  { alt: "生徒の切り抜き", label: "切り抜き②", ratio: "5 / 4" },
  { alt: "講師の切り抜き", label: "切り抜き③", ratio: "5 / 4" },
];

/**
 * FV の黄色い余白に散らす、円入りの生徒カット（実写・背景透過）。
 *
 * `popoutClip` は「飛び出しレイヤーを上から何%残すか」。
 * 各画像のアルファを走査し、人物の輪郭が円の内側に完全に収まる最も低い行を実測した：
 *   student-01 = 65.3% / student-02 = 49.2% / student-03 = 26.9%
 * 3枚を同じ値で扱うため、最も浅い 26.9% より上の 25% を採用している。
 * 頭は円の上端から出て、顔から下は円の中に収まる。
 */
export const heroBadgeMedia: (Media & { popoutClip: number })[] = [
  {
    src: "/images/students/student-01.webp",
    alt: "ホワイトボードを持って笑う生徒",
    label: "生徒の切り抜き",
    ratio: "24 / 25",
    popoutClip: 25,
  },
  {
    src: "/images/students/student-02.webp",
    alt: "大学受験案内を手にした生徒",
    label: "生徒の切り抜き",
    ratio: "24 / 25",
    popoutClip: 25,
  },
  {
    src: "/images/students/student-03.webp",
    alt: "笑っている生徒",
    label: "生徒の切り抜き",
    ratio: "24 / 25",
    popoutClip: 25,
  },
];

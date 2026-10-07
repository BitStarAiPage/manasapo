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
 * ★ `/images/` 直下の room-*.jpg は 2026-09-04 支給の教室内観（人物なし・実写真）。
 *   トップページでは現在どれも使っていない（生成画像に置き換わったため）。
 *   room-booth だけ別案FV（/alt）で使用。実写真に戻したくなったときの候補として残す。
 *   study-pair / teaching-whiteboard / desk-talk / whiteboard-smile は上記4枚と重複。
 *
 * ★★ 次の画像は AI 生成（ChatGPT）です。まなサポの実際の講師・生徒・教室ではありません。
 *   実写真が届いたら差し替えてください（2026-09-08 にユーザー確認済み）。
 *   - hero-lesson-three.webp / hero-teacher-student.jpg … FV の写真パネル
 *   - staff/*.webp, students/*.webp … 講師・生徒の切り抜き
 *   - updates-room.png / updates-study.png / updates-event.png … 最近のまなサポ
 *   - access-classroom.png … 教室・アクセス
 *   - course-junior.png / course-senior.png … コース紹介
 *   - feature-lesson / feature-method / feature-team / feature-ski.png … まなサポの特徴
 *   - changes-case01.png … 生徒の変化 CASE 01
 *   alt は「まなサポの〜」と断定せず、写っている場面をそのまま書くこと
 *   （実在の教室・人物だと読み上げてしまわないため）。
 *
 * - `src` に `/images/...` のパスを入れると実写真が表示されます（ファイルは `public/images/` に置く）。
 * - `src` が未設定のあいだは、同じ縦横比のプレースホルダー枠が表示されレイアウトは崩れません。
 * - `label` は写真が未支給のときだけ枠内に出る「入れる予定の内容」で、サイトの本文ではありません。
 * - `focus` は `object-position` の値。顔やホワイトボードが切れるときに調整します。
 *
 * ★ 2026-10 に先方から実写真が届き、`/images/photos/` に置いて差し替えた。
 *   元ファイルは「まなサポ様提供画像共有用画像.zip」（HEIC/HEIF）。長辺 1400〜2400px の JPEG に変換している。
 *   FV の切り抜き（hero-*.webp）と講師（staff/*.webp）は macOS の Vision で背景を抜いたもの。
 *   差し替えで使わなくなった AI 生成画像も `/images/` 直下に残してある。
 */
export type Media = {
  src?: string;
  alt: string;
  label: string;
  /** CSS の aspect-ratio 値（例: "4 / 3"） */
  ratio: string;
  focus?: string;
  /**
   * `src` が無いときに出す枠の種類。
   * - 省略   … 「写真準備中」の点線枠
   * - "person" … 人型のシルエット。人物写真の支給待ちだと一目で分かるようにする
   */
  placeholder?: "person";
  /**
   * 枠への収め方。省略時は枠いっぱいに切り抜く（cover）。
   * "contain" … 端を切らずに全体を収め、余白は白で埋める。イラストなど切れると困る画像用
   */
  fit?: "contain";
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
    src: "/images/hero-lesson-three.webp",
    alt: "机を囲んで学習する2人の生徒と、笑顔で見守る講師",
    label: "生徒と講師が対話している写真",
    ratio: "3 / 2",
    // PC では縦長に切り抜かれるので、講師の顔が中央に残る位置へ寄せる
    focus: "50% 45%",
  },
  /**
   * ★ 現在この写真は FV では使っていません（授業カットを外し、生徒の切り抜きに置き換えたため）。
   *   戻したくなったときのために残しています。
   *
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
   * FV 右端に重ねる切り抜き。
   * この写真は元画像の時点で右端・下端が断ち切られているため、宙に浮かせると
   * 縁取りに直線が出る。右にはみ出させ、下は FV の下端に接地させて切り口を逃がしている。
   * ★ この置き方が前提の写真なので、動かすときは切り口が出ないか必ず確認すること。
   */
  heroCutoutRight: {
    src: "/images/photos/hero-girl-drink.webp",
    alt: "缶ジュースを手に笑う生徒",
    label: "切り抜き写真（透過PNG）",
    ratio: "1000 / 1139",
  },
  heroWhiteboard: {
    src: "/images/from-current-site/group-study.jpg",
    alt: "生徒とマーカーをやりとりしながら話す講師",
    label: "ホワイトボードに書く写真",
    ratio: "4 / 3",
  },
  /**
   * 支給写真「IMG_8018」。元は 1350x1800 の縦長で、4/3 の枠には高さの 56% しか入らない。
   * 顔からノートまでが残る位置に寄せている。
   */
  philosophy: {
    src: "/images/photos/philosophy-study.jpg",
    alt: "ノートに向かって問題を解く生徒",
    label: "自分で考え、整理する生徒の写真",
    ratio: "4 / 3",
    focus: "50% 38%",
  },
  /** コース紹介の2枚。支給写真「中学生指導風景」「高校生指導風景(1)」 */
  courseJunior: {
    src: "/images/photos/course-junior.jpg",
    alt: "並んで座り、話しながら学習する2人の生徒",
    label: "小・中学生への指導写真",
    ratio: "3 / 2",
  },
  /**
   * 指示書の文言は「高校生指導風景」だが、添えられていた写真はホワイトボードで説明するカット
   * ＝ファイル名「高校生指導風景(1)」の方。「高校生指導風景」は特徴 01 に使っている。
   * 縦長（1350x1800）なので、講師の顔とホワイトボードが残る位置に寄せている。
   */
  courseSenior: {
    src: "/images/photos/course-senior.jpg",
    alt: "ホワイトボードを使って説明する講師と、話を聞く高校生",
    label: "高校生の学習写真",
    ratio: "3 / 2",
    focus: "50% 42%",
  },
  /**
   * 「生徒の変化」の写真。支給写真「自習の様子」。
   * 元画像は 1350x1800 の縦長で、3/2 の枠には高さの 50% しか入らない。
   * 顔から手元のノートまでが残る位置に寄せている。
   */
  case01: {
    src: "/images/photos/changes-case01.jpg",
    alt: "机に向かってノートに書き込む生徒",
    label: "自習する生徒の写真",
    ratio: "3 / 2",
    focus: "50% 52%",
  },
  /**
   * 「塾に込めた思い（"学ぶ力"は"生きる力"！）」に添える写真。
   *
   * ★ 瀬尾さんご本人の写真は未支給。ここに AI 生成の指導カットを置くと
   *   ご本人の写真だと誤解されるため、人型の空欄にしている。
   *   写真が届いたら `src` を入れるだけで表示に切り替わる。
   */
  message: {
    alt: "瀬尾さんの写真",
    label: "瀬尾さんの写真",
    ratio: "4 / 3",
    placeholder: "person",
  },
  /**
   * 教室・アクセスの写真。教室全体が入る引きのカットにしている
   * （2026-09-08 支給の AI 生成画像。それまでは実写真の room-booth.jpg を置いていた）。
   *
   * 元画像は 1085x1450 の縦長で、4/3 の枠には高さの 56% しか入らない。
   * 上は天井なので、机と本棚が残る位置へ下げている。
   */
  classroom: {
    src: "/images/access-classroom.png",
    alt: "机とホワイトボード、本棚が並ぶ教室",
    label: "教室の内観・入口の写真",
    ratio: "4 / 3",
    focus: "50% 62%",
  },
};

/**
 * FV の写真パネル。配列に2枚以上入れると数秒ごとにクロスフェードしますが、
 * 2026-09-08 のユーザー指示で **1枚だけ** にしています（切り替えは止まります）。
 * 増減はこの配列だけで完結します。
 *
 * 支給写真「トップ画像」（2400x1800）。PC では縦長に切り抜かれるので、2人の顔が残る位置に寄せている。
 */
export const heroPanelPhotos: Media[] = [
  {
    src: "/images/photos/hero-top.jpg",
    alt: "テキストを開いて笑顔で話す生徒と講師",
    label: "生徒と講師が対話している写真",
    ratio: "4 / 3",
    focus: "55% 50%",
  },
];

/**
 * 「最近のまなサポ」の写真枠。投稿本文・日付・URL は未支給。
 *
 * 1枚目「教室の様子」と3枚目「イベント」は 2026-10 支給の実写真（教室全体の様子／イベント風景）。
 * ★ 2枚目「学習の様子」だけは 2026-09-08 支給の AI 生成画像（ChatGPT）のまま。
 *
 * 枠は横長の 3/2 で、写真はどれも縦長なので上下が切れる（focus で見せたい高さに寄せている）。
 */
export const updateMedia: Media[] = [
  {
    src: "/images/photos/updates-classroom.jpg",
    alt: "仕切りのある机に分かれて、それぞれ学習する生徒たち",
    label: "教室の様子",
    ratio: "3 / 2",
    // 1050x1400 の縦長。天井を外して、机に向かう生徒が並ぶ高さへ下げる
    focus: "50% 70%",
  },
  {
    src: "/images/updates-study.png",
    alt: "プリントに向かって問題を解く2人の生徒",
    label: "学習の様子",
    ratio: "3 / 2",
    // 3/2 に切ると元画像の高さの 48% しか出ない。手前の生徒の頭（上から 35%）から
    // 手元（同 81%）までが入るのがこのあたり
    focus: "50% 58%",
  },
  {
    src: "/images/photos/updates-event.jpg",
    alt: "大きな机を囲んで食事をする生徒たち",
    label: "イベント",
    ratio: "3 / 2",
    // 1050x1400 の縦長。机を囲む生徒が入る高さへ下げる
    focus: "50% 68%",
  },
];

/**
 * 「まなサポの特徴」01〜04 に添える写真。並び順は `src/content/features.ts` と対応する。
 * 2026-10 支給の写真・イラスト。写真はどれも 1050x1400 の縦長で、4/3 の枠には高さの 56% しか入らない。
 */
export const featureMedia: Media[] = [
  {
    // 01 学びの土台となる「基本」を盤石にする（支給写真「高校生指導風景」）
    src: "/images/photos/feature-lesson.jpg",
    alt: "生徒の手元をのぞき込んで教える講師",
    label: "個別指導の写真",
    ratio: "4 / 3",
    focus: "50% 50%",
  },
  {
    // 02 一人ひとりに合う「学び方」を一緒につくる（支給写真「勉強方法の指導風景」）
    src: "/images/photos/feature-method.jpg",
    alt: "向かい合ってプリントを見ながら話す生徒と講師",
    label: "勉強法の相談の写真",
    ratio: "4 / 3",
    focus: "50% 50%",
  },
  {
    // 03 担当講師＋チームまなサポ全員でサポート（支給イラスト「スタッフ連携の画像」）
    // 正方形のイラストで、上下を切ると生徒や講師陣が欠けるので全体を収める
    src: "/images/photos/feature-team.jpg",
    alt: "生徒と担当講師が指導でやりとりし、担当講師とまなサポ講師陣が情報共有・下支えする関係図",
    label: "スタッフ連携の写真",
    ratio: "4 / 3",
    fit: "contain",
  },
  {
    // 04 塾の中だけで終わらない、学びと挑戦をつくる（支給写真「合宿の様子・イベント」）
    src: "/images/photos/feature-camp.jpg",
    alt: "合宿の会場で机を囲んで勉強する生徒たち",
    label: "教室外の活動の写真",
    ratio: "4 / 3",
    focus: "50% 60%",
  },
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
/**
 * ★ 現在 FV に置いているのは 0・1 の2枚（どちらも男の子・2026-10 支給の実写真）です。
 *   2（student-03）は未使用ですが、輪郭が一周つながっている扱いやすい一枚なので残しています。
 *   ダイカットは見出しやリード文にかぶらない位置にだけ置く方針なので、
 *   増やすときは置き場所の余白があるか `/fv-editor` で確かめてください。
 */
export const heroBadgeMedia: (Media & { popoutClip: number })[] = [
  /**
   * ★ 2026-10 に FV の切り抜きを支給写真に差し替えた（下の2枚＋ heroCutoutRight）。
   *   どれも机に向かう場面を切り抜いたもので、断ち切られている辺が違う。置き場所はそれに合わせている：
   *   - 0: IMG_6807（書き物をする生徒）… 右辺（背中）が断ち切りだったので、楕円で丸めて輪郭にした。
   *        一周つながっているので、宙に置ける「男の子（ボード）」の枠に入れている
   *   - 1: 自習中の様子（手を振る生徒）… 左辺と下辺が断ち切り。左端の画面外へ逃がす枠に入れている
   *   これで指示書の並び（IMG_6807／自習中の様子）とは左右が入れ替わっている。
   *   円入りのバッジ（popoutClip）としては現在使っていない。
   */
  {
    src: "/images/photos/hero-boy-desk.webp",
    alt: "ペンを持ってノートに書き込む生徒",
    label: "生徒の切り抜き",
    ratio: "1000 / 939",
    popoutClip: 25,
  },
  {
    src: "/images/photos/hero-boy-wave.webp",
    alt: "笑顔で手を振る生徒",
    label: "生徒の切り抜き",
    ratio: "1000 / 1194",
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

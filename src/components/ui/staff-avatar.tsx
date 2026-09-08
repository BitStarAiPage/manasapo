import Image from "next/image";
import type { Media } from "@/content/media";
import { PersonMarkInCircle } from "@/components/ui/person-mark";

/**
 * 「白い円の中から人物が立体的に飛び出す」表現。講師紹介と FV のバッジで共用する。
 *
 * 同じ人物画像を、位置もサイズも完全に揃えて2枚重ねている：
 *
 *   1. 円の中のレイヤー … overflow:hidden の白い円の中。胴体の下側が円の形に切られる。
 *   2. 飛び出すレイヤー … 同じ画像を円の手前に重ね、clip-path で下側を隠す。
 *                         残るのは頭・髪・上げた手だけなので、そこだけが円の外に出る。
 *
 * 2枚は同じ absolute 指定（PERSON_BOX）を共有するのでピクセル単位で一致する。
 * 円の内側では両者が完全に重なって継ぎ目が出ず、外側では 2 のクリップだけが効く。
 *
 * ■ 数値はすべて円の直径 D に対する比率。画面幅が変わっても崩れない。
 * - 飛び出し量 15% … PC の講師紹介で約36px、FV のバッジで約24px。
 * - 左右 -10% … object-contain が必ず「高さ基準」で収まるようにするための余裕。
 *   横基準で収まると人物が縮み、顔の高さが揃わなくなる。
 *   ★ 条件は「箱の縦横比 ≧ 画像の縦横比」。この箱は 120% × 115% で 1.043、
 *     支給画像は 1200x1250 の 0.960 なので余裕がある。
 *     横長（1.05 超）の写真を入れると横基準に変わって人物が縮むので、そのときはここを広げる。
 *   ★ 以前は -30% だったが、円からはみ出した箱が画面の外まで届いて
 *     横スクロールが出ていた（1440px で 16px / SP で 29px）。
 *     -10% でも object-contain の結果は同じで、はみ出しだけが消える。
 * - popoutClip … 下から何%を隠すか。下記の理由で画像ごとに変える。
 */

/** 2枚に共通の配置。ここを変えると上下2レイヤーが同時に動く。 */
const PERSON_BOX = "absolute inset-x-[-10%] top-[-15%] bottom-0";

export function StaffAvatar({
  media,
  sizes = "(max-width: 1024px) 45vw, 22vw",
  popoutClip = 70,
  outlined = false,
}: {
  media: Media;
  sizes?: string;
  /**
   * 円と飛び出した頭をひとつの塊として縁取る（FV のバッジ用）。
   * 飛び出しレイヤーだけに掛けると、clip-path の切断面にも縁が回って線が途切れて見える。
   * 外側のまとまりに掛ければ、円のふちと頭の輪郭が一本の線でつながる。
   */
  outlined?: boolean;
  /**
   * 飛び出しレイヤーを上から何%残すか。
   *
   * ここを深くしすぎると、人物の輪郭が円からはみ出したまま切られて直線の切り口が出る。
   * 各画像のアルファを走査して「輪郭が円の内側に完全に収まる最も低い行」を実測し、
   * それより浅い値を渡すこと（実測値は content 側のコメントに残してある）。
   */
  popoutClip?: number;
}) {
  // 写真が未支給のあいだは人型のシルエットに置き換える。
  // 「円から人が出ている」表現はこの塾の見せ方の要なので、枠だけにせず頭を出す。
  // シルエットは実写真と違い、円との位置関係を自分で持っている（PersonMarkInCircle の
  // viewBox が「円＋上の余白」ぶんある）ので、写真用の PERSON_BOX は使わない。
  const person = media.src ? (
    <Image
      src={media.src}
      alt={media.alt}
      fill
      sizes={sizes}
      className="object-contain object-bottom"
    />
  ) : null;

  // 写真が未支給のときの枠。円の中で切る層と、円から出る頭の層に分けるのは実写真と同じ。
  // 切り取りの位置（上から 30%）は、頭の切り口が円の内側に収まる深さで決めている。
  if (!media.src) {
    return (
      <div className="overflow-visible pt-[15%]">
        <div className="relative">
          <div className="relative aspect-square overflow-hidden rounded-full border-2 border-dashed border-mint-deep bg-white">
            <div className="absolute inset-x-0 top-[-15%] bottom-0">
              <PersonMarkInCircle />
            </div>
          </div>

          <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
            <div
              className="absolute inset-x-0 top-[-15%] bottom-0"
              style={{ clipPath: "inset(0 0 70% 0)" }}
            >
              <PersonMarkInCircle />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    // 飛び出す頭のぶんだけ上に余白を取り、カード上部で切れないようにする
    <div className="overflow-visible pt-[15%]">
      <div className={`relative overflow-visible ${outlined ? "cutout-outline" : ""}`}>
        {/* 1. 円の中。ここだけ overflow-hidden で、人物の下側を円の形に切る */}
        <div className="relative aspect-square overflow-hidden rounded-full bg-white">
          <div className={PERSON_BOX}>{person}</div>
        </div>

        {/* 2. 円から飛び出す部分。1 と同じ位置・サイズで重ね、下側を隠す */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
          <div className={PERSON_BOX} style={{ clipPath: `inset(0 0 ${100 - popoutClip}% 0)` }}>
            <Image
              src={media.src!}
              alt=""
              fill
              sizes={sizes}
              className="object-contain object-bottom"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

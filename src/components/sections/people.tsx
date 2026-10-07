import { STAFF_POPOUT_CLIP, staff } from "@/content/staff";
import { REVEAL_STAGGER_MS, floatStyle, revealStyle } from "@/lib/reveal";
import { StaffAvatar } from "@/components/ui/staff-avatar";
import { Wrap } from "@/components/ui/wrap";

/**
 * アバターの登場。並んだ順に 120ms ずつずらして出す。
 * 真下からだけ動かす理由は呼び出し側のコメントを参照。
 */
const avatarReveal = (index: number) => ({
  y: 30,
  scale: 0.98,
  durationMs: 750,
  delayMs: index * REVEAL_STAGGER_MS,
});

/**
 * 登場したあとも、ひとりずつ違う速さでゆっくり浮き続ける。
 *
 * 傾けない（tilt: 0）のは、円から頭が飛び出す作りの都合で要素が枠の外まで
 * 広がっており、回すと右端の1人が画面の外へ出て横スクロールが増えるため。
 */
const AVATAR_FLOAT = [
  { durationSec: 5.4, delaySec: 0 },
  { durationSec: 6.2, delaySec: 0.8 },
  { durationSec: 5.8, delaySec: 1.5 },
  { durationSec: 6.6, delaySec: 0.4 },
];

const avatarFloat = (index: number) => {
  const { durationSec, delaySec } = AVATAR_FLOAT[index % AVATAR_FLOAT.length];
  return floatStyle(durationSec, delaySec, { rise: -6, tilt: 0 });
};

export function People() {
  // overflow-x-clip は、アバターの張り出し（StaffAvatar の inset-x）が
  // 画面の外へ出て横スクロールを作るのを止めるため。
  // 張り出し量は円のサイズに比例し、ページの左右余白は固定なので、
  // 割合を詰めるだけでは幅しだいでまた追い越す（460px あたりから発生する）。
  // 円の外に人物の絵は出ていないので、切り取っても見た目は変わらない。
  // 頭が円の上に飛び出すぶんは overflow-y が visible のままなので残る。
  return (
    <section id="people" className="scroll-mt-24 overflow-x-clip bg-sun py-10 lg:py-16">
      <Wrap>
        <div className="grid gap-10 lg:grid-cols-[auto_1fr] lg:items-start lg:gap-14">
          {/* PC だけ2行にする。この見出しは `lg:grid-cols-[auto_1fr]` の auto 側にいるので、
              1行のままだと見出しの列が横に伸びてアバターの列が狭くなる。
              1023px 以下は横幅が足りないので1行のまま。 */}
          <h2 className="text-[2rem] leading-[1.25] tracking-[0.03em] sm:text-4xl lg:text-5xl">
            <span className="lg:block">まなサポの</span>
            <span className="lg:block">人たち</span>
          </h2>

          {/* 9人いるので、PC は3列×3段にそろえる（4列だと最後の段に1人だけ残る）。
              頭が上に出るぶん、行間（gap-y）を横より広く取って隣の行と衝突させない */}
          <ul className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:gap-x-10 lg:gap-y-14">
            {staff.map((person, index) => (
              <li key={person.name}>
                {/* 横には振らない。円から頭が飛び出す作りの都合で要素が枠の外まで
                    広がっているため、左右に動かすと画面の外へ出て横スクロールが増える */}
                <div className="max-w-[15rem]">
                  <div data-reveal="" style={revealStyle(avatarReveal(index))}>
                    <div className="float-slow" style={avatarFloat(index)}>
                      <StaffAvatar media={person.photo} popoutClip={STAFF_POPOUT_CLIP} />
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-lg font-black">
                  {person.name}
                  {person.role && (
                    <span className="mt-0.5 block text-sm font-bold">{person.role}</span>
                  )}
                </p>
                <dl className="mt-2 space-y-1 text-sm">
                  <div>
                    <dt className="inline font-bold">指導科目：</dt>
                    <dd className="inline">{person.subjects}</dd>
                  </div>
                  {person.hobby && (
                    <div>
                      <dt className="inline font-bold">趣味・マイブーム：</dt>
                      <dd className="inline">{person.hobby}</dd>
                    </div>
                  )}
                  {person.message && (
                    <div>
                      <dt className="font-bold">生徒へのメッセージ</dt>
                      <dd className="leading-[1.8]">{person.message}</dd>
                    </div>
                  )}
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </Wrap>
    </section>
  );
}

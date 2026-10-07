import { media } from "@/content/media";
import { Photo } from "@/components/ui/photo";
import { Wrap } from "@/components/ui/wrap";

const intro =
  "まなサポの成長は、ある日突然テストが50点上がる、というものではありません。わからないままにしなくなった、自分で考えるようになった、自分に合う勉強方法を見つけたなど、小さな変化がじわじわ積み重なって、本当の学力になっています。じわじわ、でも確実に本質的に伸びていく。それが、まなサポの生徒たちに見られる変化の特徴です。";

/**
 * 生徒の変化の事例。CASE 01 は CONTENT.md、CASE 02 は 2026-10 の修正指示の原文のまま。
 * `label` と `title` を分けているのは、スマホで「CASE 0X」の後ろを改行させるため（下の h3 を参照）。
 */
const cases = [
  {
    label: "CASE 01",
    title: "4年間続く、テスト前の「呪い」勉強法",
    paragraphs: [
      "定期テストで何を勉強していいかわからなかった生徒が、定期テスト前になると毎回自分なりの儀式のような勉強法をするように。",
      "大きなホワイトボードいっぱいに、テスト範囲の内容を自分でまとめて整理します。",
      "これは板書でも、教科書の書き写しでもありません。自分で仕組みを理解し、頭の中を整理しながら、もう一度自分の言葉でまとめ直しているのです。",
      "この方法を続けてもう4年。今ではすっかり、その生徒自身の「学びの勝ちパターン」になっています。まなサポでは、いつしかこの勉強法を「呪い」と呼ぶようになりました。",
    ],
  },
  {
    label: "CASE 02",
    title: "「セオリーとは違う、でも自分に合っている」がわかる勉強法",
    paragraphs: [
      "中学3年生の夏に入塾してくれたRくん。数学の知識は正直ボロボロ...。入塾後すぐには勉強スイッチも入らず、塾でも瀬尾に怒られてばかりでした。しかしそんな中でも授業は休まずに受け続けてくれました。基本的な勉強の仕方をしっかり叩き込まれ、「すべきこと」や「勉強の仕方」が可視化されたことで徐々に勉強におへそが向くようになってきました。",
      "そして受験直前の初冬、ついにスイッチが入ったRくん。ついに猛勉強開始！！まなサポにおける「勉強法の基礎」が身についていた分、自分なりにそれをアレンジし、「難しい問題は解答を常に横に置きつつ、解説や正答を確認しながら問題を解く。」という勉強法を始めました。この勉強法は「できたつもり」になってしまいやすいため、自学自習ができる中学生・高校生には効果的ですが、彼の偏差値帯においては通常なかなかお勧めできない勉強法です。しかし「自分の目的に必要と思ったことはとことんやる！（そう思わないものは全然やらない...笑）」という彼の性格上、この勉強法がぴったりハマりました。そこから二ヶ月で点数は鰻登り。見事志望校への合格を果たしました。",
      "なんと高校では数学トップクラスに在籍するRくん。現在も彼の勉強法への追求は止まりません。まなサポを「勉強法開発研究所」にしながら、スタッフと一緒に賑やかに、真剣に研究を重ねています。大学受験においてもまた、我々を驚かせてくれることでしょう...！",
    ],
  },
];

export function Changes() {
  return (
    <section id="changes" className="scroll-mt-24 bg-ivory py-10 lg:py-16">
      <Wrap>
        <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-14">
          <div>
            <h2 className="text-[2.5rem] sm:text-5xl lg:text-6xl leading-[1.25] tracking-[0.03em]">生徒の変化</h2>
            <p className="mt-6 max-w-[38rem] text-base leading-[1.95] sm:text-lg">{intro}</p>

            {cases.map((item) => (
              <div key={item.label} className="mt-10 max-w-[38rem]">
                {/* スマホは幅が足りず中途半端な位置で折り返すので、「CASE 0X」で改行させる。
                    640px 以上は全角スペースを挟んで続ける（CASE 02 は長いので PC でも2行になる） */}
                <h3 className="text-lg sm:text-xl">
                  <span className="block sm:inline">{item.label}</span>
                  <span className="hidden sm:inline">　</span>
                  {item.title}
                </h3>
                <div className="mt-4 space-y-4">
                  {item.paragraphs.map((text) => (
                    <p key={text} className="text-base leading-[1.95]">
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 本文が CASE 02 のぶん長くなったので、PC では写真をスクロールに追従させて右列が空かないようにする */}
          <div className="lg:sticky lg:top-28 lg:pt-10">
            <Photo
              media={media.case01}
              sizes="(max-width: 1024px) 90vw, 44vw"
              className="rounded-xl"
            />
          </div>
        </div>
      </Wrap>
    </section>
  );
}

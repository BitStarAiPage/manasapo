import { Wrap } from "@/components/ui/wrap";

const paragraphs = [
  "まなサポのホームページにお立ち寄りいただきありがとうございます！！\nまなサポは、小さな頃から社会人まで民間教育の現場に触れ、長らく携わってきた瀬尾が始めた小さな学習塾です。",
  "まなサポのコンセプトはただ一つ、”生徒一人一人に適した学び方に出会ってもらうこと”です。\n生徒さんが今取り組んでいる”課題やテスト”を乗り越えることが、将来出会うであろう”困難”を乗り越えることにもつながると思っています。",
  "”学ぶ力”は”生きる力”！ということで、",
  "本格派学習塾でありながら柔軟で、何より楽しい”学び”を追求する僕たちと一緒に学習生活を楽しみましょう！！！",
];

export function Message() {
  return (
    <section className="bg-white py-10 lg:py-16">
      <Wrap>
        {/* もとは右カラムに「探究学習コーディネート事業」と SNS を並べていたが、
            どちらも独立したセクションへ切り出したので1カラムにしている */}
        <div>
          {/* お問い合わせフォームの「ご質問等」も name="message" を使うため、
              id が重複しないよう owner-message にしている（重複すると label と入力欄の
              ひも付けが切れ、ラベルを押しても入力欄にフォーカスが移らない） */}
          <div id="owner-message" className="mx-auto max-w-[62rem] scroll-mt-24">
            {/* 右に置いていた瀬尾さんの写真は、合う写真が無いため掲載しないことになった
                （2026-10-15 の修正指示）。見出しと本文を左右に振り分けると広い画面で間が
                大きく空くので、手紙のように中央に1本の列でまとめている。
                見出し・本文・署名とも中央揃え（2026-10-15 のご指示）。改行位置は paragraphs の \n */}
            <div className="text-center">
              <p className="text-lg font-black">塾に込めた思い</p>
              <h2 className="mt-2 text-[1.75rem] sm:text-4xl lg:text-[2.75rem] leading-[1.25] tracking-[0.03em]">
                {/* 太めの黄色いアンダーライン（文字の下 40% に敷くマーカー）。
                    折り返しても行ごとに線が付くよう box-decoration-clone にしている */}
                <span className="box-decoration-clone bg-[linear-gradient(transparent_60%,var(--color-sun)_60%)] px-1">
                  “学ぶ力”は“生きる力”！
                </span>
              </h2>
            </div>

            <div className="mt-8 space-y-7 text-center lg:mt-10">
              {paragraphs.map((text) => (
                <p key={text} className="text-base leading-[2.3] whitespace-pre-line">
                  {text}
                </p>
              ))}
              <p className="pt-2 text-lg font-black">瀬尾洋裕</p>
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

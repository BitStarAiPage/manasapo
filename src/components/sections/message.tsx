import { media } from "@/content/media";
import { socialLinks } from "@/content/site";
import { Photo } from "@/components/ui/photo";
import { Wrap } from "@/components/ui/wrap";

const paragraphs = [
  "まなサポのホームページにお立ち寄りいただきありがとうございます！！\nまなサポは、小さな頃から社会人まで民間教育の現場に触れ、長らく携わってきた瀬尾が始めた小さな学習塾です。",
  "まなサポのコンセプトはただ一つ、”生徒一人一人に適した学び方に出会ってもらうこと”です。生徒さんが今取り組んでいる”課題やテスト”を乗り越えることが、将来出会うであろう”困難”を乗り越えることにもつながると思っています。",
  "”学ぶ力”は”生きる力”！ということで、",
  "本格派学習塾でありながら柔軟で、何より楽しい”学び”を追求する僕たちと一緒に学習生活を楽しみましょう！！！",
];

export function Message() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <Wrap>
        <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          <div id="message" className="scroll-mt-24">
            <p className="text-lg font-black">塾に込めた思い</p>
            <h2 className="mt-2 text-[1.75rem] sm:text-4xl lg:text-[2.75rem]">
              “学ぶ力”は“生きる力”！
            </h2>

            <div className="mt-8 grid gap-8 sm:grid-cols-[1fr_0.8fr] sm:items-start">
              <div className="space-y-5">
                {paragraphs.map((text) => (
                  <p key={text} className="text-base leading-[1.95] whitespace-pre-line">
                    {text}
                  </p>
                ))}
                <p className="pt-2 text-lg font-black">瀬尾洋裕</p>
              </div>

              <Photo
                media={media.message}
                sizes="(max-width: 640px) 90vw, (max-width: 1024px) 40vw, 26vw"
              />
            </div>
          </div>

          <div className="space-y-10">
            <div
              id="inquiry-learning"
              className="scroll-mt-24 rounded-xl border-2 border-mint-deep bg-mint px-6 py-8 text-center"
            >
              <h2 className="text-base sm:text-lg">探究学習コーディネート事業</h2>
              <p className="mt-3 text-2xl font-black tracking-[0.35em] sm:text-3xl">準備中</p>
            </div>

            <div id="social" className="scroll-mt-24">
              <h2 className="text-xl sm:text-2xl">まなサポを、もっと知る</h2>
              <ul className="mt-5 grid grid-cols-3 gap-3">
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-full flex-col items-center justify-start gap-2 rounded-xl border-2 border-ink/10 px-2 py-4 text-center transition-colors hover:border-ink"
                    >
                      <SocialIcon name={link.name} />
                      <span className="text-xs font-bold sm:text-sm">{link.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

function SocialIcon({ name }: { name: string }) {
  if (name === "Instagram") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
        <rect
          x="2.5"
          y="2.5"
          width="19"
          height="19"
          rx="5.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.6" cy="6.4" r="1.4" fill="currentColor" />
      </svg>
    );
  }

  if (name === "YouTube") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
        <rect x="1.5" y="5" width="21" height="14" rx="4.5" fill="currentColor" />
        <path d="M10 9.2l5.2 2.8L10 14.8V9.2z" fill="#ffffff" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-8 w-8">
      <rect x="8.75" y="2" width="6.5" height="12" rx="3.25" fill="currentColor" />
      <path
        d="M5 11.5a7 7 0 0 0 14 0M12 18.5V22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

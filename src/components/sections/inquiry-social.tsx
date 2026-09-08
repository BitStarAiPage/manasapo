import { socialLinks } from "@/content/site";
import { Wrap } from "@/components/ui/wrap";

/**
 * 「探究学習コーディネート事業」と「まなサポを、もっと知る」を横並びで置くセクション。
 *
 * どちらも中身が少ないので、1本ずつのセクションにすると帯だけが続いて間延びする。
 * PC は2カラム、1023px 以下は縦積み。
 *
 * 探究学習は内容が未支給なので「準備中」だけを出す。事業名と「準備中」以外の文言は
 * CONTENT.md に無いため補わない（架空のサービス内容を書かないための方針）。
 * 本文が届いたら左側に段落を足すだけで済む。
 */
export function InquirySocial() {
  return (
    <section className="bg-white py-12 lg:py-16">
      <Wrap>
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
          <div
            id="inquiry-learning"
            className="flex scroll-mt-24 flex-col items-center justify-center gap-5 rounded-xl border-2 border-mint-deep bg-mint px-6 py-10 text-center"
          >
            <h2 className="text-xl leading-[1.25] tracking-[0.03em] sm:text-2xl">
              探究学習コーディネート事業
            </h2>
            <p className="rounded-full border-2 border-ink px-8 py-2.5 text-lg font-black tracking-[0.35em] sm:text-xl">
              準備中
            </p>
          </div>

          <div id="social" className="scroll-mt-24 lg:flex lg:flex-col lg:justify-center">
            <h2 className="text-xl leading-[1.25] tracking-[0.03em] sm:text-2xl">
              まなサポを、もっと知る
            </h2>
            <ul className="mt-5 grid grid-cols-3 gap-3 sm:gap-4">
              {socialLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-full flex-col items-center justify-start gap-2 rounded-xl border-2 border-ink/10 px-2 py-5 text-center transition-colors hover:border-ink"
                  >
                    <SocialIcon name={link.name} />
                    <span className="text-xs font-bold sm:text-sm">{link.name}</span>
                  </a>
                </li>
              ))}
            </ul>
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

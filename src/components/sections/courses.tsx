import { courses } from "@/content/courses";
import { media } from "@/content/media";
import { Photo } from "@/components/ui/photo";
import { Wrap } from "@/components/ui/wrap";

/**
 * コース紹介。写真とリード文は常に見せ、長い部分だけを開閉する。
 *
 * ■ この形にした理由
 * 最初は「学年ボタンだけが並び、押すと全部開く」形にしたが、
 * 閉じた状態だとセクションが 370px しかなく、見出しと細い帯2本だけで中身が薄く見えた。
 * かといって全部出すとスマホで 3,800px あって読む前に疲れる。
 * そこで **写真・コース名・リード文は常時表示**、
 * **ポイント／受講レパートリー／受講例だけを `<details>` に入れる** ことで両立させている。
 *
 * `<details>` を使うのは JavaScript 無しで開閉できるため。
 * 中の「受講例」も `<details>` で、入れ子になるのでアイコンの回転が
 * つられないよう `group/example` と名前を分けている。
 */
export function Courses() {
  return (
    <section id="courses" className="scroll-mt-24 bg-mint py-12 lg:py-16">
      <Wrap>
        <h2 className="text-2xl leading-[1.25] tracking-[0.03em] sm:text-3xl">コース紹介</h2>

        {/* PC は2コースを左右に並べて見比べられるようにする */}
        <div className="mt-8 grid gap-6 lg:grid-cols-2 lg:gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              id={course.id}
              className="flex scroll-mt-28 flex-col overflow-hidden rounded-xl border-2 border-ink bg-white"
            >
              <Photo
                media={media[course.media]}
                sizes="(max-width: 1024px) 90vw, 44vw"
                className="rounded-none"
              />

              <div className="flex flex-1 flex-col p-6 lg:p-8">
                <h3 className="text-2xl leading-[1.25] tracking-[0.03em] sm:text-[1.75rem]">
                  {course.title}
                </h3>
                <p className="mt-4 text-base leading-[1.95] whitespace-pre-line">{course.intro}</p>

                {/* 長い部分はここから下。`mt-auto` でカードの高さが違っても開閉の帯が下端でそろう */}
                <details className="group mt-auto pt-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-full border-2 border-ink px-6 py-3 text-base font-bold transition-colors hover:bg-ink hover:text-white [&::-webkit-details-marker]:hidden">
                    <span className="group-open:hidden">くわしく見る</span>
                    <span className="hidden group-open:inline">とじる</span>
                    {/* 開いているあいだは縦棒を消して「＋ → −」に見せる */}
                    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 shrink-0">
                      <path
                        d="M4 12h16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M12 4v16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        className="origin-center transition-transform group-open:scale-y-0"
                      />
                    </svg>
                  </summary>

                  <div className="pt-6">
                    <h4 className="text-lg font-black">{course.pointsTitle}</h4>
                    <ul className="mt-4 space-y-4">
                      {course.points.map((point) => (
                        <li key={point.title} className="rounded-xl bg-mint/60 p-5">
                          <p className="font-bold">{point.title}</p>
                          <p className="mt-1 text-base leading-[1.9]">{point.body}</p>
                        </li>
                      ))}
                    </ul>

                    <h4 className="mt-8 text-lg font-black">{course.lineupTitle}</h4>
                    <ul className="mt-4 space-y-3">
                      {course.lineup.map((item) => (
                        <li key={item.title} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[2px] shrink-0 font-black">
                            ▷
                          </span>
                          <span>
                            <span className="font-bold">{item.title}</span>
                            {item.body && (
                              <span className="mt-1 block text-base leading-[1.9]">{item.body}</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <h4 className="mt-8 text-lg font-black">{course.examplesTitle}</h4>
                    <div className="mt-3">
                      {course.examples.map((example) => (
                        <details
                          key={example.title}
                          className="group/example border-t-2 border-mint-deep"
                        >
                          <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                            <span>
                              <span className="font-bold">{example.title}</span>
                              {example.meta && (
                                <span className="mt-1 block text-sm text-ink-soft">
                                  {example.meta}
                                </span>
                              )}
                            </span>
                            <svg
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                              className="mt-1 h-5 w-5 shrink-0 transition-transform group-open/example:rotate-180"
                            >
                              <path
                                d="M5 9l7 7 7-7"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </summary>
                          <div className="space-y-3 pb-6">
                            {example.paragraphs.map((text) => (
                              <p key={text} className="text-base leading-[1.95]">
                                {text}
                              </p>
                            ))}
                          </div>
                        </details>
                      ))}
                      <div className="border-t-2 border-mint-deep" />
                    </div>
                  </div>
                </details>
              </div>
            </div>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

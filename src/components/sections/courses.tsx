import { courses } from "@/content/courses";
import { media } from "@/content/media";
import { Photo } from "@/components/ui/photo";
import { Wrap } from "@/components/ui/wrap";

/**
 * コース紹介。学年ごとのボタンを押すと中身が開くアコーディオン。
 *
 * 以前は「上にジャンプボタン、下に2コース分を全部展開」だったが、
 * 中身が長く（スマホでこのセクションだけで 3800px あった）読む前に疲れるので、
 * 押したぶんだけ開く形にしている。
 *
 * `<details>` を使うのは JavaScript 無しで開閉できるため。
 * 中の「指導例」も `<details>` で、入れ子にしても問題ない。
 * ★ 既定では閉じている。開いた状態で見せたい場合は最初の1つに `open` を付ける。
 */
export function Courses() {
  return (
    <section id="courses" className="scroll-mt-24 bg-mint py-12 lg:py-16">
      <Wrap>
        <h2 className="text-2xl leading-[1.25] tracking-[0.03em] sm:text-3xl">コース紹介</h2>
        <p className="mt-3 text-base text-ink-soft">
          学年を選ぶと、コースの内容が開きます。
        </p>

        <div className="mt-6 space-y-4">
          {courses.map((course) => (
            <details
              key={course.id}
              id={course.id}
              className="group scroll-mt-28 overflow-hidden rounded-xl border-2 border-ink bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-6 py-4 text-lg font-bold transition-colors group-open:border-b-2 group-open:border-ink hover:bg-ink hover:text-white sm:text-xl [&::-webkit-details-marker]:hidden">
                {course.title}
                {/* 開いているあいだは縦棒を消して「＋ → −」に見せる */}
                <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 shrink-0">
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

              {/* 開いた中身。PC は写真を右に置いて、本文の行長を抑える */}
              <div className="grid gap-8 px-6 pt-6 pb-8 lg:grid-cols-[1fr_0.8fr] lg:gap-12 lg:px-8 lg:pb-10">
                <div>
                  <p className="text-base leading-[1.95] whitespace-pre-line">{course.intro}</p>

                  <h3 className="mt-8 text-lg font-black">{course.pointsTitle}</h3>
                  <ul className="mt-4 space-y-4">
                    {course.points.map((point) => (
                      <li key={point.title} className="rounded-xl bg-mint/60 p-5">
                        <p className="font-bold">{point.title}</p>
                        <p className="mt-1 text-base leading-[1.9]">{point.body}</p>
                      </li>
                    ))}
                  </ul>

                  <h3 className="mt-8 text-lg font-black">{course.lineupTitle}</h3>
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
                </div>

                <div className="lg:pt-1">
                  <Photo
                    media={media[course.media]}
                    sizes="(max-width: 1024px) 90vw, 36vw"
                    className="rounded-xl"
                  />

                  <h3 className="mt-8 text-lg font-black">{course.examplesTitle}</h3>
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
              </div>
            </details>
          ))}
        </div>
      </Wrap>
    </section>
  );
}

import { courses } from "@/content/courses";
import { media } from "@/content/media";
import { Photo } from "@/components/ui/photo";
import { Wrap } from "@/components/ui/wrap";
import { cn } from "@/lib/cn";

export function Courses() {
  return (
    <section id="courses" className="scroll-mt-24 bg-mint py-16 lg:py-24">
      <Wrap>
        <h2 className="text-2xl sm:text-3xl">コース紹介</h2>

        {/* 学年別の入口。同じページ内のコースブロックへ移動する */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
          {courses.map((course) => (
            <a
              key={course.id}
              href={`#${course.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border-2 border-ink bg-white px-6 py-4 text-lg font-bold transition-colors hover:bg-ink hover:text-white sm:text-xl"
            >
              {course.title}
              <span aria-hidden="true">↓</span>
            </a>
          ))}
        </div>

        <div className="mt-12 grid gap-14 lg:grid-cols-2 lg:gap-0">
          {courses.map((course, index) => (
            <div
              key={course.id}
              id={course.id}
              className={cn(
                "scroll-mt-28",
                index === 0
                  ? "lg:pr-10 xl:pr-14"
                  : "lg:border-l-2 lg:border-mint-deep lg:pl-10 xl:pl-14",
              )}
            >
              <h3 className="text-2xl sm:text-3xl">{course.title}</h3>

              <Photo
                media={media[course.media]}
                sizes="(max-width: 1024px) 90vw, 44vw"
                className="mt-5 rounded-xl"
              />

              <p className="mt-6 text-base leading-[1.95] whitespace-pre-line">{course.intro}</p>

              <h4 className="mt-8 text-lg font-black">{course.pointsTitle}</h4>
              <ul className="mt-4 space-y-4">
                {course.points.map((point) => (
                  <li key={point.title} className="rounded-xl bg-white/70 p-5">
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
                  <details key={example.title} className="group border-t-2 border-mint-deep">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                      <span>
                        <span className="font-bold">{example.title}</span>
                        {example.meta && (
                          <span className="mt-1 block text-sm text-ink-soft">{example.meta}</span>
                        )}
                      </span>
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="mt-1 h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
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
          ))}
        </div>
      </Wrap>
    </section>
  );
}

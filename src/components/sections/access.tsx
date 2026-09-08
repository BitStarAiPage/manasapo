import { access } from "@/content/site";
import { media } from "@/content/media";
import { Photo } from "@/components/ui/photo";
import { Wrap } from "@/components/ui/wrap";

export function Access() {
  return (
    <section id="access" className="scroll-mt-24 bg-ivory py-16 lg:py-24">
      <Wrap>
        <h2 className="text-2xl sm:text-3xl">教室・アクセス</h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-10">
          <Photo
            media={media.classroom}
            sizes="(max-width: 1024px) 90vw, 30vw"
            className="rounded-xl"
          />

          {/* 地図の埋め込みは未取得のため、正規のGoogle マップリンクを開く */}
          <a
            href={access.mapUrl}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-mint-deep bg-mint p-8 text-center transition-colors hover:bg-mint-deep"
            style={{ aspectRatio: "4 / 3" }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-10 w-10">
              <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" fill="currentColor" />
              <circle cx="12" cy="10" r="2.6" fill="#dff1e7" />
            </svg>
            <span className="font-bold">Google マップで見る</span>
          </a>

          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-black text-ink-soft">住所</h3>
              <p className="mt-1 text-base leading-[1.9]">{access.address}</p>
            </div>
            <div>
              <h3 className="text-sm font-black text-ink-soft">営業日</h3>
              <p className="mt-1 text-base leading-[1.9]">{access.businessDays}</p>
            </div>
            <div>
              <h3 className="text-sm font-black text-ink-soft">営業時間</h3>
              {access.hours.map((line) => (
                <p key={line} className="mt-1 text-base leading-[1.9]">
                  {line}
                </p>
              ))}
            </div>
            <div>
              <h3 className="text-sm font-black text-ink-soft">電話番号</h3>
              <p className="mt-1">
                <a href={access.tel.href} className="text-base font-bold hover:underline">
                  {access.tel.label}
                </a>
              </p>
            </div>
            <div>
              <h3 className="text-sm font-black text-ink-soft">メールアドレス</h3>
              <p className="mt-1">
                <a
                  href={access.email.href}
                  className="text-base font-bold break-all hover:underline"
                >
                  {access.email.label}
                </a>
              </p>
            </div>
          </div>
        </div>
      </Wrap>
    </section>
  );
}

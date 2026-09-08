import { access, site } from "@/content/site";
import { media } from "@/content/media";
import { floatStyle } from "@/lib/reveal";
import { Photo } from "@/components/ui/photo";
import { Wrap } from "@/components/ui/wrap";

export function Access() {
  return (
    <section id="access" className="scroll-mt-24 bg-ivory py-12 lg:py-16">
      <Wrap>
        <h2 className="text-2xl sm:text-3xl leading-[1.25] tracking-[0.03em]">教室・アクセス</h2>

        <div className="mt-8 grid gap-8 lg:grid-cols-3 lg:gap-10">
          <Photo
            media={media.classroom}
            sizes="(max-width: 1024px) 90vw, 30vw"
            className="rounded-xl"
          />

          {/* Google マップの埋め込み。API キーの要らない `output=embed` を使う。
              住所は site.ts の1か所だけを見ているので、住所を直せば地図も動く。
              `loading="lazy"` は、画面に入るまで地図を読み込ませないため
              （地図の iframe は重く、入れっぱなしだと初回表示が遅くなる）。 */}
          <div className="overflow-hidden rounded-xl border-2 border-mint-deep">
            <iframe
              title={`${site.name}の場所（Google マップ）`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(access.address)}&hl=ja&z=17&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-full w-full"
              style={{ aspectRatio: "4 / 3", border: 0 }}
            />
          </div>

          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-black text-ink-soft">住所</h3>
              <p className="mt-1 text-base leading-[1.9]">{access.address}</p>
              {/* 埋め込み地図とは別に、地図アプリで開ける導線を残す */}
              <a
                href={access.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold hover:underline"
              >
                {/* 常時ゆっくり浮くのはこのピンだけ。同じセクションに他の装飾は無い */}
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="float-slow h-5 w-5"
                  style={floatStyle(6.2, 0.4)}
                >
                  <path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" fill="currentColor" />
                  <circle cx="12" cy="10" r="2.6" fill="#dff1e7" />
                </svg>
                Google マップで開く
              </a>
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

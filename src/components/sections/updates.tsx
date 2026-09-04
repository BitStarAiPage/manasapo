import { updateMedia } from "@/content/media";
import { socialLinks } from "@/content/site";
import { SwooshDoodle } from "@/components/ui/doodles";
import { Photo } from "@/components/ui/photo";
import { Wrap } from "@/components/ui/wrap";

const instagram = socialLinks[0];

export function Updates() {
  return (
    <section id="updates" className="bg-white py-14 lg:py-20">
      <Wrap>
        <div className="grid gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-start lg:gap-12">
          <div className="lg:pt-2">
            <h2 className="text-2xl sm:text-3xl">
              最近の
              <br />
              まなサポ
            </h2>
            <SwooshDoodle className="mt-2 w-32 text-ink" />
          </div>

          <ul className="grid gap-6 sm:grid-cols-3">
            {updateMedia.map((item) => (
              <li key={item.label}>
                <Photo
                  media={item}
                  showLabel={false}
                  sizes="(max-width: 640px) 90vw, 28vw"
                  className="rounded-xl"
                />
                <p className="mt-2 text-sm font-bold">{item.label}</p>
              </li>
            ))}
          </ul>

          <a
            href={instagram.href}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 self-start font-bold hover:underline lg:flex-col lg:items-center lg:gap-1 lg:text-center"
          >
            <InstagramIcon />
            <span className="text-sm">
              Instagram
              <span className="hidden lg:block">はこちら</span>
            </span>
            <span aria-hidden="true">→</span>
          </a>
        </div>

        <p className="mt-8 text-sm text-ink-soft">
          投稿の写真・本文・日付は準備中です。最新の様子はInstagramでご覧いただけます。
        </p>
      </Wrap>
    </section>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7 shrink-0">
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

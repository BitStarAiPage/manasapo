import { site } from "@/content/site";
import { Logo } from "@/components/ui/logo";
import { Wrap } from "@/components/ui/wrap";

export function SiteFooter() {
  return (
    <footer className="bg-sun pb-10">
      <Wrap>
        <div className="flex flex-col items-center gap-3 border-t-2 border-ink/10 pt-10 text-center">
          <Logo className="h-[4.5rem] w-auto" />
          <p className="text-xs font-bold">{site.tagline}</p>
          <p className="mt-2 text-xs text-ink-soft">
            © {new Date().getFullYear()} {site.name}
          </p>
        </div>
      </Wrap>
    </footer>
  );
}

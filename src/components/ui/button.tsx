import { cn } from "@/lib/cn";

const base = "inline-flex items-center justify-center rounded-full font-bold transition-colors";

const sizes = {
  md: "px-6 py-3 text-base sm:px-8 sm:py-4",
  sm: "px-5 py-2.5 text-sm",
} as const;

const variants = {
  /** 黒地に白文字。黄色い面でも白い面でも主役に使える */
  solid: "bg-ink text-white hover:bg-ink-soft",
  /** 黄色い面の上の第二ボタン。文字は黒 */
  outline: "border-2 border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
  /** 白い面の上の第二ボタン */
  ghost: "border-2 border-ink bg-white text-ink hover:bg-ink hover:text-white",
} as const;

export function LinkButton({
  href,
  variant = "solid",
  size = "md",
  className,
  onClick,
  children,
}: {
  href: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(base, sizes[size], variants[variant], className)}
    >
      {children}
    </a>
  );
}

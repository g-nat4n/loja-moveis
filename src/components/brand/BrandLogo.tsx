import { cn } from "@/lib/utils";

type BrandLogoProps = {
  variant?: "full" | "compact" | "mark";
  tone?: "dark" | "light";
  className?: string;
};

export function BrandLogo({ variant = "full", tone = "dark", className }: BrandLogoProps) {
  const color = tone === "light" ? "text-white" : "text-burgundy";
  const muted = tone === "light" ? "text-white/80" : "text-burgundy/75";

  if (variant === "mark") {
    return (
      <span
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-full border font-serif text-lg font-semibold leading-none",
          tone === "light" ? "border-white/40 text-white" : "border-burgundy/25 text-burgundy",
          className,
        )}
        aria-label="Mareli Arte"
      >
        M
      </span>
    );
  }

  if (variant === "compact") {
    return (
      <span className={cn("font-serif text-xl font-semibold tracking-[0.18em]", color, className)} aria-label="Mareli Arte">
        MARELI
      </span>
    );
  }

  return (
    <span className={cn("inline-flex flex-col leading-none", className)} aria-label="Mareli Arte">
      <span className={cn("font-serif text-xl font-semibold tracking-[0.18em] sm:text-2xl sm:tracking-[0.2em]", color)}>
        MARELI
      </span>
      <span className={cn("mt-1 text-[10px] font-semibold uppercase tracking-[0.42em]", muted)}>Arte</span>
    </span>
  );
}

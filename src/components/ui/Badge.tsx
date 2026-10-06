import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "gold",
  className,
}: {
  children: React.ReactNode;
  tone?: "gold" | "wine" | "forest" | "ink";
  className?: string;
}) {
  const tones = {
    gold: "rounded-full bg-gold/20 text-gold-deep",
    wine: "rounded-full bg-wine/15 text-wine",
    forest: "rounded-full border border-burgundy/20 bg-white/90 text-burgundy",
    ink: "rounded-full bg-burgundy text-ivory",
  };

  return (
    <span
      className={cn(
        "inline-flex px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

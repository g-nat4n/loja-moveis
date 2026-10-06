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
    gold: "rounded-full bg-black/70 text-white backdrop-blur-sm",
    wine: "rounded-full bg-black/55 text-white backdrop-blur-sm",
    forest: "rounded-full border border-ink/15 bg-white/90 text-ink",
    ink: "rounded-full bg-black/80 text-white",
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

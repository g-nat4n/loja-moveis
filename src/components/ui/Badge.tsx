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
    gold: "rounded-full bg-burgundy text-white",
    wine: "rounded-full bg-wine text-white",
    forest: "rounded-full bg-forest/15 text-forest",
    ink: "rounded-full bg-burgundy text-white",
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

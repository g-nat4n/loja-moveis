"use client";

import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function RemoveCartButton({
  onClick,
  label = "Remover da sacola",
  className,
}: {
  onClick: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-ivory text-taupe transition hover:border-burgundy/25 hover:bg-accent/10 hover:text-burgundy",
        className,
      )}
      aria-label={label}
      title={label}
    >
      <Trash2 className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
}

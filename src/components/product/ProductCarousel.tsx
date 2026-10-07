"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductCarousel({
  children,
  className,
  itemClassName = "w-[68vw] max-w-72 shrink-0 snap-start sm:w-72",
}: {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const items = Children.toArray(children);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(max > 4 && el.scrollLeft < max - 4);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    updateArrows();
    const onScroll = () => updateArrows();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateArrows);
    const observer = new ResizeObserver(updateArrows);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateArrows);
      observer.disconnect();
    };
  }, [updateArrows, items.length]);

  function scrollByDir(dir: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.8, 300);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        aria-label="Anterior"
        disabled={!canLeft}
        onClick={() => scrollByDir(-1)}
        className="absolute left-0 top-[38%] z-20 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white text-ink shadow-[0_4px_16px_rgba(0,0,0,0.16)] transition hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] disabled:pointer-events-none disabled:opacity-0 sm:h-12 sm:w-12"
      >
        <ChevronLeft className="h-6 w-6" strokeWidth={2} />
      </button>
      <button
        type="button"
        aria-label="Próximo"
        disabled={!canRight}
        onClick={() => scrollByDir(1)}
        className="absolute right-0 top-[38%] z-20 flex h-11 w-11 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/10 bg-white text-ink shadow-[0_4px_16px_rgba(0,0,0,0.16)] transition hover:scale-105 hover:shadow-[0_6px_20px_rgba(0,0,0,0.2)] disabled:pointer-events-none disabled:opacity-0 sm:h-12 sm:w-12"
      >
        <ChevronRight className="h-6 w-6" strokeWidth={2} />
      </button>

      <div
        ref={scrollerRef}
        className="-mx-1 flex gap-5 overflow-x-auto scroll-smooth px-1 pb-3 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((child, index) => (
          <div key={index} className={itemClassName}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

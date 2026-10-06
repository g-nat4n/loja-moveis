"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { FEATURED_PIECES } from "@/lib/brand";

const GALLERY = FEATURED_PIECES.map((piece) => ({
  src: piece.image,
  alt: piece.alt,
  name: piece.name,
  slug: piece.slug,
}));

export function FurnitureShowcase() {
  const reduced = useReducedMotion();
  const loop = [...GALLERY, ...GALLERY];

  return (
    <section id="ambientes" className="w-full overflow-hidden bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold-deep">Ambientes</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-burgundy sm:text-5xl">Móveis em movimento</h2>
          <p className="mt-4 text-sm leading-relaxed text-taupe">
            Uma seleção visual no espírito Mareli — deslize com o olhar e escolha o que cabe no seu espaço.
          </p>
        </div>
      </div>

      <div className="relative mt-12">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-cream to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-cream to-transparent sm:w-28" />

        <motion.div
          className="flex w-max gap-5 px-6 sm:gap-6"
          animate={reduced ? undefined : { x: ["0%", "-50%"] }}
          transition={
            reduced
              ? undefined
              : {
                  duration: 42,
                  ease: "linear",
                  repeat: Infinity,
                }
          }
        >
          {loop.map((item, index) => (
            <Link
              key={`${item.slug}-${index}`}
              href={`/produto/${item.slug}`}
              className="group relative h-56 w-72 shrink-0 overflow-hidden rounded-3xl bg-sand shadow-[0_14px_36px_rgba(0,0,0,0.08)] sm:h-72 sm:w-96"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.05]"
                sizes="(max-width: 640px) 288px, 384px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent opacity-80 transition group-hover:opacity-90" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Mareli</p>
                <p className="mt-1 font-serif text-xl text-white sm:text-2xl">{item.name}</p>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl justify-center px-6 lg:px-8">
        <Link
          href="/produtos"
          className="rounded-full bg-burgundy px-7 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-ivory transition hover:bg-wine"
        >
          Ver todos os móveis
        </Link>
      </div>
    </section>
  );
}

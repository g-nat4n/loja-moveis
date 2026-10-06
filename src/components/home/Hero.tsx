"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/brand";

export function Hero() {
  const { hero } = BRAND;
  const reduced = useReducedMotion();

  return (
    <section id="inicio" className="relative w-full overflow-hidden">
      <div className="relative min-h-[70vh] w-full sm:min-h-[82vh]">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy/90 via-burgundy/45 to-burgundy/25" />

        <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-16 text-center sm:justify-center sm:pb-0">
          <motion.div
            className="mb-6 overflow-hidden rounded-full border-4 border-white shadow-[0_16px_40px_rgba(0,0,0,0.35)]"
            initial={reduced ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55 }}
          >
            <Image
              src={BRAND.logo}
              alt="Logo Mareli Arte"
              width={112}
              height={112}
              className="h-24 w-24 object-cover sm:h-28 sm:w-28"
              priority
            />
          </motion.div>
          <motion.p
            className="text-[11px] font-bold uppercase tracking-[0.32em] text-gold"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {hero.kicker}
          </motion.p>
          <motion.h1
            className="mt-5 max-w-xl text-xs font-bold uppercase tracking-[0.28em] text-white sm:text-sm"
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55 }}
          >
            {hero.titleLine}
          </motion.h1>
          <motion.p
            className="script mt-2 text-5xl leading-none text-gold sm:text-6xl lg:text-7xl"
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.65 }}
          >
            {hero.titleAccent}
          </motion.p>
          <motion.p
            className="mt-5 max-w-md text-sm leading-6 text-white/85"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28, duration: 0.5 }}
          >
            {hero.description}
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38, duration: 0.5 }}
          >
            <Button href="/produtos" variant="gold" className="min-h-0 px-8 py-3.5 text-xs tracking-[0.2em]">
              {hero.primaryCta}
            </Button>
            <Button
              href="/sobre"
              variant="outline"
              className="min-h-0 border-white/50 px-6 py-3.5 text-xs tracking-[0.16em] text-white hover:border-gold hover:bg-gold/15 hover:text-white"
            >
              {hero.secondaryCta}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

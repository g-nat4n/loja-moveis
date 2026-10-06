import Link from "next/link";
import { Instagram, MessageCircle, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/home/ContactForm";
import { Reveal } from "@/components/ui/Reveal";
import { BRAND } from "@/lib/brand";

export function CategoryChips() {
  const { categories } = BRAND;

  return (
    <section id="categorias" className="w-full bg-white px-6 py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ink/50">{categories.kicker}</p>
          <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="font-serif text-4xl font-semibold text-ink sm:text-5xl">{categories.title}</h2>
            <p className="max-w-md text-sm leading-6 text-taupe">{categories.text}</p>
          </div>
        </Reveal>
        <div className="mt-10 flex flex-wrap gap-3">
          {categories.chips.map((chip, index) => (
            <Reveal key={chip.label} delay={index * 0.05} className="inline-block origin-center">
              <Link
                href={chip.href}
                className="inline-block origin-center rounded-full border border-ink/15 bg-ivory px-5 py-4 text-sm font-bold text-ink transition duration-300 ease-out hover:z-10 hover:scale-105 hover:bg-black/5"
              >
                {chip.label}
              </Link>
            </Reveal>
          ))}
          <Reveal delay={categories.chips.length * 0.05} className="inline-block origin-center">
            <span className="inline-block rounded-full border border-dashed border-ink/25 px-5 py-4 text-sm italic text-taupe transition duration-300 hover:scale-105">
              {categories.soon}
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function EditorialLook() {
  const { editorial } = BRAND;

  return (
    <section className="w-full bg-ink px-6 py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/50">{editorial.kicker}</p>
          <h2 className="mt-5 font-serif text-5xl font-semibold leading-tight text-white sm:text-6xl">
            {editorial.title}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="border-l border-white/25 pl-7">
            <p className="text-xl leading-8 text-white/85">{editorial.text}</p>
            <span className="mt-8 inline-block text-white/60">
              <Sparkles className="h-6 w-6" />
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ContactBand() {
  const { contact } = BRAND;
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com/";
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/";

  return (
    <section id="contato" className="w-full bg-ink px-6 py-24 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">{contact.kicker}</p>
          <h2 className="mt-4 font-serif text-5xl font-semibold leading-tight text-white">{contact.title}</h2>
          <p className="mt-6 max-w-md leading-7 text-white/75">{contact.text}</p>
          <div className="mt-10 space-y-3">
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm font-semibold text-white/80 transition hover:text-white"
            >
              <Instagram className="h-[19px] w-[19px]" />
              {BRAND.instagramLabel}
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-sm font-semibold text-white/80 transition hover:text-white"
            >
              <MessageCircle className="h-[19px] w-[19px]" />
              {BRAND.whatsappLabel}
            </a>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

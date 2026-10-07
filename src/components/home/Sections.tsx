import Link from "next/link";
import { MapPin, MessageCircle, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
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
                className="inline-block origin-center rounded-full border border-ink/15 bg-ivory px-5 py-4 text-sm font-bold text-ink transition duration-300 ease-out hover:z-10 hover:scale-105 hover:bg-accent/10"
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
  const { contact, address } = BRAND;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/";
  const mapQuery = process.env.NEXT_PUBLIC_MAP_QUERY?.trim() || address.mapQuery;
  const mapEmbed =
    process.env.NEXT_PUBLIC_MAP_EMBED_URL?.trim() ||
    `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=14&output=embed`;
  const addressLine1 = process.env.NEXT_PUBLIC_ADDRESS_LINE1?.trim() || address.line1;
  const addressLine2 = process.env.NEXT_PUBLIC_ADDRESS_LINE2?.trim() || address.line2;

  return (
    <section id="contato" className="w-full bg-ivory px-6 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-stretch">
        <Reveal className="order-2 lg:order-1">
          <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[0_16px_40px_rgba(89,66,56,0.08)]">
            <iframe
              title="Mapa Mareli Arte"
              src={mapEmbed}
              className="h-[320px] w-full border-0 sm:h-[420px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>

        <Reveal delay={0.08} className="order-1 flex flex-col justify-center lg:order-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-wine">{contact.kicker}</p>
          <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-burgundy sm:text-5xl">
            {contact.title}
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-taupe">{contact.text}</p>

          <div className="mt-8 flex gap-3 rounded-2xl border border-line bg-white p-5">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-burgundy" strokeWidth={1.75} />
            <div>
              <p className="text-sm font-semibold text-burgundy">{addressLine1}</p>
              <p className="mt-1 text-sm leading-6 text-taupe">{addressLine2}</p>
            </div>
          </div>

          <div className="mt-8">
            <Button
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <MessageCircle className="h-4 w-4" />
              {contact.cta}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

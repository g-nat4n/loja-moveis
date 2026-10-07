import Link from "next/link";
import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BRAND } from "@/lib/brand";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type FooterCategory = { name: string; slug: string };

const CREDIT = {
  site: "https://grupocostabr.com.br/",
  instagram: "https://www.instagram.com/grupocostabrasil/",
} as const;

const PAGE_LINKS = [
  { href: "/", label: "Início" },
  ...NAV_LINKS.filter((link) => link.label !== "Início"),
  { href: "/carrinho", label: "Sacola" },
];

export function Footer({
  className,
  categories = [],
}: {
  className?: string;
  categories?: FooterCategory[];
}) {
  const { footer } = BRAND;
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/mareli_arte/";
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/";
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();

  return (
    <footer className={cn("mt-auto w-full border-t border-burgundy bg-burgundy px-6 py-14 text-white lg:px-8", className)}>
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandLogo variant="full" tone="light" />
          <p className="mt-4 font-serif text-lg italic leading-snug text-white/80">{BRAND.phrase}</p>
          <span className="mt-6 inline-block h-px w-12 bg-white/35" aria-hidden />
        </div>

        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Páginas</h2>
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-white/75">
            {PAGE_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-wine">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Categorias</h2>
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-white/75">
            {categories.length === 0 ? (
              <p className="text-white/50">Em breve</p>
            ) : (
              categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/produtos?category=${category.slug}`}
                  className="transition hover:text-wine"
                >
                  {category.name}
                </Link>
              ))
            )}
          </div>
        </div>

        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">Contato e redes</h2>
          <p className="mt-4 text-sm leading-6 text-white/65">{footer.serviceText}</p>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            <p className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/55" />
              <span>{BRAND.location ?? "Curitiba e Região Metropolitana"}</span>
            </p>
            {contactEmail ? (
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-2.5 transition hover:text-white">
                <Mail className="h-4 w-4 shrink-0 text-white/55" />
                {contactEmail}
              </a>
            ) : null}
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 transition hover:text-wine"
            >
              <MessageCircle className="h-4 w-4 shrink-0 text-white/55" />
              WhatsApp
            </a>
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 transition hover:text-wine"
            >
              <Instagram className="h-4 w-4 shrink-0 text-white/55" />
              @mareli_arte
            </a>
          </div>
          <div className="mt-5 flex items-center gap-2.5">
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram Mareli Arte"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-wine hover:text-wine"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.75} />
            </a>
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Mareli Arte"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-wine hover:text-wine"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-7xl gap-4 border-t border-white/15 pt-6 text-xs text-white/50 sm:grid-cols-3 sm:items-center">
        <p>{footer.copy}</p>

        <p className="flex flex-wrap items-center gap-x-1.5 text-white/70 sm:justify-center">
          <span>Site construído por</span>
          <a
            href={CREDIT.site}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-white transition hover:text-wine"
          >
            Grupo Costa Brasil
          </a>
          <a
            href={CREDIT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram Grupo Costa Brasil"
            className="ml-0.5 inline-flex text-white/80 transition hover:text-wine"
          >
            <Instagram className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        </p>

        <a href="#topo" className="font-bold text-white/80 transition hover:text-wine sm:justify-self-end">
          {BRAND.backTop}
        </a>
      </div>
    </footer>
  );
}

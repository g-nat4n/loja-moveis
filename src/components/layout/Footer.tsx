import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  const { footer } = BRAND;
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/mareli_arte/";

  return (
    <footer className={cn("mt-auto w-full border-t border-line bg-burgundy px-6 py-14 text-white lg:px-8", className)}>
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src={BRAND.logo}
              alt="Mareli Arte"
              width={56}
              height={56}
              className="h-14 w-14 rounded-full border-2 border-gold/50 object-cover"
            />
            <div>
              <p className="font-serif text-2xl tracking-[0.12em] text-white">{BRAND.footerBrand}</p>
              <p className="script mt-1 text-xl text-gold">{BRAND.phrase}</p>
            </div>
          </div>
          <span className="mt-6 inline-block h-px w-12 bg-gold" aria-hidden />
          <a
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block text-sm text-white/70 transition hover:text-gold"
          >
            @mareli_arte
          </a>
        </div>
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">{footer.navTitle}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/75">
            {NAV_LINKS.filter((link) => link.label !== "Início").map((link) => (
              <Link key={link.label} href={link.href} className="transition hover:text-gold">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">{footer.serviceTitle}</h2>
          <p className="mt-4 text-sm leading-6 text-white/65">{footer.serviceText}</p>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/15 pt-6 text-xs text-white/50 sm:flex-row sm:items-center">
        <p>{footer.copy}</p>
        <a href="#topo" className="font-bold text-gold sm:justify-self-end">
          {BRAND.backTop}
        </a>
      </div>
    </footer>
  );
}

import Link from "next/link";
import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Footer({ className }: { className?: string }) {
  const { footer } = BRAND;

  return (
    <footer className={cn("mt-auto w-full border-t border-line bg-ink px-6 py-14 text-white lg:px-8", className)}>
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src={BRAND.logo}
              alt="Mareli Arte"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
            <p className="font-serif text-2xl tracking-[0.15em] text-white">{BRAND.footerBrand}</p>
          </div>
          <p className="mt-4 font-serif text-xl italic text-white/80">{BRAND.phrase}</p>
          <span className="mt-6 inline-block h-px w-12 bg-white/35" aria-hidden />
        </div>
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">{footer.navTitle}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-white/75">
            {NAV_LINKS.filter((link) => link.label !== "Início").map((link) => (
              <Link key={link.label} href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/55">{footer.serviceTitle}</h2>
          <p className="mt-4 text-sm leading-6 text-white/65">{footer.serviceText}</p>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-3 border-t border-white/15 pt-6 text-xs text-white/50 sm:flex-row sm:items-center">
        <p>{footer.copy}</p>
        <a href="#topo" className="font-bold text-white/80 transition hover:text-white sm:justify-self-end">
          {BRAND.backTop}
        </a>
      </div>
    </footer>
  );
}

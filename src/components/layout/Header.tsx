"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ChevronDown, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { NAV_LINKS } from "@/lib/constants";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { useCart } from "@/components/cart/CartProvider";
import { cn } from "@/lib/utils";

type NavCategory = { name: string; slug: string };

export function Header({ categories = [] }: { categories?: NavCategory[] }) {
  const pathname = usePathname();
  const { data } = useSession();
  const { count, openCart } = useCart();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();
  const categoriesRef = useRef<HTMLDivElement>(null);
  const hoverCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function openCategoriesMenu() {
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current);
      hoverCloseTimer.current = null;
    }
    setCategoriesOpen(true);
  }

  function scheduleCloseCategoriesMenu() {
    if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    hoverCloseTimer.current = setTimeout(() => setCategoriesOpen(false), 120);
  }

  useEffect(() => {
    setOpen(false);
    setSearchOpen(false);
    setCategoriesOpen(false);
    setMobileCategoriesOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverCloseTimer.current) clearTimeout(hoverCloseTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!categoriesOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setCategoriesOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [categoriesOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-line bg-ivory/95 backdrop-blur-sm transition",
        scrolled && "shadow-[0_8px_28px_rgba(89,66,56,0.08)]",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 py-3 sm:px-5 sm:py-4 lg:px-8">
        <Link href="/" className="shrink-0">
          <span className="hidden sm:block">
            <BrandLogo variant="full" />
          </span>
          <span className="sm:hidden">
            <BrandLogo variant="compact" />
          </span>
        </Link>

        <nav className="hidden min-w-0 items-center gap-1 xl:flex" aria-label="Navegação principal">
          {NAV_LINKS.filter((link) => link.label === "Início" || link.label === "Móveis").map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className="nav-link"
                aria-current={active ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}

          <div
            className="relative"
            ref={categoriesRef}
            onMouseEnter={openCategoriesMenu}
            onMouseLeave={scheduleCloseCategoriesMenu}
          >
            <button
              type="button"
              className="nav-link inline-flex items-center gap-1"
              aria-expanded={categoriesOpen}
              aria-haspopup="menu"
              onFocus={openCategoriesMenu}
              onClick={() => setCategoriesOpen((value) => !value)}
            >
              Categorias
              <ChevronDown className={cn("h-3.5 w-3.5 transition", categoriesOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {categoriesOpen ? (
                <motion.div
                  role="menu"
                  initial={reduced ? false : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: 6 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-2"
                >
                <div className="rounded-2xl border border-line bg-white p-2 shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
                  {categories.length === 0 ? (
                    <p className="px-3 py-2 text-sm text-taupe">Nenhuma categoria ainda</p>
                  ) : (
                    categories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/produtos?category=${category.slug}`}
                        role="menuitem"
                        className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-burgundy transition hover:bg-accent/10 hover:text-wine"
                        onClick={() => setCategoriesOpen(false)}
                      >
                        {category.name}
                      </Link>
                    ))
                  )}
                  <Link
                    href="/produtos"
                    className="mt-1 block rounded-xl border-t border-line px-3 pt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-taupe transition hover:text-ink"
                    onClick={() => setCategoriesOpen(false)}
                  >
                    Ver todos os móveis
                  </Link>
                </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {NAV_LINKS.filter((link) => link.label === "Contato").map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="nav-link"
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            type="button"
            className="rounded-full p-2 text-burgundy transition hover:bg-accent/10 hover:text-wine"
            aria-label="Abrir busca"
            onClick={() => setSearchOpen((value) => !value)}
          >
            <Search className="h-[19px] w-[19px]" strokeWidth={2} />
          </button>
          <Link
            href={data?.user ? "/minha-conta" : "/login"}
            className="rounded-full p-2 text-burgundy transition hover:bg-accent/10 hover:text-wine"
            aria-label={data?.user ? "Minha conta" : "Entrar"}
          >
            <User className="h-[19px] w-[19px]" strokeWidth={2} />
          </Link>
          <button
            type="button"
            className="relative rounded-full p-2 text-burgundy transition hover:bg-accent/10 hover:text-wine"
            aria-label="Abrir sacola"
            onClick={openCart}
          >
            <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={2} />
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-burgundy px-1 text-[10px] leading-4 text-white">
                {count}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            className="ml-1 rounded-full p-2 text-burgundy transition hover:bg-accent/10 hover:text-wine xl:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X className="h-[21px] w-[21px]" /> : <Menu className="h-[21px] w-[21px]" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen ? (
          <motion.form
            action="/produtos"
            className="border-t border-line bg-ivory px-5 py-4 lg:px-8"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
          >
            <label className="mx-auto block max-w-7xl">
              <span className="sr-only">Buscar móveis</span>
              <input
                name="q"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar móvel ou ambiente"
                className="h-12 w-full border border-line bg-white px-4 text-sm text-burgundy outline-none focus:border-burgundy"
              />
            </label>
          </motion.form>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.nav
            className="border-t border-line bg-ivory xl:hidden"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduced ? undefined : { height: 0, opacity: 0 }}
            aria-label="Navegação mobile"
          >
            <div className="flex flex-col px-6 py-4">
              {NAV_LINKS.filter((link) => link.label === "Início" || link.label === "Móveis").map((link) => (
                <Link key={link.label} href={link.href} className="nav-link-mobile border-b border-line">
                  {link.label}
                </Link>
              ))}

              <button
                type="button"
                className="nav-link-mobile flex w-full items-center justify-between border-b border-line text-left"
                onClick={() => setMobileCategoriesOpen((value) => !value)}
                aria-expanded={mobileCategoriesOpen}
              >
                Categorias
                <ChevronDown className={cn("h-4 w-4 transition", mobileCategoriesOpen && "rotate-180")} />
              </button>
              {mobileCategoriesOpen ? (
                <div className="border-b border-line bg-cream/60 px-2 py-2">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/produtos?category=${category.slug}`}
                      className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-ink"
                      onClick={() => setOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              ) : null}

              {NAV_LINKS.filter((link) => link.label === "Contato").map((link) => (
                <Link key={link.label} href={link.href} className="nav-link-mobile border-b border-line">
                  {link.label}
                </Link>
              ))}
              <Link
                href={data?.user ? "/minha-conta" : "/login"}
                className="mt-2 border-t border-line py-3 text-sm font-semibold text-burgundy transition hover:text-wine"
              >
                {data?.user ? "Minha conta" : "Entrar"}
              </Link>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

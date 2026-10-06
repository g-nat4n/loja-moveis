"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Search, SearchX } from "lucide-react";
import { motion } from "motion/react";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { BrandSelect } from "@/components/ui/BrandSelect";
import { Reveal } from "@/components/ui/Reveal";
import { BRAND } from "@/lib/brand";
import { formatBrandPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/types";

export type CuradoriaCard = {
  item: CartItem;
  meta: string;
  category: string;
  style: string;
  sold: boolean;
  alt: string;
};

const PRICE_CHIPS = [
  { id: "all", label: "Todos" },
  { id: "low", label: "Até R$ 2.000" },
  { id: "mid", label: "R$ 2.001–4.000" },
  { id: "high", label: "Acima de R$ 4.000" },
] as const;

const CATEGORY_ORDER = ["Sofás", "Mesas", "Cadeiras e poltronas", "Camas", "Estantes e racks", "Aparadores"];
const STYLE_ORDER = ["Contemporâneo", "Escandinavo", "Orgânico", "Industrial suave", "Nórdico", "Mid-century", "Minimalista"];

function matchesPrice(cents: number, chip: string) {
  if (chip === "low") return cents <= 200000;
  if (chip === "mid") return cents >= 200100 && cents <= 400000;
  if (chip === "high") return cents > 400000;
  return true;
}

export function FeaturedCuradoria({ products }: { products: CuradoriaCard[] }) {
  const { catalog } = BRAND;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [style, setStyle] = useState("");
  const [sort, setSort] = useState("featured");
  const [price, setPrice] = useState("all");
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = CATEGORY_ORDER.filter((item) => products.some((product) => product.category === item));
  const styles = STYLE_ORDER.filter((item) => products.some((product) => product.style === item));

  const visible = useMemo(() => {
    const filtered = products.filter((product) => {
      const haystack = `${product.item.name} ${product.meta} ${product.category} ${product.style}`.toLowerCase();
      if (query && !haystack.includes(query.toLowerCase())) return false;
      if (category && product.category !== category) return false;
      if (style && product.style !== style) return false;
      if (!matchesPrice(product.item.priceCents, price)) return false;
      return true;
    });

    if (sort === "low") return [...filtered].sort((a, b) => a.item.priceCents - b.item.priceCents);
    if (sort === "high") return [...filtered].sort((a, b) => b.item.priceCents - a.item.priceCents);
    return filtered;
  }, [products, query, category, style, sort, price]);

  function clearFilters() {
    setQuery("");
    setCategory("");
    setStyle("");
    setSort("featured");
    setPrice("all");
  }

  return (
    <section id="curadoria" className="w-full bg-sand px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-wine">{catalog.kicker}</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-burgundy sm:text-5xl">{catalog.title}</h2>
              <p className="mt-3 text-sm text-[#5b5a51]">{catalog.note}</p>
            </div>
            <p className="text-sm font-semibold text-forest" aria-live="polite">
              {favorites.length} {favorites.length === 1 ? "favorito" : "favoritos"}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="mt-10 grid gap-3 border-y border-gold/60 py-5 lg:grid-cols-[1.3fr_0.8fr_0.8fr_0.8fr]">
            <div className="relative">
              <label htmlFor="product-search" className="sr-only">
                {catalog.searchLabel}
              </label>
              <Search className="absolute left-4 top-3.5 h-[18px] w-[18px] text-wine" />
              <input
                id="product-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={catalog.searchPlaceholder}
                className="w-full border border-forest/25 bg-ivory py-3 pl-11 pr-4 text-sm text-ink outline-none transition placeholder:text-[#777] hover:border-gold focus:border-gold focus:bg-white"
              />
            </div>
            <BrandSelect
              label={catalog.categoryLabel}
              value={category}
              onChange={setCategory}
              options={[
                { value: "", label: "Todas as categorias" },
                ...categories.map((item) => ({ value: item, label: item })),
              ]}
            />
            <BrandSelect
              label={catalog.styleLabel}
              value={style}
              onChange={setStyle}
              options={[
                { value: "", label: "Todos os estilos" },
                ...styles.map((item) => ({ value: item, label: item })),
              ]}
            />
            <BrandSelect
              label={catalog.sortLabel}
              value={sort}
              onChange={setSort}
              options={[
                { value: "featured", label: "Ordenar: destaque" },
                { value: "low", label: "Menor valor" },
                { value: "high", label: "Maior valor" },
              ]}
            />
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-forest">{catalog.priceLabel}</span>
            <div className="flex flex-wrap gap-2">
              {PRICE_CHIPS.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setPrice(chip.id)}
                  className={cn(
                    "rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-bold text-ink transition hover:bg-black/5",
                    price === chip.id && "border-transparent bg-black/75 text-white hover:bg-black/85",
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {visible.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-ink/20 bg-white p-12 text-center">
            <SearchX className="mx-auto h-8 w-8 text-ink/40" />
            <h3 className="mt-4 font-serif text-2xl text-ink">{catalog.emptyTitle}</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-taupe">{catalog.emptyText}</p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-6 rounded-full bg-black/70 px-5 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-black/85"
            >
              {catalog.clearFilters}
            </button>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((product, index) => {
              const liked = favorites.includes(product.item.productId);
              return (
                <motion.article
                  key={product.item.productId}
                  className="product-card overflow-hidden rounded-3xl border border-ink/8 bg-white shadow-[0_12px_32px_rgba(0,0,0,0.05)]"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="relative h-80 overflow-hidden rounded-t-3xl">
                    <Link href={`/produto/${product.item.slug}`} className="block h-full">
                      {product.item.imageUrl ? (
                        <Image
                          src={product.item.imageUrl}
                          alt={product.alt}
                          fill
                          className={cn(
                            "object-cover transition duration-500 hover:scale-105",
                            product.sold && "grayscale",
                          )}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : null}
                    </Link>
                    {product.sold ? (
                      <div className="pointer-events-none absolute inset-0 bg-ink/40" />
                    ) : null}
                    <button
                      type="button"
                      className={cn(
                        "absolute right-4 top-4 z-10 rounded-full bg-white/90 p-3 text-ink shadow-sm backdrop-blur-sm transition hover:bg-black/10",
                        liked && "text-ink",
                      )}
                      aria-label={`Favoritar ${product.item.name}`}
                      onClick={() =>
                        setFavorites((current) =>
                          current.includes(product.item.productId)
                            ? current.filter((id) => id !== product.item.productId)
                            : [...current, product.item.productId],
                        )
                      }
                    >
                      <Heart className={cn("h-[18px] w-[18px]", liked && "fill-ink")} />
                    </button>
                    {product.sold ? (
                      <span className="absolute left-4 top-4 z-10 rounded-full bg-black/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                        Vendido
                      </span>
                    ) : null}
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between gap-3">
                      <div>
                        <Link href={`/produto/${product.item.slug}`}>
                          <h3 className="font-serif text-xl text-ink">{product.item.name}</h3>
                        </Link>
                        <p className="mt-1 text-xs uppercase tracking-[0.1em] text-taupe">{product.meta}</p>
                      </div>
                      <p className="whitespace-nowrap font-bold text-ink">
                        {formatBrandPrice(product.item.priceCents)}
                      </p>
                    </div>
                    <div className="mt-5">
                      <AddToCartButton
                        sold={product.sold}
                        item={product.item}
                        className="min-h-0 w-full rounded-full border-0 bg-black/70 py-3 text-sm font-bold normal-case tracking-normal text-white backdrop-blur-sm hover:bg-black/85"
                      />
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

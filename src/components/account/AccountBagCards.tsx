"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { RemoveCartButton } from "@/components/cart/RemoveCartButton";
import { InsightAction, InsightCard, InsightRow } from "@/components/account/InsightCard";
import { formatBRL } from "@/lib/format";

export function AccountBagCards() {
  const { items, removeItem, hydrated, subtotalCents } = useCart();

  if (!hydrated) {
    return <p className="mt-4 text-sm text-taupe">Carregando sua sacola...</p>;
  }

  if (items.length === 0) {
    return (
      <p className="mt-4 text-sm text-taupe">
        Sua sacola está vazia.{" "}
        <Link href="/produtos" className="text-burgundy hover:text-wine">
          Ver coleção
        </Link>
      </p>
    );
  }

  const extra = Math.max(items.length - 4, 0);

  return (
    <InsightRow>
      <InsightCard title="Sua sacola">
        <div className={items.length === 1 ? "mt-3" : "mt-3 grid grid-cols-2 gap-1.5"}>
          {items.slice(0, items.length === 1 ? 1 : 4).map((item, index) => (
            <div key={item.productId} className="relative aspect-square overflow-hidden rounded-lg bg-cream">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="100px" />
              ) : null}
              {index === 3 && extra > 0 ? (
                <div className="absolute inset-0 flex items-center justify-center bg-ink/55 text-sm font-semibold text-white">
                  +{extra}
                </div>
              ) : null}
            </div>
          ))}
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-taupe">
          {items.map((item) => item.name).join(", ")}
        </p>
        <p className="mt-2 text-lg font-semibold text-ink">{formatBRL(subtotalCents)}</p>
        <div className="mt-auto pt-4">
          <InsightAction href="/carrinho">Ir para a sacola</InsightAction>
        </div>
      </InsightCard>

      {items.map((item) => (
        <InsightCard key={item.productId} title={item.brand}>
          <Link href={`/produto/${item.slug}`} className="relative mt-3 block">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-cream">
              {item.imageUrl ? (
                <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="180px" />
              ) : null}
            </div>
            <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-snug">{item.name}</p>
            <p className="mt-1 text-xs text-taupe">Tam. {item.size}</p>
            <p className="mt-2 text-lg font-semibold text-ink">{formatBRL(item.priceCents)}</p>
          </Link>
          <div className="mt-auto flex items-center gap-2 pt-4">
            <InsightAction href="/carrinho">Ver sacola</InsightAction>
            <RemoveCartButton onClick={() => removeItem(item.productId)} />
          </div>
        </InsightCard>
      ))}
    </InsightRow>
  );
}

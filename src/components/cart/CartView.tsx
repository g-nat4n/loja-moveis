"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCart } from "@/components/cart/CartProvider";
import { RemoveCartButton } from "@/components/cart/RemoveCartButton";
import { formatBRL } from "@/lib/format";
import { buildCartWhatsAppUrl } from "@/lib/whatsapp";

export function CartView() {
  const { items, removeItem, subtotalCents } = useCart();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<string | null>(null);

  async function applyCoupon(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: coupon, subtotalCents }),
    });
    const data = await response.json();
    if (!response.ok) {
      setDiscount(0);
      setCouponMessage(data.message ?? "Cupom inválido");
      return;
    }
    setDiscount(data.discountCents);
    setCouponMessage(`Cupom ${data.code} aplicado.`);
  }

  return (
    <section className="container-main grid gap-12 py-16 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <p className="eyebrow">Sua seleção</p>
        <h1 className="display mt-2 text-4xl">Sacola</h1>
        {items.length === 0 ? (
          <p className="mt-8 text-sm text-taupe">
            Nenhuma peça por aqui.{" "}
            <Link href="/produtos" className="text-burgundy">
              Ver coleção
            </Link>
          </p>
        ) : (
          <ul className="mt-10 divide-y divide-line">
            {items.map((item) => (
              <li key={item.productId} className="flex gap-5 py-6">
                <div className="relative h-32 w-24 bg-cream">
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-taupe">{item.brand}</p>
                  <Link href={`/produto/${item.slug}`} className="mt-1 block font-serif text-2xl">
                    {item.name}
                  </Link>
                  <p className="mt-1 text-sm text-taupe">
                    Tam. {item.size} · Qtd. {item.quantity}
                  </p>
                  <p className="mt-3">{formatBRL(item.priceCents * item.quantity)}</p>
                </div>
                <RemoveCartButton onClick={() => removeItem(item.productId)} />
              </li>
            ))}
          </ul>
        )}
      </div>
      <aside className="h-fit bg-cream p-8">
        <h2 className="display text-2xl">Resumo</h2>
        <form onSubmit={applyCoupon} className="mt-6">
          <Input label="Cupom" value={coupon} onChange={(event) => setCoupon(event.target.value)} />
          <button type="submit" className="mt-3 text-[11px] uppercase tracking-[0.16em] text-burgundy">
            Aplicar
          </button>
          {couponMessage ? <p className="mt-2 text-xs text-taupe">{couponMessage}</p> : null}
        </form>
        <dl className="mt-8 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatBRL(subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Desconto</dt>
            <dd>- {formatBRL(discount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Frete</dt>
            <dd>Combinar no WhatsApp</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 font-medium">
            <dt>Total</dt>
            <dd>{formatBRL(Math.max(subtotalCents - discount, 0))}</dd>
          </div>
        </dl>
        {items.length > 0 ? (
          <Button
            href={buildCartWhatsAppUrl(items)}
            className="mt-8 w-full"
            target="_blank"
            rel="noopener noreferrer"
          >
            Comprar pelo WhatsApp
          </Button>
        ) : (
          <Button href="/produtos" className="mt-8 w-full">
            Ver móveis
          </Button>
        )}
      </aside>
    </section>
  );
}

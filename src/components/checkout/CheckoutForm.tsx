"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartProvider";
import { formatBRL, formatCep, formatCpf, formatPhone } from "@/lib/format";
import type { ShippingQuote } from "@/types";

export function CheckoutForm({
  defaultName,
  defaultEmail,
}: {
  defaultName: string;
  defaultEmail: string;
}) {
  const router = useRouter();
  const { items, subtotalCents, clear } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [quotes, setQuotes] = useState<ShippingQuote[]>([]);
  const [shippingId, setShippingId] = useState("pickup");
  const [discount, setDiscount] = useState(0);
  const [form, setForm] = useState({
    customerName: defaultName,
    email: defaultEmail,
    cpf: "",
    phone: "",
    zip: "",
    street: "",
    numberAddress: "",
    complement: "",
    district: "",
    city: "",
    state: "",
    couponCode: "",
  });

  const shipping = quotes.find((quote) => quote.id === shippingId);
  const total = Math.max(subtotalCents - discount + (shipping?.priceCents ?? 0), 0);

  function setField(key: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onCepBlur() {
    if (form.zip.replace(/\D/g, "").length !== 8) return;
    const [addressRes, quoteRes] = await Promise.all([
      fetch("/api/shipping/cep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip: form.zip }),
      }),
      fetch("/api/shipping/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zip: form.zip }),
      }),
    ]);
    const address = await addressRes.json();
    const quote = await quoteRes.json();
    if (addressRes.ok) {
      setForm((current) => ({
        ...current,
        street: address.street || current.street,
        district: address.district || current.district,
        city: address.city || current.city,
        state: address.state || current.state,
        zip: address.zip,
      }));
    }
    if (quoteRes.ok) {
      setQuotes(quote.quotes ?? []);
      setShippingId(quote.quotes?.[0]?.id ?? "pickup");
    }
  }

  async function applyCoupon() {
    const response = await fetch("/api/coupons/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: form.couponCode, subtotalCents }),
    });
    const data = await response.json();
    if (!response.ok) {
      setDiscount(0);
      setError(data.message);
      return;
    }
    setDiscount(data.discountCents);
    setError(null);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (items.length === 0) {
      setError("Sua sacola está vazia.");
      return;
    }
    setPending(true);
    setError(null);
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        shippingMethod: shippingId,
        cart: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      }),
    });
    const data = await response.json();
    setPending(false);
    if (!response.ok) {
      setError(data.message ?? "Não foi possível criar o pedido.");
      return;
    }
    clear();
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
      return;
    }
    router.push(`/pedido/${data.orderId}`);
  }

  const summary = useMemo(
    () => (
      <aside className="h-fit bg-cream p-8">
        <h2 className="display text-2xl">Pedido</h2>
        <ul className="mt-6 space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between gap-4">
              <span>
                {item.name} · {item.size}
              </span>
              <span>{formatBRL(item.priceCents)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatBRL(subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Descontos</dt>
            <dd>- {formatBRL(discount)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Frete</dt>
            <dd>{formatBRL(shipping?.priceCents ?? 0)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3">
            <dt>Total</dt>
            <dd>{formatBRL(total)}</dd>
          </div>
        </dl>
      </aside>
    ),
    [items, subtotalCents, discount, shipping, total],
  );

  return (
    <form onSubmit={onSubmit} className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-4">
        <h2 className="display text-2xl">Dados e entrega</h2>
        <Input label="Nome completo" value={form.customerName} onChange={(e) => setField("customerName", e.target.value)} required />
        <Input label="E-mail" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} required />
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="CPF" value={form.cpf} onChange={(e) => setField("cpf", formatCpf(e.target.value))} required />
          <Input label="Telefone" value={form.phone} onChange={(e) => setField("phone", formatPhone(e.target.value))} required />
        </div>
        <Input label="CEP" value={formatCep(form.zip)} onChange={(e) => setField("zip", e.target.value)} onBlur={onCepBlur} required />
        <Input label="Rua" value={form.street} onChange={(e) => setField("street", e.target.value)} required />
        <div className="grid gap-4 md:grid-cols-3">
          <Input label="Número" value={form.numberAddress} onChange={(e) => setField("numberAddress", e.target.value)} required />
          <Input label="Complemento" value={form.complement} onChange={(e) => setField("complement", e.target.value)} />
          <Input label="Bairro" value={form.district} onChange={(e) => setField("district", e.target.value)} required />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Cidade" value={form.city} onChange={(e) => setField("city", e.target.value)} required />
          <Input label="Estado" value={form.state} onChange={(e) => setField("state", e.target.value.toUpperCase())} maxLength={2} required />
        </div>
        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-taupe">Envio</p>
          {quotes.length === 0 ? (
            <p className="text-sm text-taupe">Informe o CEP para ver as opções reais de envio.</p>
          ) : (
            <ul className="space-y-2">
              {quotes.map((quote) => (
                <li key={quote.id}>
                  <label className="flex cursor-pointer items-center justify-between gap-4 border border-line bg-white px-4 py-3 text-sm">
                    <span className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingId === quote.id}
                        onChange={() => setShippingId(quote.id)}
                      />
                      {quote.label}
                    </span>
                    <span>{formatBRL(quote.priceCents)}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Input label="Cupom" value={form.couponCode} onChange={(e) => setField("couponCode", e.target.value)} />
          </div>
          <button type="button" onClick={applyCoupon} className="h-12 text-[11px] uppercase tracking-[0.16em] text-burgundy">
            Aplicar
          </button>
        </div>
        {error ? <p className="text-sm text-wine">{error}</p> : null}
        <Button type="submit" className="w-full" disabled={pending || items.length === 0}>
          {pending ? "Reservando peça..." : "Ir para o pagamento"}
        </Button>
        <p className="text-xs text-taupe">
          PIX, cartão e parcelamento via Mercado Pago. Dados do cartão não são armazenados na Mareli Arte.
        </p>
      </div>
      {summary}
    </form>
  );
}

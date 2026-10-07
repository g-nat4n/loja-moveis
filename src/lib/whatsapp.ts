import { formatBRL } from "@/lib/format";

type WhatsAppItem = {
  name: string;
  slug: string;
  priceCents: number;
  quantity?: number;
};

function whatsappBase() {
  return process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() || "https://wa.me/";
}

function siteBase() {
  return (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

function withText(message: string) {
  const base = whatsappBase();
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppUrl(item: WhatsAppItem) {
  const message = `Olá! Quero comprar pelo WhatsApp o móvel "${item.name}" (${formatBRL(item.priceCents)}).\n${siteBase()}/produto/${item.slug}`;
  return withText(message);
}

export function buildCartWhatsAppUrl(items: WhatsAppItem[]) {
  if (items.length === 0) return whatsappBase();

  const lines = items.map((item, index) => {
    const qty = item.quantity && item.quantity > 1 ? ` x${item.quantity}` : "";
    return `${index + 1}. ${item.name}${qty} — ${formatBRL(item.priceCents * (item.quantity ?? 1))}\n${siteBase()}/produto/${item.slug}`;
  });
  const total = items.reduce((sum, item) => sum + item.priceCents * (item.quantity ?? 1), 0);
  const message = `Olá! Quero comprar pelo WhatsApp estes móveis:\n\n${lines.join("\n\n")}\n\nTotal: ${formatBRL(total)}`;
  return withText(message);
}

import { AdminShell } from "@/components/admin/AdminShell";
import { prisma } from "@/lib/prisma";
import { formatBRL } from "@/lib/format";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Atelier",
  path: "/admin",
  noIndex: true,
});

export default async function AdminHome() {
  const [products, orders, available, sold] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.product.count({ where: { status: "AVAILABLE" } }),
    prisma.product.count({ where: { status: "SOLD" } }),
  ]);
  const revenue = await prisma.order.aggregate({
    _sum: { totalCents: true },
    where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
  });

  const cards = [
    { label: "Peças no acervo", value: String(products) },
    { label: "Disponíveis", value: String(available) },
    { label: "Vendidas", value: String(sold) },
    { label: "Pedidos", value: String(orders) },
    { label: "Receita confirmada", value: formatBRL(revenue._sum.totalCents ?? 0) },
  ];

  return (
    <AdminShell>
      <p className="eyebrow">Painel</p>
      <h1 className="display mt-2 text-4xl">Atelier Mareli</h1>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <article key={card.label} className="border border-line bg-white p-6">
            <p className="text-[11px] uppercase tracking-[0.18em] text-taupe">{card.label}</p>
            <p className="display mt-3 text-3xl">{card.value}</p>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}

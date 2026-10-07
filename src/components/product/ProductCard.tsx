import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatBRL } from "@/lib/format";
import { buildProductWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

export type ProductCardProduct = Prisma.ProductGetPayload<{
  include: { images: true; category: true };
}>;

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const image = product.images[0];
  const sold = product.status !== "AVAILABLE" || product.stock <= 0;
  const whatsappUrl = buildProductWhatsAppUrl({
    name: product.name,
    slug: product.slug,
    priceCents: product.priceCents,
  });

  return (
    <article className="group flex h-full flex-col">
      <Link href={`/produto/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-sand shadow-[0_12px_32px_rgba(89,66,56,0.06)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_rgba(89,66,56,0.1)]">
          {image ? (
            <SafeImage
              src={image.url}
              alt={image.alt || product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className={cn("object-cover transition duration-700 group-hover:scale-[1.04]", sold && "grayscale")}
            />
          ) : null}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {sold ? <Badge tone="ink">Vendido</Badge> : null}
            {product.uniquePiece && !sold ? <Badge tone="forest">Exclusivo</Badge> : null}
            {product.stock === 1 && !sold ? <Badge tone="wine">Última unidade</Badge> : null}
          </div>
        </div>
        <div className="px-1 pt-3.5">
          <p className="text-xs text-taupe">
            {product.widthCm} × {product.depthCm} × {product.heightCm} cm
          </p>
          <h3 className="mt-1 font-serif text-base font-semibold text-burgundy">{product.name}</h3>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-taupe">{product.brand}</p>
          <p className="mt-1.5 text-sm font-bold text-burgundy">{formatBRL(product.priceCents)}</p>
        </div>
      </Link>
      {!sold ? (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-full bg-burgundy px-4 text-[10px] font-bold uppercase tracking-[0.14em] text-white transition hover:bg-wine"
        >
          Comprar pelo WhatsApp
        </a>
      ) : null}
    </article>
  );
}

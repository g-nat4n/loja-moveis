import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatBRL } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

export type ProductCardProduct = Prisma.ProductGetPayload<{
  include: { images: true; category: true };
}>;

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const image = product.images[0];
  const sold = product.status !== "AVAILABLE" || product.stock <= 0;

  return (
    <article className="group h-full">
      <Link href={`/produto/${product.slug}`} className="block h-full">
        <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-sand shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_18px_40px_rgba(0,0,0,0.1)]">
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
            {sold ? (
              <span className="rounded-full bg-burgundy/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ivory backdrop-blur-sm">
                Vendido
              </span>
            ) : null}
            {product.uniquePiece && !sold ? (
              <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-ink backdrop-blur-sm">
                Exclusivo
              </span>
            ) : null}
            {product.stock === 1 && !sold ? <Badge tone="wine">Última unidade</Badge> : null}
          </div>
          {!sold ? (
            <span className="absolute inset-x-3 bottom-3 translate-y-4 rounded-full bg-burgundy/90 py-2.5 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-ivory opacity-0 backdrop-blur-sm transition group-hover:translate-y-0 group-hover:opacity-100">
              Ver móvel
            </span>
          ) : null}
        </div>
        <div className="px-1 pt-3.5">
          <p className="text-xs text-taupe">
            {product.widthCm} × {product.depthCm} × {product.heightCm} cm
          </p>
          <h3 className="mt-1 text-sm font-bold text-ink">{product.name}</h3>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-taupe">{product.brand}</p>
          <p className="mt-1.5 text-sm font-bold text-ink">{formatBRL(product.priceCents)}</p>
        </div>
      </Link>
    </article>
  );
}

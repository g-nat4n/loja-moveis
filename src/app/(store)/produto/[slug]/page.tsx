import { notFound } from "next/navigation";
import { StoreShell } from "@/components/layout/StoreShell";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductCard } from "@/components/product/ProductCard";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { ShippingEstimator } from "@/components/product/ShippingEstimator";
import { Badge } from "@/components/ui/Badge";
import { getProductBySlug, getRelatedProducts } from "@/services/product.service";
import { CONDITION_LABELS } from "@/lib/constants";
import { formatBRL } from "@/lib/format";
import { createMetadata, productJsonLd } from "@/lib/seo";
import { BuyNowButton } from "@/components/cart/BuyNowButton";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return createMetadata({ title: "Móvel não encontrado", noIndex: true });
  return createMetadata({
    title: product.name,
    description: product.description,
    path: `/produto/${product.slug}`,
    image: product.images[0]?.url,
  });
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts({
    id: product.id,
    categoryId: product.categoryId,
    lookId: product.lookId,
    color: product.color,
    brand: product.brand,
    priceCents: product.priceCents,
  });
  const lookPieces = product.look?.products.filter((item) => item.id !== product.id) ?? [];
  const available = product.status === "AVAILABLE" && product.stock > 0;
  const measurements = (product.measurements ?? {}) as Record<string, string>;
  const jsonLd = productJsonLd({
    name: product.name,
    description: product.description,
    slug: product.slug,
    brand: product.brand,
    priceCents: product.priceCents,
    imageUrl: product.images[0]?.url,
    available,
  });

  return (
    <StoreShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="container-main grid gap-12 py-12 lg:grid-cols-2 lg:py-20">
        <ProductGallery
          images={product.images.map((image) => ({ url: image.url, alt: image.alt }))}
          name={product.name}
          sold={!available}
        />
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-taupe">
            {product.brand} · {product.category.name}
          </p>
          <h1 className="display mt-3 text-4xl md:text-5xl">{product.name}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.uniquePiece ? <Badge>Exclusivo</Badge> : null}
            {product.stock === 1 && available ? <Badge tone="wine">Última unidade disponível</Badge> : null}
            {!available ? <Badge tone="ink">Vendido</Badge> : null}
          </div>
          <p className="mt-6 font-serif text-3xl font-semibold text-gold">{formatBRL(product.priceCents)}</p>
          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-taupe">Porte</dt>
              <dd className="mt-1">{product.size}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-taupe">Cor</dt>
              <dd className="mt-1">{product.color}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-taupe">Condição</dt>
              <dd className="mt-1">{CONDITION_LABELS[product.condition]}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-taupe">Estoque</dt>
              <dd className="mt-1">{available ? `${product.stock} unidade${product.stock > 1 ? "s" : ""}` : "Indisponível"}</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-taupe">Largura</dt>
              <dd className="mt-1">{product.widthCm} cm</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-taupe">Profundidade</dt>
              <dd className="mt-1">{product.depthCm} cm</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-taupe">Altura</dt>
              <dd className="mt-1">{product.heightCm} cm</dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.16em] text-taupe">Material</dt>
              <dd className="mt-1">{product.material ?? "—"}</dd>
            </div>
          </dl>
          <p className="mt-8 text-sm leading-relaxed text-taupe">{product.description}</p>
          {product.story ? (
            <p className="mt-4 font-serif italic text-burgundy">{product.story}</p>
          ) : null}
          {measurements.notes ? (
            <div className="mt-8">
              <p className="text-[11px] uppercase tracking-[0.2em] text-taupe">Observações de medida</p>
              <p className="mt-2 text-sm text-ink">{measurements.notes}</p>
            </div>
          ) : null}
          <div className="mt-8 space-y-3">
            <AddToCartButton
              sold={!available}
              item={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                brand: product.brand,
                size: product.size,
                priceCents: product.priceCents,
                imageUrl: product.images[0]?.url ?? null,
                uniquePiece: product.uniquePiece,
                stock: product.stock,
                quantity: 1,
              }}
            />
            {available ? (
              <BuyNowButton
                item={{
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  brand: product.brand,
                  size: product.size,
                  priceCents: product.priceCents,
                  imageUrl: product.images[0]?.url ?? null,
                  uniquePiece: product.uniquePiece,
                  stock: product.stock,
                  quantity: 1,
                }}
              />
            ) : null}
          </div>
          <div className="mt-8">
            <ShippingEstimator />
          </div>
        </div>
      </section>

      {lookPieces.length > 0 ? (
        <section className="container-main pb-16">
          <p className="eyebrow">Complete o ambiente</p>
          <h2 className="display mt-2 text-3xl">{product.look?.name}</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {lookPieces.map((item) => (
              <ProductCard key={item.id} product={{ ...item, category: product.category }} />
            ))}
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="container-main pb-24">
          <p className="eyebrow">Mesma categoria</p>
          <h2 className="display mt-2 text-3xl">Outros móveis na mesma direção</h2>
          <div className="mt-8 grid grid-cols-2 gap-6 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </StoreShell>
  );
}

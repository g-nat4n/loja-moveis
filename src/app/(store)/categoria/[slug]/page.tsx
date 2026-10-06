import { notFound } from "next/navigation";
import { StoreShell } from "@/components/layout/StoreShell";
import { CatalogGrid } from "@/components/product/CatalogGrid";
import { getCategoryBySlug } from "@/services/category.service";
import { listPublicProducts } from "@/services/product.service";
import { createMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return createMetadata({ title: "Categoria", noIndex: true });
  return createMetadata({
    title: category.name,
    description: category.description ?? `Móveis da categoria ${category.name} na Morada.`,
    path: `/categoria/${slug}`,
  });
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();
  const products = await listPublicProducts({ category: slug });

  return (
    <StoreShell>
      <section className="container-main py-16">
        <p className="eyebrow">Categoria</p>
        <h1 className="display mt-2 text-5xl">{category.name}</h1>
        {category.description ? (
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-taupe">{category.description}</p>
        ) : null}
        {products.length === 0 ? (
          <p className="mt-16 text-sm text-taupe">Nenhum móvel nesta categoria no momento.</p>
        ) : (
          <div className="mt-2">
            <CatalogGrid products={products} />
          </div>
        )}
      </section>
    </StoreShell>
  );
}

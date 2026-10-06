import { StoreShell } from "@/components/layout/StoreShell";
import { CatalogGrid } from "@/components/product/CatalogGrid";
import { CatalogToolbar } from "@/components/product/CatalogToolbar";
import { CombinationGrid } from "@/components/product/CombinationGrid";
import { listPublicProducts, getCatalogFacets, findSpaceCombinations } from "@/services/product.service";
import { productFilterSchema } from "@/lib/validations";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Móveis",
  description: "Explore a Morada: móveis exclusivos, filtros por porte, marca, condição e disponibilidade.",
  path: "/produtos",
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const raw = await searchParams;
  const parsed = productFilterSchema.parse({
    q: typeof raw.q === "string" ? raw.q : undefined,
    category: typeof raw.category === "string" ? raw.category : undefined,
    size: typeof raw.size === "string" ? raw.size : undefined,
    brand: typeof raw.brand === "string" ? raw.brand : undefined,
    condition: typeof raw.condition === "string" ? raw.condition : undefined,
    availability: raw.availability === "sold" || raw.availability === "all" ? raw.availability : "available",
    min: raw.min,
    max: raw.max,
    sort: raw.sort,
    spaceWidth: typeof raw.spaceWidth === "string" && raw.spaceWidth ? raw.spaceWidth : undefined,
    spaceHeight: typeof raw.spaceHeight === "string" && raw.spaceHeight ? raw.spaceHeight : undefined,
    spaceDepth: typeof raw.spaceDepth === "string" && raw.spaceDepth ? raw.spaceDepth : undefined,
    fitMode: raw.fitMode === "combo" ? "combo" : "single",
  });

  const fitMode = parsed.fitMode === "combo" && parsed.spaceWidth ? "combo" : "single";
  const hasSpace =
    typeof parsed.spaceWidth === "number" ||
    typeof parsed.spaceHeight === "number" ||
    typeof parsed.spaceDepth === "number";

  const [facets, products, combinations] = await Promise.all([
    getCatalogFacets(),
    fitMode === "single" ? listPublicProducts(parsed) : Promise.resolve([]),
    fitMode === "combo" ? findSpaceCombinations(parsed) : Promise.resolve([]),
  ]);

  return (
    <StoreShell>
      <section className="container-main py-16">
        <p className="eyebrow-wine">Catálogo</p>
        <h1 className="display mt-2 text-5xl">Móveis</h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-taupe">
          Informe suas medidas em Escolha sob medida: um móvel só, ou uma combinação que some no espaço.
        </p>
        <CatalogToolbar facets={facets} current={{ ...parsed, fitMode }} />
        {hasSpace ? (
          <p className="mt-6 text-sm text-taupe">
            {fitMode === "combo"
              ? combinations.length === 0
                ? "Nenhuma combinação cabe nessas medidas com os filtros atuais."
                : `${combinations.length} combinação${combinations.length === 1 ? "" : "ões"} cabem no espaço (soma das larguras).`
              : products.length === 0
                ? "Nenhum móvel cabe nessas medidas com os filtros atuais."
                : `${products.length} móvel${products.length === 1 ? "" : "eis"} cabem no espaço informado.`}
          </p>
        ) : null}

        {fitMode === "combo" ? (
          <CombinationGrid combinations={combinations} spaceWidth={parsed.spaceWidth} />
        ) : products.length === 0 ? (
          <p className="mt-16 text-sm text-taupe">Nenhum móvel encontrado com esses filtros.</p>
        ) : (
          <CatalogGrid products={products} />
        )}
      </section>
    </StoreShell>
  );
}

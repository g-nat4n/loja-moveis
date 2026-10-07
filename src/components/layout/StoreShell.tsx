import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { getCatalogFacets } from "@/services/product.service";

export async function StoreShell({ children }: { children: React.ReactNode }) {
  const facets = await getCatalogFacets();
  const categories = facets.categories.map((category) => ({
    name: category.name,
    slug: category.slug,
  }));

  return (
    <div id="topo" className="flex min-h-dvh flex-col">
      <Header categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer className="mt-auto" categories={categories} />
      <CartDrawer />
    </div>
  );
}

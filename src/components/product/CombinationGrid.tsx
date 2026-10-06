import Link from "next/link";
import { SafeImage } from "@/components/ui/SafeImage";
import { formatBRL } from "@/lib/format";
import type { SpaceCombination } from "@/services/product.service";

export function CombinationGrid({
  combinations,
  spaceWidth,
}: {
  combinations: SpaceCombination[];
  spaceWidth?: number;
}) {
  if (combinations.length === 0) {
    return <p className="mt-16 text-sm text-taupe">Nenhuma combinação cabe nessas medidas.</p>;
  }

  return (
    <div className="mt-10 grid gap-6">
      {combinations.map((combo, index) => (
        <article key={combo.id} className="rounded-3xl border border-ink/10 bg-white p-5 shadow-[0_12px_32px_rgba(0,0,0,0.05)]">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink/8 pb-4">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ink/45">
                Combinação {index + 1} · {combo.items.length} móveis
              </p>
              <p className="mt-1 font-serif text-2xl text-ink">
                {combo.totalWidthCm} cm
                {spaceWidth ? (
                  <span className="ml-2 text-base text-taupe">
                    de {spaceWidth} cm · sobram {combo.leftoverWidthCm ?? 0} cm
                  </span>
                ) : null}
              </p>
            </div>
            <p className="text-sm font-bold text-ink">{formatBRL(combo.totalPriceCents)}</p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {combo.items.map((item, itemIndex) => {
              const image = item.images[0];
              return (
                <div key={item.id} className="relative">
                  {itemIndex > 0 ? (
                    <span className="absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 text-lg font-serif text-ink/25 sm:block">
                      +
                    </span>
                  ) : null}
                  <Link href={`/produto/${item.slug}`} className="block overflow-hidden rounded-2xl border border-ink/8 transition hover:border-ink/25 hover:shadow-md">
                    <div className="relative aspect-[4/3] bg-sand">
                      {image ? (
                        <SafeImage
                          src={image.url}
                          alt={image.alt || item.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 25vw"
                          className="object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-taupe">
                        {item.widthCm} × {item.depthCm} × {item.heightCm} cm
                      </p>
                      <h3 className="mt-1 font-serif text-lg text-ink">{item.name}</h3>
                      <p className="mt-1 text-sm font-semibold text-ink">{formatBRL(item.priceCents)}</p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </article>
      ))}
    </div>
  );
}

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Ruler } from "lucide-react";
import { CONDITION_LABELS } from "@/lib/constants";
import { BrandSelect } from "@/components/ui/BrandSelect";
import { cn } from "@/lib/utils";

type Facets = {
  brands: string[];
  sizes: string[];
  categories: { name: string; slug: string }[];
};

export function CatalogToolbar({
  facets,
  current,
}: {
  facets: Facets;
  current: Record<string, string | number | undefined>;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const hasSpaceFilter = Boolean(current.spaceWidth || current.spaceHeight || current.spaceDepth);
  const [measureOpen, setMeasureOpen] = useState(hasSpaceFilter);
  const fitMode = current.fitMode === "combo" ? "combo" : "single";

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    router.push(`/produtos?${next.toString()}`);
  }

  function applySpace(form: HTMLFormElement) {
    const data = new FormData(form);
    const next = new URLSearchParams(params.toString());
    for (const key of ["spaceWidth", "spaceHeight", "spaceDepth"] as const) {
      const raw = String(data.get(key) ?? "").trim();
      if (raw) next.set(key, raw);
      else next.delete(key);
    }
    const mode = String(data.get("fitMode") || "single");
    if (mode === "combo") next.set("fitMode", "combo");
    else next.delete("fitMode");
    router.push(`/produtos?${next.toString()}`);
  }

  function clearSpace() {
    const next = new URLSearchParams(params.toString());
    next.delete("spaceWidth");
    next.delete("spaceHeight");
    next.delete("spaceDepth");
    next.delete("fitMode");
    router.push(`/produtos?${next.toString()}`);
  }

  return (
    <div className="mt-10 space-y-6">
      <div className="border border-ink/10 bg-cream/60 rounded-3xl overflow-hidden">
        <button
          type="button"
          onClick={() => setMeasureOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-black/5"
          aria-expanded={measureOpen}
        >
          <span className="flex items-center gap-3">
            <Ruler className="h-5 w-5 text-ink/60" strokeWidth={1.75} />
            <span>
              <span className="block text-[11px] font-bold uppercase tracking-[0.22em] text-ink/70">
                Escolha sob medida
              </span>
              <span className="mt-1 block text-sm text-taupe">
                Informe o espaço e escolha 1 móvel ou uma combinação que some nesse vão.
              </span>
            </span>
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-taupe">
            {measureOpen ? "Fechar" : "Abrir"}
          </span>
        </button>

        <div
          className={cn(
            "grid overflow-hidden border-t border-line transition-[grid-template-rows] duration-300",
            measureOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
          )}
        >
          <div className="min-h-0">
            <form
              className="grid gap-4 px-5 py-5"
              onSubmit={(event) => {
                event.preventDefault();
                applySpace(event.currentTarget);
              }}
            >
              <fieldset className="grid gap-3 sm:grid-cols-2">
                <legend className="mb-1 text-xs text-taupe">Como encaixar no espaço</legend>
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition",
                    fitMode === "single" ? "border-ink/20 bg-black/75 text-ivory" : "border-ink/10 bg-ivory hover:bg-black/5",
                  )}
                >
                  <input type="radio" name="fitMode" value="single" defaultChecked={fitMode === "single"} className="mt-1" />
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-[0.14em]">1 móvel</span>
                    <span className={cn("mt-1 block text-sm", fitMode === "single" ? "text-white/70" : "text-taupe")}>
                      Um único móvel que cabe nas medidas informadas.
                    </span>
                  </span>
                </label>
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition",
                    fitMode === "combo" ? "border-ink/20 bg-black/75 text-ivory" : "border-ink/10 bg-ivory hover:bg-black/5",
                  )}
                >
                  <input type="radio" name="fitMode" value="combo" defaultChecked={fitMode === "combo"} className="mt-1" />
                  <span>
                    <span className="block text-xs font-bold uppercase tracking-[0.14em]">Combinação</span>
                    <span className={cn("mt-1 block text-sm", fitMode === "combo" ? "text-white/70" : "text-taupe")}>
                      Soma de 2 ou 3 móveis lado a lado que cabem na largura.
                    </span>
                  </span>
                </label>
              </fieldset>

              <div className="grid gap-4 md:grid-cols-4">
                <label className="text-xs text-taupe">
                  Largura disponível (cm)
                  <input
                    name="spaceWidth"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Ex.: 200"
                    defaultValue={typeof current.spaceWidth === "number" ? current.spaceWidth : ""}
                    className="mt-2 h-11 w-full border border-line bg-ivory px-3 text-sm text-ink outline-none transition placeholder:text-[#999] hover:border-ink focus:border-ink"
                  />
                </label>
                <label className="text-xs text-taupe">
                  Profundidade disponível (cm)
                  <input
                    name="spaceDepth"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Ex.: 90"
                    defaultValue={typeof current.spaceDepth === "number" ? current.spaceDepth : ""}
                    className="mt-2 h-11 w-full border border-line bg-ivory px-3 text-sm text-ink outline-none transition placeholder:text-[#999] hover:border-ink focus:border-ink"
                  />
                </label>
                <label className="text-xs text-taupe">
                  Altura disponível (cm)
                  <input
                    name="spaceHeight"
                    type="number"
                    min="1"
                    step="1"
                    placeholder="Ex.: 80"
                    defaultValue={typeof current.spaceHeight === "number" ? current.spaceHeight : ""}
                    className="mt-2 h-11 w-full border border-line bg-ivory px-3 text-sm text-ink outline-none transition placeholder:text-[#999] hover:border-ink focus:border-ink"
                  />
                </label>
                <div className="flex items-end gap-2">
                  <button
                    type="submit"
                    className="h-11 flex-1 rounded-full bg-black/70 px-4 text-xs font-bold uppercase tracking-[0.14em] text-ivory backdrop-blur-sm transition hover:bg-black/85"
                  >
                    Ver que cabem
                  </button>
                  {hasSpaceFilter ? (
                    <button
                      type="button"
                      onClick={clearSpace}
                      className="h-11 rounded-full border border-ink/15 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-taupe transition hover:bg-black/5 hover:text-ink"
                    >
                      Limpar
                    </button>
                  ) : null}
                </div>
              </div>
            </form>
            <p className="border-t border-line px-5 py-3 text-xs leading-relaxed text-taupe">
              Em <strong className="font-semibold text-ink">1 móvel</strong>, cada peça precisa caber sozinha. Em{" "}
              <strong className="font-semibold text-ink">combinação</strong>, somamos as larguras de 2 ou 3 peças lado a
              lado (profundidade e altura ainda precisam caber em cada uma). Informe a largura para usar combinação.
            </p>
          </div>
        </div>
      </div>

      <form
        className="grid gap-3 border-y border-line py-6 md:grid-cols-4 lg:grid-cols-7"
        onSubmit={(event) => event.preventDefault()}
      >
        <label className="text-xs text-taupe">
          Busca
          <input
            defaultValue={typeof current.q === "string" ? current.q : ""}
            name="q"
            className="mt-2 h-11 w-full border border-line bg-ivory px-3 text-sm text-ink outline-none transition placeholder:text-[#999] hover:border-ink focus:border-ink"
            onBlur={(event) => update("q", event.target.value)}
          />
        </label>
        <Field label="Categoria">
          <BrandSelect
            label="Categoria"
            value={String(current.category ?? "")}
            onChange={(value) => update("category", value)}
            triggerClassName="mt-2 h-11 py-0"
            options={[
              { value: "", label: "Todas" },
              ...facets.categories.map((category) => ({ value: category.slug, label: category.name })),
            ]}
          />
        </Field>
        <Field label="Porte">
          <BrandSelect
            label="Porte"
            value={String(current.size ?? "")}
            onChange={(value) => update("size", value)}
            triggerClassName="mt-2 h-11 py-0"
            options={[
              { value: "", label: "Todos" },
              ...facets.sizes.map((size) => ({ value: size, label: size })),
            ]}
          />
        </Field>
        <Field label="Marca">
          <BrandSelect
            label="Marca"
            value={String(current.brand ?? "")}
            onChange={(value) => update("brand", value)}
            triggerClassName="mt-2 h-11 py-0"
            options={[
              { value: "", label: "Todas" },
              ...facets.brands.map((brand) => ({ value: brand, label: brand })),
            ]}
          />
        </Field>
        <Field label="Condição">
          <BrandSelect
            label="Condição"
            value={String(current.condition ?? "")}
            onChange={(value) => update("condition", value)}
            triggerClassName="mt-2 h-11 py-0"
            options={[
              { value: "", label: "Todas" },
              ...Object.entries(CONDITION_LABELS).map(([value, label]) => ({ value, label })),
            ]}
          />
        </Field>
        <Field label="Disponibilidade">
          <BrandSelect
            label="Disponibilidade"
            value={String(current.availability ?? "available")}
            onChange={(value) => update("availability", value)}
            triggerClassName="mt-2 h-11 py-0"
            options={[
              { value: "available", label: "Disponíveis" },
              { value: "sold", label: "Vendidos" },
              { value: "all", label: "Todos" },
            ]}
          />
        </Field>
        <Field label="Ordenar">
          <BrandSelect
            label="Ordenar"
            value={String(current.sort ?? "recent")}
            onChange={(value) => update("sort", value)}
            triggerClassName="mt-2 h-11 py-0"
            options={[
              { value: "recent", label: "Mais recentes" },
              { value: "price-asc", label: "Menor preço" },
              { value: "price-desc", label: "Maior preço" },
              { value: "name", label: "Nome" },
            ]}
          />
        </Field>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="text-xs text-taupe">
      {label}
      {children}
    </div>
  );
}

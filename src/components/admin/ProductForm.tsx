"use client";

import { useActionState } from "react";
import { saveProductAction } from "@/app/admin/actions";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CONDITION_LABELS, PRODUCT_STATUS_LABELS } from "@/lib/constants";
import type { Prisma } from "@prisma/client";

type Product = Prisma.ProductGetPayload<{ include: { images: true } }>;

export function ProductForm({
  product,
  categories,
  looks,
}: {
  product?: Product;
  categories: { id: string; name: string }[];
  looks: { id: string; name: string }[];
}) {
  const measurements = (product?.measurements ?? {}) as Record<string, string>;
  const [state, formAction, pending] = useActionState(saveProductAction, null);

  return (
    <form action={formAction} className="mt-8 grid max-w-3xl gap-4">
      {product ? <input type="hidden" name="id" value={product.id} /> : null}
      {state?.error ? <p className="border border-wine/30 bg-wine/10 px-4 py-3 text-sm text-wine">{state.error}</p> : null}
      <Input label="Nome" name="name" defaultValue={product?.name} required />
      <Textarea label="Descrição" name="description" defaultValue={product?.description} required minLength={3} />
      <Textarea label="História do móvel" name="story" defaultValue={product?.story ?? ""} />
      <div className="grid gap-4 md:grid-cols-3">
        <Input label="Marca" name="brand" defaultValue={product?.brand} required />
        <Input label="Porte" name="size" defaultValue={product?.size} placeholder="Compacto, Médio ou Grande" required />
        <Input label="Cor" name="color" defaultValue={product?.color} required />
      </div>
      <div className="rounded-none border border-gold/40 bg-sand/30 p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-wine">Medidas (obrigatórias)</p>
        <p className="mt-1 text-xs text-taupe">Usadas no filtro Escolha sob medida da loja.</p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Input
            label="Largura (cm)"
            name="widthCm"
            type="number"
            step="0.1"
            min="1"
            defaultValue={product?.widthCm ?? ""}
            required
          />
          <Input
            label="Profundidade (cm)"
            name="depthCm"
            type="number"
            step="0.1"
            min="1"
            defaultValue={product?.depthCm ?? ""}
            required
          />
          <Input
            label="Altura (cm)"
            name="heightCm"
            type="number"
            step="0.1"
            min="1"
            defaultValue={product?.heightCm ?? ""}
            required
          />
        </div>
        <div className="mt-4">
          <Input label="Observações de medida" name="measureNotes" defaultValue={measurements.notes ?? ""} />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Select label="Condição" name="condition" defaultValue={product?.condition ?? "EXCELLENT"}>
          {Object.entries(CONDITION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <Select label="Status" name="status" defaultValue={product?.status ?? "AVAILABLE"}>
          {Object.entries(PRODUCT_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          label="Preço (R$)"
          name="price"
          type="number"
          step="0.01"
          min="0.01"
          defaultValue={product ? product.priceCents / 100 : ""}
          required
        />
        <Input
          label="De (opcional)"
          name="compareAt"
          type="number"
          step="0.01"
          defaultValue={product?.compareAtCents ? product.compareAtCents / 100 : ""}
        />
        <Input label="Estoque" name="stock" type="number" defaultValue={product?.stock ?? 1} />
      </div>
      <Select label="Categoria" name="categoryId" defaultValue={product?.categoryId} required>
        <option value="">Selecione</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
      <Select label="Ambiente / look" name="lookId" defaultValue={product?.lookId ?? ""}>
        <option value="">Nenhum</option>
        {looks.map((look) => (
          <option key={look.id} value={look.id}>
            {look.name}
          </option>
        ))}
      </Select>
      <Input label="Material" name="material" defaultValue={product?.material ?? ""} />
      <Input label="URL da imagem (opcional)" name="imageUrl" defaultValue="" />
      <label className="block text-[11px] font-semibold uppercase tracking-[0.2em] text-taupe">
        Fotos do computador
        <input
          type="file"
          name="photos"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          className="mt-2 block w-full text-sm font-normal normal-case tracking-normal text-ink file:mr-3 file:border-0 file:bg-gold file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-[0.12em] file:text-ink"
        />
      </label>
      <p className="text-xs text-taupe">Pode escolher várias fotos. Elas entram no catálogo junto com o móvel.</p>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={product?.featured} />
        Destaque na home
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="uniquePiece" defaultChecked={product?.uniquePiece ?? true} />
        Peça exclusiva
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? "Salvando..." : "Salvar móvel"}
      </Button>
    </form>
  );
}

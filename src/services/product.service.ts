import { Prisma, ProductStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { ProductFormInput } from "@/lib/validations";

const catalogInclude = {
  images: { orderBy: { sortOrder: "asc" as const } },
  category: true,
  look: {
    include: {
      products: {
        include: { images: { orderBy: { sortOrder: "asc" as const } } },
        where: { status: ProductStatus.AVAILABLE },
      },
    },
  },
} satisfies Prisma.ProductInclude;

export type CatalogFilters = {
  q?: string;
  category?: string;
  size?: string;
  brand?: string;
  condition?: string;
  availability?: "available" | "sold" | "all";
  min?: number;
  max?: number;
  sort?: "recent" | "price-asc" | "price-desc" | "name";
  spaceWidth?: number;
  spaceHeight?: number;
  spaceDepth?: number;
  fitMode?: "single" | "combo";
};

export type CatalogProduct = Prisma.ProductGetPayload<{
  include: { images: true; category: true };
}>;

export type SpaceCombination = {
  id: string;
  items: CatalogProduct[];
  totalWidthCm: number;
  totalPriceCents: number;
  leftoverWidthCm: number | null;
};

function buildCatalogWhere(filters: CatalogFilters, options?: { ignoreSpaceWidth?: boolean }): Prisma.ProductWhereInput {
  const where: Prisma.ProductWhereInput = {};

  if (filters.availability === "sold") {
    where.status = ProductStatus.SOLD;
  } else if (filters.availability === "all") {
    where.status = { in: [ProductStatus.AVAILABLE, ProductStatus.SOLD, ProductStatus.RESERVED] };
  } else {
    where.status = ProductStatus.AVAILABLE;
    where.stock = { gt: 0 };
  }

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { brand: { contains: filters.q, mode: "insensitive" } },
      { description: { contains: filters.q, mode: "insensitive" } },
    ];
  }
  if (filters.category) where.category = { slug: filters.category };
  if (filters.size) where.size = { equals: filters.size, mode: "insensitive" };
  if (filters.brand) where.brand = { equals: filters.brand, mode: "insensitive" };
  if (filters.condition) where.condition = filters.condition as Prisma.EnumProductConditionFilter;
  if (filters.min || filters.max) {
    where.priceCents = {
      gte: filters.min ? Math.round(filters.min * 100) : undefined,
      lte: filters.max ? Math.round(filters.max * 100) : undefined,
    };
  }

  if (!options?.ignoreSpaceWidth && filters.spaceWidth) where.widthCm = { lte: filters.spaceWidth };
  if (filters.spaceHeight) where.heightCm = { lte: filters.spaceHeight };
  if (filters.spaceDepth) where.depthCm = { lte: filters.spaceDepth };

  return where;
}

export async function listPublicProducts(filters: CatalogFilters = {}) {
  const where = buildCatalogWhere(filters);

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    filters.sort === "price-asc"
      ? { priceCents: "asc" }
      : filters.sort === "price-desc"
        ? { priceCents: "desc" }
        : filters.sort === "name"
          ? { name: "asc" }
          : { createdAt: "desc" };

  return prisma.product.findMany({
    where,
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: true,
    },
    orderBy,
  });
}

/**
 * Combinações de 2–3 móveis lado a lado cuja soma das larguras cabe no espaço.
 * Cada peça ainda precisa caber em profundidade e altura.
 */
export async function findSpaceCombinations(filters: CatalogFilters, limit = 12): Promise<SpaceCombination[]> {
  const spaceWidth = filters.spaceWidth;
  if (!spaceWidth) return [];

  const candidates = await prisma.product.findMany({
    where: buildCatalogWhere(filters, { ignoreSpaceWidth: true }),
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
      category: true,
    },
    orderBy: { widthCm: "asc" },
    take: 40,
  });

  // Cada peça sozinha precisa caber na largura total (não pode ser maior que o vão)
  const pool = candidates.filter((item) => item.widthCm <= spaceWidth);
  const combos: SpaceCombination[] = [];

  for (let i = 0; i < pool.length; i++) {
    for (let j = i + 1; j < pool.length; j++) {
      const a = pool[i];
      const b = pool[j];
      const totalWidthCm = a.widthCm + b.widthCm;
      if (totalWidthCm > spaceWidth) continue;
      combos.push({
        id: `${a.id}+${b.id}`,
        items: [a, b],
        totalWidthCm,
        totalPriceCents: a.priceCents + b.priceCents,
        leftoverWidthCm: Math.round((spaceWidth - totalWidthCm) * 10) / 10,
      });
    }
  }

  for (let i = 0; i < pool.length; i++) {
    for (let j = i + 1; j < pool.length; j++) {
      for (let k = j + 1; k < pool.length; k++) {
        const a = pool[i];
        const b = pool[j];
        const c = pool[k];
        const totalWidthCm = a.widthCm + b.widthCm + c.widthCm;
        if (totalWidthCm > spaceWidth) continue;
        combos.push({
          id: `${a.id}+${b.id}+${c.id}`,
          items: [a, b, c],
          totalWidthCm,
          totalPriceCents: a.priceCents + b.priceCents + c.priceCents,
          leftoverWidthCm: Math.round((spaceWidth - totalWidthCm) * 10) / 10,
        });
      }
    }
  }

  return combos
    .sort((left, right) => {
      const leftGap = left.leftoverWidthCm ?? spaceWidth;
      const rightGap = right.leftoverWidthCm ?? spaceWidth;
      if (leftGap !== rightGap) return leftGap - rightGap;
      return left.totalPriceCents - right.totalPriceCents;
    })
    .slice(0, limit);
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: catalogInclude,
  });
}

export async function getProductsBySlugs(slugs: string[]) {
  const products = await prisma.product.findMany({
    where: { slug: { in: slugs } },
    include: catalogInclude,
  });
  return slugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));
}

export async function getRelatedProducts(product: {
  id: string;
  categoryId: string;
  lookId?: string | null;
  color: string;
  brand: string;
  priceCents: number;
}) {
  const minPrice = Math.round(product.priceCents * 0.6);
  const maxPrice = Math.round(product.priceCents * 1.4);
  const color = product.color.toLowerCase();
  const brand = product.brand.toLowerCase();

  const similar: Prisma.ProductWhereInput[] = [
    { categoryId: product.categoryId },
    { brand: { equals: product.brand, mode: "insensitive" } },
    { color: { equals: product.color, mode: "insensitive" } },
    { priceCents: { gte: minPrice, lte: maxPrice } },
  ];
  if (product.lookId) similar.push({ lookId: product.lookId });

  const candidates = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      status: ProductStatus.AVAILABLE,
      stock: { gt: 0 },
      OR: similar,
    },
    include: catalogInclude,
    take: 24,
  });

  return candidates
    .map((item) => {
      let score = 0;
      if (item.categoryId === product.categoryId) score += 6;
      if (product.lookId && item.lookId === product.lookId) score += 3;
      if (item.brand.toLowerCase() === brand) score += 2;
      if (item.color.toLowerCase() === color) score += 2;
      if (item.priceCents >= minPrice && item.priceCents <= maxPrice) score += 2;
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((entry) => entry.item);
}

export async function getCatalogFacets() {
  const [brands, sizes, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: ProductStatus.AVAILABLE },
      distinct: ["brand"],
      select: { brand: true },
      orderBy: { brand: "asc" },
    }),
    prisma.product.findMany({
      where: { status: ProductStatus.AVAILABLE },
      distinct: ["size"],
      select: { size: true },
      orderBy: { size: "asc" },
    }),
    prisma.category.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  return {
    brands: brands.map((item) => item.brand),
    sizes: sizes.map((item) => item.size),
    categories,
  };
}

export async function listAdminProducts() {
  return prisma.product.findMany({
    include: { images: true, category: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: catalogInclude,
  });
}

export async function upsertProduct(input: ProductFormInput, id?: string) {
  const slugBase = slugify(input.name);
  const slug = await uniqueProductSlug(slugBase, id);

  const data = {
    name: input.name,
    slug,
    description: input.description,
    story: input.story,
    brand: input.brand,
    size: input.size,
    color: input.color,
    condition: input.condition,
    widthCm: input.widthCm,
    heightCm: input.heightCm,
    depthCm: input.depthCm,
    priceCents: input.priceCents,
    compareAtCents: input.compareAtCents ?? null,
    stock: input.stock,
    status: input.status,
    featured: input.featured ?? false,
    uniquePiece: input.uniquePiece ?? true,
    material: input.material,
    categoryId: input.categoryId,
    lookId: input.lookId || null,
    measurements: input.measurements ?? {
      width: `${input.widthCm} cm`,
      height: `${input.heightCm} cm`,
      depth: `${input.depthCm} cm`,
    },
  };

  if (id) {
    const product = await prisma.product.update({ where: { id }, data });
    if (input.imageUrl) {
      await prisma.productImage.deleteMany({ where: { productId: id, kind: "MAIN" } });
      await prisma.productImage.create({
        data: {
          productId: id,
          url: input.imageUrl,
          alt: input.name,
          kind: "MAIN",
          sortOrder: 0,
        },
      });
    }
    return product;
  }

  return prisma.product.create({
    data: {
      ...data,
      images: input.imageUrl
        ? {
            create: {
              url: input.imageUrl,
              alt: input.name,
              kind: "MAIN",
              sortOrder: 0,
            },
          }
        : undefined,
    },
  });
}

async function uniqueProductSlug(base: string, ignoreId?: string) {
  let slug = base;
  let i = 2;
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${base}-${i}`;
    i += 1;
  }
}

export async function addProductImage(productId: string, url: string, alt: string, publicId?: string) {
  const count = await prisma.productImage.count({ where: { productId } });
  return prisma.productImage.create({
    data: {
      productId,
      url,
      alt,
      publicId,
      kind: count === 0 ? "MAIN" : "DETAIL",
      sortOrder: count,
    },
  });
}

export async function deleteProductImage(id: string) {
  return prisma.productImage.delete({ where: { id } });
}

export async function deleteProduct(id: string) {
  const inOrders = await prisma.orderItem.count({ where: { productId: id } });
  if (inOrders > 0) {
    throw new Error("Este móvel já entrou em um pedido. Arquive em vez de excluir.");
  }
  return prisma.product.delete({ where: { id } });
}

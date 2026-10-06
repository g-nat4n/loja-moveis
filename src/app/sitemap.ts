import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/produtos", "/sobre", "/contato"].map((path) => ({
    url: `${siteUrl}${path || "/"}`,
    lastModified: new Date(),
  }));

  try {
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { status: { in: ["AVAILABLE", "SOLD"] } },
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        where: { active: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    return [
      ...staticRoutes,
      ...categories.map((category) => ({
        url: `${siteUrl}/categoria/${category.slug}`,
        lastModified: category.updatedAt,
      })),
      ...products.map((product) => ({
        url: `${siteUrl}/produto/${product.slug}`,
        lastModified: product.updatedAt,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}

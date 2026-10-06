import { PrismaClient, ProductCondition, ProductStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { FEATURED_PIECES } from "../src/lib/brand";

const prisma = new PrismaClient();

function measurementJson(widthCm: number, heightCm: number, depthCm: number) {
  return {
    width: `${widthCm} cm`,
    height: `${heightCm} cm`,
    depth: `${depthCm} cm`,
  };
}

async function main() {
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD ?? "altere-esta-senha", 12);

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? "admin@morada.com" },
    update: { role: Role.ADMIN, passwordHash },
    create: {
      name: "Admin Morada",
      email: process.env.ADMIN_EMAIL ?? "admin@morada.com",
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const categories = await Promise.all(
    [
      {
        name: "Sofás",
        slug: "sofas",
        description: "Assento profundo, tecidos honestos e presença para a sala.",
        imageUrl:
          "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1200",
        sortOrder: 1,
      },
      {
        name: "Mesas",
        slug: "mesas",
        description: "Jantar, centro e trabalho — madeira e proporção.",
        imageUrl:
          "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1200",
        sortOrder: 2,
      },
      {
        name: "Cadeiras e poltronas",
        slug: "cadeiras-e-poltronas",
        description: "Conforto para ler, conversar e pausar.",
        imageUrl:
          "https://images.pexels.com/photos/276583/pexels-photo-276583.jpeg?auto=compress&cs=tinysrgb&w=1200",
        sortOrder: 3,
      },
      {
        name: "Camas",
        slug: "camas",
        description: "Descanso com estrutura sólida e cabeceiras acolhedoras.",
        imageUrl:
          "https://images.pexels.com/photos/813691/pexels-photo-813691.jpeg?auto=compress&cs=tinysrgb&w=1200",
        sortOrder: 4,
      },
      {
        name: "Estantes e racks",
        slug: "estantes-e-racks",
        description: "Organização vertical e apoio para TV e objetos.",
        imageUrl:
          "https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&w=1200&q=80",
        sortOrder: 5,
      },
      {
        name: "Aparadores",
        slug: "aparadores",
        description: "Credenzas e buffets para jantar e corredor.",
        imageUrl:
          "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80",
        sortOrder: 6,
      },
    ].map((category) =>
      prisma.category.upsert({
        where: { slug: category.slug },
        update: category,
        create: category,
      }),
    ),
  );

  const cat = Object.fromEntries(categories.map((item) => [item.slug, item]));

  const look = await prisma.look.upsert({
    where: { slug: "sala-serena" },
    update: {},
    create: {
      name: "Sala serena",
      slug: "sala-serena",
      description: "Sofá de linho, rack baixo e poltrona de leitura em tom musgo.",
      imageUrl:
        "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
    },
  });

  await prisma.coupon.upsert({
    where: { code: "MORADA10" },
    update: { active: true, percentOff: 10 },
    create: { code: "MORADA10", percentOff: 10, active: true },
  });

  await prisma.testimonial.deleteMany();
  await prisma.testimonial.createMany({
    data: [
      {
        author: "Marina T.",
        role: "Cliente Morada",
        quote:
          "A mesa chegou com o veio exatamente como na foto. Medidas corretas e montagem simples — raro em e-commerce de móveis.",
        sortOrder: 1,
      },
      {
        author: "Paulo R.",
        role: "Cliente Morada",
        quote:
          "Comprei o rack e a poltrona para a sala. Sensação de showroom curado, não de catálogo infinito.",
        sortOrder: 2,
      },
    ],
  });

  const extraProducts = [
    {
      name: "Aparador Salgueiro",
      slug: "aparador-salgueiro",
      description: "Aparador com três portas e pés altos, ideal para jantar ou hall.",
      story: "Entrou na Morada com ferragens originais e tom salgueiro envelhecido à mão.",
      brand: "Morada Atelier",
      size: "Médio",
      color: "Salgueiro",
      condition: ProductCondition.EXCELLENT,
      widthCm: 140,
      heightCm: 85,
      depthCm: 45,
      priceCents: 198000,
      categoryId: cat["aparadores"].id,
      lookId: look.id,
      featured: false,
      material: "MDP revestido",
      measurements: measurementJson(140, 85, 45),
      images: [
        "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      name: "Mesa Centro Redonda",
      slug: "mesa-centro-redonda",
      description: "Tampo redondo em freijó e base única esculpida. Porte compacto para salas menores.",
      brand: "Carvalho Norte",
      size: "Compacto",
      color: "Freijó",
      condition: ProductCondition.NEW_WITH_TAG,
      widthCm: 80,
      heightCm: 42,
      depthCm: 80,
      priceCents: 89000,
      categoryId: cat["mesas"].id,
      featured: false,
      material: "Freijó",
      measurements: measurementJson(80, 42, 80),
      images: [
        "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      name: "Cadeira Jantar Olmo",
      slug: "cadeira-jantar-olmo",
      description: "Cadeira estofada com encosto curvo e pernas em olmo. Conjunto vendido por unidade.",
      brand: "Olmo Co.",
      size: "Compacto",
      color: "Cinza pedra",
      condition: ProductCondition.VERY_GOOD,
      widthCm: 48,
      heightCm: 88,
      depthCm: 54,
      priceCents: 72000,
      categoryId: cat["cadeiras-e-poltronas"].id,
      lookId: look.id,
      featured: false,
      material: "Olmo e tecido",
      measurements: measurementJson(48, 88, 54),
      images: [
        "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      ],
    },
    {
      name: "Sofá Modular Canto",
      slug: "sofa-modular-canto",
      description: "Módulo de canto em chenille grafite, combina com linha Linho Areia.",
      story: "Peça de mostruário com uso leve no assento — ficha honesta no anúncio.",
      brand: "Morada Atelier",
      size: "Grande",
      color: "Grafite",
      condition: ProductCondition.VERY_GOOD,
      widthCm: 110,
      heightCm: 85,
      depthCm: 110,
      priceCents: 215000,
      categoryId: cat["sofas"].id,
      featured: true,
      material: "Chenille",
      measurements: measurementJson(110, 85, 110),
      images: [
        "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1200",
        "https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=1200",
      ],
    },
  ];

  for (const item of extraProducts) {
    const { images, ...data } = item;
    const product = await prisma.product.upsert({
      where: { slug: data.slug },
      update: { ...data, status: ProductStatus.AVAILABLE, stock: 1, uniquePiece: true },
      create: {
        ...data,
        status: ProductStatus.AVAILABLE,
        stock: 1,
        uniquePiece: true,
      },
    });
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: images.map((url, index) => ({
        productId: product.id,
        url,
        alt: `${data.name} — fotografia ${index + 1}`,
        kind: index === 0 ? "MAIN" : "DETAIL",
        sortOrder: index,
      })),
    });
  }

  for (const piece of FEATURED_PIECES) {
    const dims = measurementJson(piece.widthCm, piece.heightCm, piece.depthCm);
    const product = await prisma.product.upsert({
      where: { slug: piece.slug },
      update: {
        name: piece.name,
        description: piece.description,
        brand: piece.brand,
        size: piece.size,
        color: piece.color,
        condition: ProductCondition[piece.condition],
        priceCents: piece.priceCents,
        categoryId: cat[piece.categorySlug].id,
        widthCm: piece.widthCm,
        heightCm: piece.heightCm,
        depthCm: piece.depthCm,
        measurements: dims,
        featured: true,
        status: ProductStatus.AVAILABLE,
        stock: 1,
        uniquePiece: true,
      },
      create: {
        name: piece.name,
        slug: piece.slug,
        description: piece.description,
        brand: piece.brand,
        size: piece.size,
        color: piece.color,
        condition: ProductCondition[piece.condition],
        priceCents: piece.priceCents,
        categoryId: cat[piece.categorySlug].id,
        widthCm: piece.widthCm,
        heightCm: piece.heightCm,
        depthCm: piece.depthCm,
        measurements: dims,
        featured: true,
        status: ProductStatus.AVAILABLE,
        stock: 1,
        uniquePiece: true,
      },
    });
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    await prisma.productImage.createMany({
      data: [
        {
          productId: product.id,
          url: piece.image,
          alt: piece.alt,
          kind: "MAIN",
          sortOrder: 0,
        },
      ],
    });
  }

  await prisma.product.updateMany({
    where: { slug: { notIn: [...FEATURED_PIECES.map((piece) => piece.slug), "sofa-modular-canto"] } },
    data: { featured: false },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

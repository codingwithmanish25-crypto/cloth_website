import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeProduct(product) {
  if (!product) return null;
  return JSON.parse(
    JSON.stringify(product, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export async function POST(req) {
  try {
    const body = await req.json();
    const requiredFields = ["title", "slug", "price", "availableSizes", "images"];

    if (requiredFields.some((field) => body[field] === undefined || body[field] === null || body[field] === "")) {
      return NextResponse.json(
        { error: "Title, slug, price, sizes, and images are required" },
        { status: 400 }
      );
    }

      const categoryId = body.categoryId
        ? /^\d+$/.test(String(body.categoryId))
        ? BigInt(body.categoryId)
        : null
      : null;

    const product = await prisma.product.create({
      data: {
        title: body.title,
        slug: body.slug,
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        price: Number(body.price),
        originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
        fitTag: body.fitTag || null,
        description: body.description || null,
        collectionSlugs: Array.isArray(body.collectionSlugs) ? body.collectionSlugs : [],
        isSoldOut: Boolean(body.isSoldOut),
        availableSizes: body.availableSizes,
        images: body.images,
      },
    });

    return NextResponse.json(serializeProduct(product), { status: 201 });
  } catch (error) {
    console.error("POST Product Error:", error);
    return NextResponse.json(
      { error: "Failed to create product", details: error.message },
      { status: 500 }
    );
  }
}

// GET /api/products -> Fetch All Products or Search Products
export async function GET(req) {
  try {
    const searchParams = new URL(req.url).searchParams;
    const query = searchParams.get("q")?.trim() || "";
    const fitTag = searchParams.get("fitTag")?.trim() || "";
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);
    const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 0, 0), 50);
    const where = {
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { slug: { contains: query, mode: "insensitive" } },
              { fitTag: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(fitTag ? { fitTag: { equals: fitTag, mode: "insensitive" } } : {}),
    };

    if (searchParams.get("fitTags") === "true") {
      const fitTags = await prisma.product.findMany({
        where: { fitTag: { not: null } },
        select: { fitTag: true },
        distinct: ["fitTag"],
        orderBy: { fitTag: "asc" },
      });
      return NextResponse.json(fitTags.map((item) => item.fitTag).filter(Boolean));
    }

    const products = await prisma.product.findMany({
      where: Object.keys(where).length ? where : undefined,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      ...(limit ? { skip: (page - 1) * limit, take: limit } : query ? { take: 8 } : {}),
    });

    if (limit) {
      const total = await prisma.product.count({ where: Object.keys(where).length ? where : undefined });
      return NextResponse.json({
        products: serializeProduct(products),
        page,
        limit,
        total,
        hasMore: page * limit < total,
      });
    }

    return NextResponse.json(serializeProduct(products), { status: 200 });
  } catch (error) {
    console.error("GET All Products Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}
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

// GET /api/products -> Fetch All Products or Search Products
export async function GET(req) {
  try {
    const query = new URL(req.url).searchParams.get("q")?.trim() || "";
    const where = query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { slug: { contains: query, mode: "insensitive" } },
            { fitTag: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        }
      : undefined;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      ...(query ? { take: 8 } : {}),
    });

    return NextResponse.json(serializeProduct(products), { status: 200 });
  } catch (error) {
    console.error("GET All Products Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper to handle BigInt serialization (Prisma BigInt JSON error prevention)
function serializeProduct(product) {
  if (!product) return null;
  return JSON.parse(
    JSON.stringify(product, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

// 1. GET Product Details by Slug
export async function GET(req, { params }) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findFirst({
      where: {
        slug: slug,
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeProduct(product), { status: 200 });
  } catch (error) {
    console.error("GET Product Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. DELETE Single Product (by Slug or BigInt ID)
export async function DELETE(req, { params }) {
  try {
    const { slug } = await params;

    // Agar slug actually ID (number) hai toh BigInt match karega, varna slug se delete karega
    const isId = !isNaN(slug);

    if (isId) {
      await prisma.product.delete({
        where: { id: BigInt(slug) },
      });
    } else {
      await prisma.product.delete({
        where: { slug: slug },
      });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE Product Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();

    const product = await prisma.product.create({
      data: {
        title: body.title,
        slug: body.slug,
        price: body.price,
        originalPrice: body.originalPrice || null,
        fitTag: body.fitTag,
        description: body.description,
        isSoldOut: body.isSoldOut,
        availableSizes: body.availableSizes,
        images: body.images,
        // String categoryId ko BigInt me convert kar ke relation create karein
        categoryId: body.categoryId ? BigInt(body.categoryId) : null,
      },
    });

    // Response ke liye BigInt serialization fix
    const formattedProduct = JSON.parse(
      JSON.stringify(product, (key, value) =>
        typeof value === "bigint" ? value.toString() : value
      )
    );

    return NextResponse.json({ success: true, product: formattedProduct });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: {
          select: { name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // BigInt aur Decimal values ko JS serializable objects me convert karna mandatory hai
    const formattedProducts = products.map((prod) => ({
      ...prod,
      id: prod.id.toString(),
      categoryId: prod.categoryId ? prod.categoryId.toString() : null,
      price: Number(prod.price),
      originalPrice: prod.originalPrice ? Number(prod.originalPrice) : null,
    }));

    return NextResponse.json(formattedProducts, { status: 200 });
  } catch (error) {
    console.error("GET Products Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// BigInt serialization helper
function serializeProduct(product) {
  if (!product) return null;
  return JSON.parse(
    JSON.stringify(product, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

// Helper to safely parse BigInt IDs
function parseId(id) {
  if (!id) return null;
  // Agar numeric string hai toh BigInt return karein
  if (typeof id === "string" && /^\d+$/.test(id)) {
    return BigInt(id);
  }
  return id;
}

// 1. GET /api/products/[id] -> Fetch Single Product by ID, Slug, or Title
export async function GET(req, { params }) {
  try {
    const resolvedParams = await params;
    const identifier = resolvedParams?.id;

    if (!identifier) {
      return NextResponse.json({ message: "Identifier is required" }, { status: 400 });
    }

    const decodedIdentifier = decodeURIComponent(identifier).trim();
    let product = null;

    // A. Try Numeric ID Match first
    if (/^\d+$/.test(decodedIdentifier)) {
      try {
        product = await prisma.product.findUnique({
          where: { id: BigInt(decodedIdentifier) },
        });
      } catch (e) {
        // Fallthrough if BigInt parsing fails
      }
    }

    // B. Try Exact Slug Match
    if (!product) {
      product = await prisma.product.findFirst({
        where: {
          slug: { equals: decodedIdentifier, mode: "insensitive" },
        },
      });
    }

    // C. Fallback: Fuzzy Search (Slug or Title)
    if (!product) {
      const cleanKeyword = decodedIdentifier.replace(/[-_]/g, " ");
      product = await prisma.product.findFirst({
        where: {
          OR: [
            { slug: { contains: decodedIdentifier, mode: "insensitive" } },
            { title: { contains: cleanKeyword, mode: "insensitive" } },
          ],
        },
      });
    }

    if (!product) {
      return NextResponse.json(
        { message: `Product not found for: ${identifier}` },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeProduct(product), { status: 200 });
  } catch (error) {
    console.error("GET Single Product Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 2. PATCH /api/products/[id] -> Dynamic/Partial Update
export async function PATCH(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const targetId = parseId(id);

    // Dynamic update object validation
    const dataToUpdate = {};
    if (body.isSoldOut !== undefined) dataToUpdate.isSoldOut = body.isSoldOut;
    if (body.price !== undefined) dataToUpdate.price = Number(body.price);

    const updatedProduct = await prisma.product.update({
      where: { id: targetId },
      data: dataToUpdate,
    });

    return NextResponse.json(serializeProduct(updatedProduct), { status: 200 });
  } catch (error) {
    console.error("PATCH Product Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// 3. PUT /api/products/[id] -> Full Edit Update
export async function PUT(req, { params }) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams?.id;
    const body = await req.json();

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const targetId = parseId(id);

    const categoryId = body.categoryId
      ? /^\d+$/.test(String(body.categoryId))
        ? BigInt(body.categoryId)
        : body.categoryId
      : null;
    const enteredPrice = Number(body.price);
    const enteredOriginalPrice = body.originalPrice ? Number(body.originalPrice) : null;
    const hasDiscountPrice = enteredOriginalPrice !== null && enteredOriginalPrice > 0;
    const salePrice = hasDiscountPrice
      ? Math.min(enteredPrice, enteredOriginalPrice)
      : enteredPrice;
    const originalPrice = hasDiscountPrice
      ? Math.max(enteredPrice, enteredOriginalPrice)
      : null;

    const updatedProduct = await prisma.product.update({
      where: { id: targetId },
      data: {
        title: body.title,
        slug: body.slug,
        category: categoryId
          ? { connect: { id: categoryId } }
          : { disconnect: true },
        price: salePrice,
        originalPrice,
        fitTag: body.fitTag,
        description: body.description,
        isSoldOut: Boolean(body.isSoldOut),
        availableSizes: body.availableSizes || [],
        images: body.images || [],
      },
    });

    return NextResponse.json(serializeProduct(updatedProduct), { status: 200 });
  } catch (error) {
    console.error("PUT Product Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
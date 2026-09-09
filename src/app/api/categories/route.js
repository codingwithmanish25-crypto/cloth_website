import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET All Categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { id: "asc" },
    });

    // BigInt ko String me convert kar rahe hain taaki JSON serialization crash na ho
    const formatted = categories.map((cat) => ({
      id: cat.id.toString(),
      name: cat.name,
      slug: cat.slug,
      productCount: cat._count.products,
    }));

    return NextResponse.json(formatted, { status: 200 });
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST Create Category
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and Slug are required" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: { name, slug },
    });

    return NextResponse.json(
      {
        ...category,
        id: category.id.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST Category Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { WEBSITE_CATEGORY_ROWS } from "@/lib/websiteCategories";

// GET All Categories
export async function GET() {
  try {
    await Promise.all(
      WEBSITE_CATEGORY_ROWS.map(({ name, slug }) =>
        prisma.category.upsert({
          where: { slug },
          update: { name },
          create: { name, slug },
        })
      )
    );

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
      group: WEBSITE_CATEGORY_ROWS.find((item) => item.slug === cat.slug)?.group || "OTHER",
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
    const { name, slug, group } = body;
    const normalizedGroup = String(group || "").toUpperCase();
    const validGroups = ["MEN", "WOMEN", "FOOTWEAR", "ACCESSORIES"];

    if (!name || !slug || !validGroups.includes(normalizedGroup)) {
      return NextResponse.json(
        { error: "Name and a valid group are required" },
        { status: 400 }
      );
    }

    const normalizedSlug = `${normalizedGroup.toLowerCase()}-${slug.replace(/^[^-]+-/, "")}`;
    const existingCategory = await prisma.category.findUnique({
      where: { slug: normalizedSlug },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          error: `${existingCategory.name} already exists in ${normalizedGroup}`,
          category: { ...existingCategory, id: existingCategory.id.toString() },
        },
        { status: 409 }
      );
    }

    const category = await prisma.category.create({
      data: { name, slug: normalizedSlug },
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
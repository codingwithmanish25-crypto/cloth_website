import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT Update Category
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug } = body;

    const updatedCategory = await prisma.category.update({
      where: { id: BigInt(id) },
      data: { name, slug },
    });

    return NextResponse.json({
      ...updatedCategory,
      id: updatedCategory.id.toString(),
    });
  } catch (error) {
    console.error("PUT Category Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE Category
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    await prisma.category.delete({
      where: { id: BigInt(id) },
    });

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
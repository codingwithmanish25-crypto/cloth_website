import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serialize(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      include: {
        product: { select: { title: true, slug: true } },
        user: { select: { name: true, username: true, emails: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(serialize(reviews));
  } catch (error) {
    console.error("GET Admin Reviews Error:", error);
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { id, isApproved } = await request.json();
    const review = await prisma.review.update({
      where: { id: BigInt(id) },
      data: { isApproved: Boolean(isApproved) },
    });
    return NextResponse.json(serialize(review));
  } catch (error) {
    console.error("PATCH Admin Review Error:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    await prisma.review.delete({ where: { id: BigInt(id) } });
    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    console.error("DELETE Admin Review Error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}

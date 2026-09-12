import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const pageSize = 5;

async function getAuthUser(request) {
  const cookieStore = await cookies();
  const supabaseServer = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const token = request.headers.get("Authorization")?.split(" ")[1];
  const result = token
    ? await supabaseServer.auth.getUser(token)
    : await supabaseServer.auth.getUser();
  return result.data.user || null;
}

function serialize(data) {
  return JSON.parse(
    JSON.stringify(data, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productSlug = searchParams.get("productSlug")?.trim();
    const page = Math.max(Number(searchParams.get("page")) || 1, 1);

    if (!productSlug) {
      return NextResponse.json({ error: "productSlug is required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { slug: productSlug },
      select: { id: true },
    });

    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    const where = { productId: product.id, isApproved: true };
    const [reviews, total, aggregate] = await Promise.all([
      prisma.review.findMany({
        where,
        include: { user: { select: { id: true, name: true, username: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.review.count({ where }),
      prisma.review.aggregate({ where, _avg: { rating: true } }),
    ]);

    return NextResponse.json({
      reviews: serialize(reviews),
      total,
      page,
      pageSize,
      hasMore: page * pageSize < total,
      averageRating: Number(aggregate._avg.rating || 0),
    });
  } catch (error) {
    console.error("GET Reviews Error:", error);
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const { reviewId } = await request.json();
    if (!reviewId) return NextResponse.json({ error: "Review ID is required" }, { status: 400 });

    const review = await prisma.review.findFirst({
      where: { id: BigInt(reviewId), userId: authUser.id },
    });
    if (!review) return NextResponse.json({ error: "Review not found" }, { status: 404 });

    await prisma.review.delete({ where: { id: review.id } });
    return NextResponse.json({ message: "Review deleted" });
  } catch (error) {
    console.error("DELETE Review Error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    if (!authUser) return NextResponse.json({ error: "Login required to review" }, { status: 401 });

    const body = await request.json();
    const rating = Number(body.rating);
    const product = await prisma.product.findUnique({ where: { slug: body.productSlug }, select: { id: true } });
    if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !body.body?.trim()) {
      return NextResponse.json({ error: "Rating and review text are required" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId: product.id,
        userId: authUser.id,
        rating,
        title: body.title?.trim() || null,
        body: body.body.trim(),
      },
      include: { user: { select: { name: true, username: true } } },
    });

    return NextResponse.json(serialize(review), { status: 201 });
  } catch (error) {
    console.error("POST Review Error:", error);
    return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
  }
}

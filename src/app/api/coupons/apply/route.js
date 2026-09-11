import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const { code, subtotal } = await req.json();
    const normalizedCode = String(code || "").trim().toUpperCase();
    const amount = Number(subtotal);
    const now = new Date();

    if (!normalizedCode || !Number.isFinite(amount) || amount < 0) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await prisma.coupon.findFirst({
      where: {
        code: normalizedCode,
        isActive: true,
        startsAt: { lte: now },
        expiresAt: { gt: now },
      },
    });

    if (!coupon) return NextResponse.json({ error: "Coupon is invalid or expired" }, { status: 400 });

    const minimum = Number(coupon.minOrderValue);
    if (amount < minimum) {
      return NextResponse.json({ error: `Minimum order value is ₹${minimum.toLocaleString("en-IN")}` }, { status: 400 });
    }

    const value = Number(coupon.discountValue);
    const discount = coupon.discountType === "PERCENTAGE"
      ? Math.min(amount, (amount * value) / 100)
      : Math.min(amount, value);

    return NextResponse.json({
      id: coupon.id.toString(),
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: value,
      discount,
    });
  } catch (error) {
    console.error("Apply Coupon Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
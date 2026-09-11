import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function serializeCoupon(coupon) {
  return {
    ...coupon,
    id: coupon.id.toString(),
    discountValue: Number(coupon.discountValue),
    minOrderValue: Number(coupon.minOrderValue),
  };
}

function parseDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeBody(body) {
  const code = String(body.code || "").trim().toUpperCase();
  const discountType = body.discountType === "FIXED" ? "FIXED" : "PERCENTAGE";
  const discountValue = Number(body.discountValue);
  const minOrderValue = Number(body.minOrderValue || 0);
  const startsAt = parseDate(body.startsAt);
  const expiresAt = parseDate(body.expiresAt);

  if (!code || !Number.isFinite(discountValue) || discountValue <= 0) {
    throw new Error("Code and a positive discount are required");
  }
  if (discountType === "PERCENTAGE" && discountValue > 100) {
    throw new Error("Percentage discount cannot exceed 100");
  }
  if (!startsAt || !expiresAt || expiresAt <= startsAt) {
    throw new Error("Expiry must be later than the start date");
  }
  if (!Number.isFinite(minOrderValue) || minOrderValue < 0) {
    throw new Error("Minimum order value is invalid");
  }

  return { code, description: body.description?.trim() || null, discountType, discountValue, minOrderValue, startsAt, expiresAt, isActive: body.isActive !== false };
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const isAdmin = url.searchParams.get("admin") === "1";
    const now = new Date();
    const coupons = await prisma.coupon.findMany({
      where: isAdmin ? undefined : { isActive: true, startsAt: { lte: now }, expiresAt: { gt: now } },
      orderBy: { expiresAt: "asc" },
    });
    return NextResponse.json(coupons.map(serializeCoupon));
  } catch (error) {
    console.error("GET Coupons Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const data = normalizeBody(await req.json());
    const coupon = await prisma.coupon.create({ data });
    return NextResponse.json(serializeCoupon(coupon), { status: 201 });
  } catch (error) {
    console.error("POST Coupon Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();
    const id = BigInt(body.id);
    const data = normalizeBody(body);
    const coupon = await prisma.coupon.update({ where: { id }, data });
    return NextResponse.json(serializeCoupon(coupon));
  } catch (error) {
    console.error("PATCH Coupon Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req) {
  try {
    const id = BigInt(new URL(req.url).searchParams.get("id"));
    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Coupon Error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
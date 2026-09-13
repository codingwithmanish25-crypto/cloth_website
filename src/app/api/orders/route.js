import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, serializeOrder } from "@/lib/authUser";

export async function POST(request) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) return NextResponse.json({ error: "Login required" }, { status: 401 });

    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items : [];
    const address = String(body.address || "").trim();
    const subtotal = Number(body.subtotal);
    const discount = Number(body.discount || 0);
    const total = Number(body.total);
    if (!items.length || !address || ![subtotal, discount, total].every(Number.isFinite) || total < 0) {
      return NextResponse.json({ error: "Order items, address, and valid totals are required" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: authUser.id,
        items,
        address,
        subtotal,
        discount,
        total,
        paymentId: body.paymentId || null,
        paymentStatus: body.paymentId ? "PAID" : "PENDING",
      },
    });
    return NextResponse.json(serializeOrder(order), { status: 201 });
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) return NextResponse.json({ error: "Login required" }, { status: 401 });
    const orders = await prisma.order.findMany({ where: { userId: authUser.id }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(orders.map(serializeOrder));
  } catch (error) {
    console.error("Get orders error:", error);
    return NextResponse.json({ error: "Could not load orders" }, { status: 500 });
  }
}
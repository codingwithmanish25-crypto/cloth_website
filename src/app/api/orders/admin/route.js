import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, serializeOrder } from "@/lib/authUser";

export async function GET(request) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (authUser?.user_metadata?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const page = Math.max(Number(new URL(request.url).searchParams.get("page")) || 1, 1);
    const pageSize = 10;
    const [orders, total] = await Promise.all([
      prisma.order.findMany({ include: { user: { select: { name: true, username: true, emails: true } } }, orderBy: { createdAt: "desc" }, skip: (page - 1) * pageSize, take: pageSize }),
      prisma.order.count(),
    ]);
    return NextResponse.json({ orders: orders.map(serializeOrder), page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
  } catch (error) {
    console.error("Admin orders error:", error);
    return NextResponse.json({ error: "Could not load orders" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (authUser?.user_metadata?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id, status } = await request.json();
    if (!["PENDING", "PROCESSING", "DELIVERED", "CANCELLED"].includes(status)) return NextResponse.json({ error: "Invalid order status" }, { status: 400 });
    const currentOrder = await prisma.order.findUnique({ where: { id: BigInt(id) }, select: { status: true, cancelledBy: true } });
    if (!currentOrder) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (currentOrder.status === "CANCELLED" && currentOrder.cancelledBy === "CUSTOMER") {
      return NextResponse.json({ error: "Customer-cancelled orders cannot be changed" }, { status: 409 });
    }
    const order = await prisma.order.update({
      where: { id: BigInt(id) },
      data: {
        status,
        cancelledBy: status === "CANCELLED" ? "ADMIN" : null,
      },
    });
    return NextResponse.json(serializeOrder(order));
  } catch (error) {
    console.error("Admin order update error:", error);
    return NextResponse.json({ error: "Could not update order" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, serializeOrder } from "@/lib/authUser";

export async function PATCH(request, { params }) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) return NextResponse.json({ error: "Login required" }, { status: 401 });
    const id = BigInt((await params).id);
    const order = await prisma.order.findFirst({ where: { id, userId: authUser.id } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.status !== "PENDING") return NextResponse.json({ error: "Only pending orders can be cancelled" }, { status: 409 });
    const updated = await prisma.order.update({
      where: { id },
      data: { status: "CANCELLED", cancelledBy: "CUSTOMER" },
    });
    return NextResponse.json(serializeOrder(updated));
  } catch (error) {
    console.error("Cancel order error:", error);
    return NextResponse.json({ error: "Could not cancel order" }, { status: 500 });
  }
}
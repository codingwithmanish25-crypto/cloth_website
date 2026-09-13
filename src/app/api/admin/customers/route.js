import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/authUser";

export async function GET(request) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (authUser?.user_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const customers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        emails: true,
        createdAt: true,
        orders: {
          where: { status: { not: "CANCELLED" } },
          select: { total: true },
        },
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      username: customer.username,
      email: customer.emails?.[0] || "",
      orderCount: customer._count.orders,
      totalSpent: customer.orders.reduce((total, order) => total + Number(order.total), 0),
      createdAt: customer.createdAt,
    })));
  } catch (error) {
    console.error("Admin customers error:", error);
    return NextResponse.json({ error: "Could not load customers" }, { status: 500 });
  }
}

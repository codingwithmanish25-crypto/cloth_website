import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUser, serializeOrder } from "@/lib/authUser";

async function requireAdmin(request) {
  const user = await getAuthenticatedUser(request);
  return user?.user_metadata?.role === "admin" ? user : null;
}

export async function GET(request) {
  try {
    if (!(await requireAdmin(request))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const revenueWhere = {
      status: { not: "CANCELLED" },
      paymentStatus: "PAID",
    };

    const [
      customerCount,
      productCount,
      activeProductCount,
      orderCount,
      paidOrderCount,
      revenue,
      recentOrders,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.product.count({ where: { isSoldOut: false } }),
      prisma.order.count(),
      prisma.order.count({ where: revenueWhere }),
      prisma.order.aggregate({ where: revenueWhere, _sum: { total: true } }),
      prisma.order.findMany({
        include: { user: { select: { name: true, username: true, emails: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      stats: {
        revenue: Number(revenue._sum.total || 0),
        orders: orderCount,
        products: productCount,
        activeProducts: activeProductCount,
        customers: customerCount,
        paidOrders: paidOrderCount,
      },
      recentOrders: recentOrders.map(serializeOrder),
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return NextResponse.json({ error: "Could not load dashboard data" }, { status: 500 });
  }
}

// app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

async function isAdmin(userId: string): Promise<boolean> {
  const adminIds = process.env.ADMIN_CLERK_IDS?.split(",") || [];
  return adminIds.includes(userId);
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      totalShops,
      verifiedShops,
      pendingShops,
      totalCustomers,
      totalProducts,
      totalCoupons,
      activeCoupons,
      totalRevenue,
      activeSubscriptions,
    ] = await Promise.all([
      prisma.shop.count(),
      prisma.shop.count({ where: { verified: true } }),
      prisma.shop.count({ where: { verified: false } }),
      prisma.customerProfile.count(),
      prisma.product.count(),
      prisma.coupon.count(),
      prisma.coupon.count({ where: { status: "ACTIVE" } }),
      prisma.payment.aggregate({
        where: { status: "SUCCESS" },
        _sum: { amount: true },
      }),
      prisma.subscription.count({ where: { status: "ACTIVE", plan: "STANDARD" } }),
    ]);

    return NextResponse.json({
      totalShops,
      verifiedShops,
      pendingShops,
      totalCustomers,
      totalProducts,
      totalCoupons,
      activeCoupons,
      totalRevenue: totalRevenue._sum.amount || 0,
      activeSubscriptions,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

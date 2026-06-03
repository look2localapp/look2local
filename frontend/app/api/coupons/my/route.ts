// app/api/coupons/my/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const customer = await prisma.customerProfile.findUnique({
      where: { clerkId: userId },
    });
    if (!customer) {
      return NextResponse.json({ coupons: [], analytics: null });
    }

    const coupons = await prisma.coupon.findMany({
      where: { customerId: customer.id },
      include: {
        product: { include: { shop: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    // Monthly analytics
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthCoupons = coupons.filter(
      (c) => new Date(c.createdAt) >= startOfMonth
    );

    const totalSpent = monthCoupons.reduce((s, c) => s + c.couponCost, 0);
    const totalSaved = monthCoupons.reduce((s, c) => s + c.discountAmount, 0);

    const analytics = {
      month: now.toLocaleString("en-IN", { month: "long", year: "numeric" }),
      couponsPurchased: monthCoupons.length,
      totalSpent,
      totalSaved,
      netSavings: totalSaved - totalSpent,
    };

    return NextResponse.json({ coupons, analytics });
  } catch (err) {
    console.error("My coupons error:", err);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

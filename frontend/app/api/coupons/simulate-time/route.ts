// app/api/coupons/simulate-time/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get customer profile
    const customer = await prisma.customerProfile.findUnique({
      where: { clerkId: userId },
    });
    if (!customer) {
      return NextResponse.json({ error: "Customer profile not found" }, { status: 404 });
    }

    const { couponId } = await req.json();
    if (!couponId) {
      return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });
    }

    // Update coupon redeemedAt to 3 days and 5 minutes ago to trigger the review prompt
    const updatedCoupon = await prisma.coupon.update({
      where: {
        id: couponId,
        customerId: customer.id,
      },
      data: {
        status: "REDEEMED",
        redeemedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 - 5 * 60 * 1000),
      },
    });

    return NextResponse.json({ success: true, coupon: updatedCoupon });
  } catch (error) {
    console.error("POST /api/coupons/simulate-time error:", error);
    return NextResponse.json({ error: "Failed to simulate time transition" }, { status: 500 });
  }
}

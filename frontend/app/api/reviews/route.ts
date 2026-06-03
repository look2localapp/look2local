// app/api/reviews/route.ts
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

    const { couponId, rating, comment } = await req.json();

    if (!couponId || typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid rating or coupon ID" }, { status: 400 });
    }

    // Find the coupon and make sure it belongs to the customer and is redeemed
    const coupon = await prisma.coupon.findUnique({
      where: { id: couponId },
      include: { product: true },
    });

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    if (coupon.customerId !== customer.id) {
      return NextResponse.json({ error: "Unauthorized to review this purchase" }, { status: 403 });
    }

    if (coupon.status !== "REDEEMED") {
      return NextResponse.json({ error: "Only redeemed purchases can be reviewed" }, { status: 400 });
    }

    // Check if review already exists for this coupon
    const existingReview = await prisma.review.findUnique({
      where: { couponId },
    });
    if (existingReview) {
      return NextResponse.json({ error: "This purchase has already been reviewed" }, { status: 400 });
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        rating,
        comment: comment?.trim() || null,
        customerId: customer.id,
        shopId: coupon.shopId || coupon.product.shopId,
        productId: coupon.productId,
        couponId: coupon.id,
        verifiedPurchase: true,
      },
    });

    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}

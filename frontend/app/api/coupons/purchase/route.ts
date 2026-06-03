// app/api/coupons/purchase/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { calculateCoupon } from "@/lib/couponCalculator";
import { createRazorpayOrder } from "@/lib/razorpay";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "productId required" }, { status: 400 });
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Get customer profile
    const customer = await prisma.customerProfile.findUnique({
      where: { clerkId: userId },
    });
    if (!customer) {
      return NextResponse.json({ error: "Customer profile not found. Please complete your profile." }, { status: 404 });
    }

    // Check if active coupon already exists
    const existingCoupon = await prisma.coupon.findFirst({
      where: {
        productId,
        customerId: customer.id,
        status: "ACTIVE",
        expiresAt: { gt: new Date() },
      },
    });
    if (existingCoupon) {
      return NextResponse.json({
        error: "You already have an active coupon for this product",
        coupon: existingCoupon,
      }, { status: 409 });
    }

    const tier = calculateCoupon(product.price);

    // Create Razorpay order
    const razorpayOrder = await createRazorpayOrder(
      tier.cost,
      `coupon-${productId}-${Date.now()}`,
      {
        productId,
        customerId: customer.id,
        type: "COUPON",
      }
    );

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: tier.cost,
      discountAmount: tier.discount,
      label: tier.label,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      productName: product.title,
      shopName: product.shop.shop_name,
    });
  } catch (err) {
    console.error("Coupon purchase error:", err);
    return NextResponse.json({ error: "Failed to initiate coupon purchase" }, { status: 500 });
  }
}

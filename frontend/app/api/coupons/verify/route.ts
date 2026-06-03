// app/api/coupons/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { calculateCoupon, generateCouponCode, getCouponExpiry } from "@/lib/couponCalculator";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      productId,
      useReferral,
    } = await req.json();

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    // Get customer
    const customer = await prisma.customerProfile.findUnique({
      where: { clerkId: userId },
    });
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true },
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const tier = calculateCoupon(product.price);
    const couponCode = generateCouponCode();
    const expiresAt = getCouponExpiry();

    const creditToUse = useReferral ? Math.min(customer.referralBalance, tier.cost) : 0;
    const remainingCost = tier.cost - creditToUse;

    // Deduct credits if applied
    if (creditToUse > 0) {
      await prisma.customerProfile.update({
        where: { id: customer.id },
        data: {
          referralBalance: {
            decrement: creditToUse
          }
        }
      });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        type: "COUPON",
        amount: remainingCost,
        status: "SUCCESS",
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        description: `Coupon for ${product.title} (Applied ₹${creditToUse} credit)`,
      },
    });

    // Create coupon (One-time use)
    const coupon = await prisma.coupon.create({
      data: {
        code: couponCode,
        qrData: JSON.stringify({
          code: couponCode,
          productId,
          shopId: product.shopId,
          discount: tier.discount,
          expires: expiresAt.toISOString(),
        }),
        couponCost: tier.cost,
        discountAmount: tier.discount,
        expiresAt,
        productId,
        customerId: customer.id,
        shopId: product.shopId, // link directly to shopId!
        paymentId: payment.id,
        razorpayOrderId,
      },
      include: {
        product: { include: { shop: true } },
      },
    });

    return NextResponse.json({ success: true, coupon });
  } catch (err) {
    console.error("Coupon verify error:", err);
    return NextResponse.json({ error: "Failed to verify coupon payment" }, { status: 500 });
  }
}

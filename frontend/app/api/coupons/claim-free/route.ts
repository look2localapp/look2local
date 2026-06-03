import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { calculateCoupon, generateCouponCode, getCouponExpiry } from "@/lib/couponCalculator";
import prisma from "@/lib/prisma";

// POST /api/coupons/claim-free
// Creates coupon entirely paid for via referral balance credits
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    // 1. Get customer profile
    const customer = await prisma.customerProfile.findUnique({
      where: { clerkId: userId }
    });
    if (!customer) {
      return NextResponse.json({ error: "Customer profile not found" }, { status: 404 });
    }

    // 2. Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true }
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Calculate cost
    const tier = calculateCoupon(product.price);
    
    // Check if customer has enough credits
    if (customer.referralBalance < tier.cost) {
      return NextResponse.json({
        error: `Insufficient credit balance. Coupon costs ₹${tier.cost}, but you only have ₹${customer.referralBalance}.`
      }, { status: 400 });
    }

    const couponCode = generateCouponCode();
    const expiresAt = getCouponExpiry();

    // 3. Database transaction: deduct balance and create coupon
    const coupon = await prisma.$transaction(async (tx) => {
      // Deduct balance
      await tx.customerProfile.update({
        where: { id: customer.id },
        data: {
          referralBalance: {
            decrement: tier.cost
          }
        }
      });

      // Create zero-amount payment record
      const payment = await tx.payment.create({
        data: {
          type: "COUPON",
          amount: 0,
          status: "SUCCESS",
          description: `Coupon for ${product.title} (Fully paid with ₹${tier.cost} credit)`,
        }
      });

      // Create coupon record
      return await tx.coupon.create({
        data: {
          code: couponCode,
          qrData: JSON.stringify({
            code: couponCode,
            productId,
            shopId: product.shopId,
            discount: tier.discount,
            expires: expiresAt.toISOString()
          }),
          couponCost: tier.cost,
          discountAmount: tier.discount,
          expiresAt,
          productId,
          customerId: customer.id,
          shopId: product.shopId, // link directly to shopId
          paymentId: payment.id,
        },
        include: {
          product: { include: { shop: true } }
        }
      });
    });

    return NextResponse.json({ success: true, coupon });

  } catch (error) {
    console.error("Claim free coupon error:", error);
    return NextResponse.json({ error: "Failed to claim coupon using credits" }, { status: 500 });
  }
}

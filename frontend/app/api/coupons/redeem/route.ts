import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getShopkeeperShop } from "@/lib/authHelper";

// POST /api/coupons/redeem
// Authenticated shopkeeper redeems a customer coupon
export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate shopkeeper & get shop
    const shop = await getShopkeeperShop();
    if (!shop) {
      return NextResponse.json({ error: "Unauthorized. Shopkeeper session not found." }, { status: 401 });
    }

    const { couponCode } = await req.json();
    if (!couponCode) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const formattedCode = couponCode.trim().toUpperCase();

    // 2. Fetch coupon details
    const coupon = await prisma.coupon.findUnique({
      where: { code: formattedCode },
      include: {
        product: {
          include: { shop: true }
        },
        customer: true
      }
    });

    // 3. Validation checks
    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code. Coupon not found." }, { status: 404 });
    }

    // Verify shop scoping: Coupon shopId or product.shopId must match this shopkeeper's shop
    const couponShopId = coupon.shopId || coupon.product.shopId;
    if (couponShopId !== shop.id) {
      return NextResponse.json({
        error: `Unauthorized. This coupon is for ${coupon.product.shop.shop_name}, and cannot be redeemed at ${shop.shop_name}.`
      }, { status: 403 });
    }

    // Verify status
    if (coupon.status === "REDEEMED") {
      return NextResponse.json({
        error: "Coupon Abuse Alert: This coupon has ALREADY been used/redeemed. It is a one-time use coupon only."
      }, { status: 400 });
    }

    if (coupon.status === "EXPIRED" || new Date(coupon.expiresAt) < new Date()) {
      // Update status to EXPIRED in DB for correctness
      if (coupon.status !== "EXPIRED") {
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { status: "EXPIRED" }
        });
      }
      return NextResponse.json({ error: "This coupon has expired and is no longer valid." }, { status: 400 });
    }

    // 4. Redeem the coupon (One-time use transition)
    const updatedCoupon = await prisma.coupon.update({
      where: { id: coupon.id },
      data: {
        status: "REDEEMED",
        redeemedAt: new Date()
      },
      include: {
        product: true,
        customer: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Coupon successfully redeemed!",
      coupon: {
        id: updatedCoupon.id,
        code: updatedCoupon.code,
        status: updatedCoupon.status,
        redeemedAt: updatedCoupon.redeemedAt,
        discountAmount: updatedCoupon.discountAmount,
        couponCost: updatedCoupon.couponCost,
        productName: updatedCoupon.product.title,
        customerName: updatedCoupon.customer.name,
      }
    });

  } catch (error) {
    console.error("Coupon redemption error:", error);
    return NextResponse.json({ error: "Failed to redeem coupon" }, { status: 500 });
  }
}

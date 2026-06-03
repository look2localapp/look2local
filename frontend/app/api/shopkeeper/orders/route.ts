import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getShopkeeperShop } from "@/lib/authHelper";

// GET /api/shopkeeper/orders
// Returns locked offers and coupons for the shopkeeper's shop
export async function GET(req: NextRequest) {
  try {
    const shop = await getShopkeeperShop();
    if (!shop) {
      return NextResponse.json({ error: "Unauthorized. Shop not found." }, { status: 401 });
    }

    // 1. Fetch locked offers
    const lockedOffers = await prisma.lockedOffer.findMany({
      where: {
        product: { shopId: shop.id }
      },
      include: {
        product: true
      },
      orderBy: {
        lockedAt: "desc"
      }
    });

    // 2. Fetch coupons
    const coupons = await prisma.coupon.findMany({
      where: {
        shopId: shop.id
      },
      include: {
        product: true,
        customer: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    // Transform locked offers to common format
    const formattedLocks = lockedOffers.map(lock => {
      const isExpired = new Date() > new Date(lock.expiresAt) && lock.status === "LOCKED";
      return {
        id: lock.id,
        code: lock.lock_code,
        type: "LOCK", // Locked Offer
        status: isExpired ? "EXPIRED" : lock.status,
        customerName: lock.customer_name,
        customerPhone: lock.customer_phone,
        customerAddress: lock.customer_address,
        productName: lock.product.title,
        price: lock.product.price - lock.product.discount,
        createdAt: lock.lockedAt.toISOString(),
        expiresAt: lock.expiresAt.toISOString(),
      };
    });

    // Transform coupons to common format
    const formattedCoupons = coupons.map(coupon => {
      const isExpired = new Date() > new Date(coupon.expiresAt) && coupon.status === "ACTIVE";
      return {
        id: coupon.id,
        code: coupon.code,
        type: "COUPON",
        status: isExpired ? "EXPIRED" : coupon.status,
        customerName: coupon.customer.name,
        customerPhone: coupon.customer.phone || "Not set",
        customerAddress: coupon.customer.address || "Not set",
        productName: coupon.product.title,
        price: coupon.product.price - coupon.discountAmount, // effective price
        createdAt: coupon.createdAt.toISOString(),
        expiresAt: coupon.expiresAt.toISOString(),
      };
    });

    return NextResponse.json({
      orders: [...formattedLocks, ...formattedCoupons],
    });

  } catch (error) {
    console.error("Fetch shopkeeper orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// PUT /api/shopkeeper/orders
// Redeems a Locked Offer
export async function PUT(req: NextRequest) {
  try {
    const shop = await getShopkeeperShop();
    if (!shop) {
      return NextResponse.json({ error: "Unauthorized. Shop not found." }, { status: 401 });
    }

    const { lockId } = await req.json();
    if (!lockId) {
      return NextResponse.json({ error: "lockId is required" }, { status: 400 });
    }

    // 1. Fetch locked offer and verify it's for this shopkeeper's shop
    const lock = await prisma.lockedOffer.findUnique({
      where: { id: lockId },
      include: { product: true }
    });

    if (!lock) {
      return NextResponse.json({ error: "Locked offer not found" }, { status: 404 });
    }

    if (lock.product.shopId !== shop.id) {
      return NextResponse.json({ error: "Unauthorized. This offer belongs to another shop." }, { status: 403 });
    }

    if (lock.status === "REDEEMED") {
      return NextResponse.json({ error: "This offer has already been redeemed." }, { status: 400 });
    }

    if (new Date() > new Date(lock.expiresAt)) {
      return NextResponse.json({ error: "This locked offer has expired." }, { status: 400 });
    }

    // 2. Mark as redeemed
    const updated = await prisma.lockedOffer.update({
      where: { id: lockId },
      data: { status: "REDEEMED" }
    });

    return NextResponse.json({
      success: true,
      message: "Offer successfully redeemed!",
      offer: updated
    });

  } catch (error) {
    console.error("Redeem locked offer error:", error);
    return NextResponse.json({ error: "Failed to redeem offer" }, { status: 500 });
  }
}

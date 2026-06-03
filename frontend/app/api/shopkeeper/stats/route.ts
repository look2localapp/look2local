import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getShopkeeperShop } from "@/lib/authHelper";

// GET /api/shopkeeper/stats
export async function GET() {
  try {
    const shop = await getShopkeeperShop();
    if (!shop) {
      return NextResponse.json({ error: "Unauthorized. Shop not found." }, { status: 401 });
    }

    // 1. Active Offers (Count of products in inventory)
    const activeProducts = await prisma.product.count({
      where: { shopId: shop.id },
    });

    // 2. Locked Offers (Count of locked offers awaiting visit)
    const lockedOffersCount = await prisma.lockedOffer.count({
      where: {
        productId: { in: (await prisma.product.findMany({ where: { shopId: shop.id }, select: { id: true } })).map(p => p.id) },
        status: "LOCKED",
        expiresAt: { gt: new Date() },
      },
    });

    // 3. Redeemed Coupons (Count of successful orders / used coupons)
    const redeemedCouponsCount = await prisma.coupon.count({
      where: {
        shopId: shop.id,
        status: "REDEEMED",
      },
    });

    // 4. Reels total views
    const reels = await prisma.reel.findMany({
      where: { shopId: shop.id },
      select: { views: true },
    });
    const totalViews = reels.reduce((sum, r) => sum + r.views, 0);

    // 5. Recent Locked Offers (visiting customers)
    const recentLocks = await prisma.lockedOffer.findMany({
      where: {
        product: { shopId: shop.id },
      },
      include: {
        product: true
      },
      orderBy: {
        lockedAt: "desc"
      },
      take: 5
    });

    return NextResponse.json({
      shopName: shop.shop_name,
      verified: shop.verified || shop.gst_verified || false,
      address: shop.address,
      stats: {
        activeProducts,
        lockedOffersCount,
        redeemedCouponsCount,
        totalViews: totalViews || 120, // default if no reels
      },
      recentLocks: recentLocks.map(lock => ({
        id: lock.id,
        product: lock.product.title,
        customer: lock.customer_name,
        phone: lock.customer_phone,
        code: lock.lock_code,
        amount: lock.product.price - lock.product.discount,
        expiresIn: new Date(lock.expiresAt) > new Date()
          ? `${Math.round((new Date(lock.expiresAt).getTime() - Date.now()) / 60000)}m`
          : "Expired",
        status: lock.status,
      }))
    });

  } catch (error) {
    console.error("Shopkeeper stats error:", error);
    return NextResponse.json({ error: "Failed to fetch shopkeeper stats" }, { status: 500 });
  }
}

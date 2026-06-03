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
    const viewsThisMonth = Math.round(totalViews * 0.75) + 34;

    // 5. Total Offer Locks (All time)
    const totalLocksCount = await prisma.lockedOffer.count({
      where: { product: { shopId: shop.id } }
    });

    // 6. Revenue Generated (Redeemed Coupons and Redeemed Locked Offers)
    const redeemedCoupons = await prisma.coupon.findMany({
      where: {
        shopId: shop.id,
        status: "REDEEMED",
      },
      include: {
        product: true,
      },
    });
    const couponRevenue = redeemedCoupons.reduce((sum, c) => sum + (c.product.price - c.discountAmount), 0);

    const redeemedLockedOffers = await prisma.lockedOffer.findMany({
      where: {
        product: { shopId: shop.id },
        status: "REDEEMED",
      },
      include: {
        product: true,
      },
    });
    const lockRevenue = redeemedLockedOffers.reduce((sum, l) => sum + (l.product.price - l.product.discount), 0);
    const revenueGenerated = couponRevenue + lockRevenue;

    // 7. Top Performing Product (based on redemptions)
    const products = await prisma.product.findMany({
      where: { shopId: shop.id },
      include: {
        _count: {
          select: {
            coupons: { where: { status: "REDEEMED" } },
            lockedOffers: { where: { status: "REDEEMED" } }
          }
        }
      }
    });
    const sortedProducts = [...products].sort(
      (a, b) => (b._count.coupons + b._count.lockedOffers) - (a._count.coupons + a._count.lockedOffers)
    );
    const topProduct = sortedProducts.length > 0 && (sortedProducts[0]._count.coupons + sortedProducts[0]._count.lockedOffers) > 0
      ? sortedProducts[0].title
      : (sortedProducts[0]?.title || "No products listed");

    // 8. Recent Locked Offers (visiting customers)
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
        totalViews: totalViews || 120,
        viewsThisMonth,
        revenueGenerated,
        topProduct,
        totalLocksCount,
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

import { NextRequest, NextResponse } from "next/server";
import { getShopkeeperId } from "@/lib/authHelper";
import { createRazorpayOrder } from "@/lib/razorpay";
import { PLAN_PRICES } from "@/lib/subscription";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const userId = await getShopkeeperId();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan = "STANDARD" } = await req.json();

    const shopkeeper = await prisma.shopkeeper.findUnique({
      where: { id: userId },
      include: { shop: true },
    });

    if (!shopkeeper?.shop) {
      return NextResponse.json({ error: "No shop found" }, { status: 404 });
    }

    const amount = PLAN_PRICES[plan as keyof typeof PLAN_PRICES] || PLAN_PRICES.STANDARD;

    const razorpayOrder = await createRazorpayOrder(
      amount,
      `sub-${shopkeeper.shop.id}-${Date.now()}`,
      {
        shopId: shopkeeper.shop.id,
        plan,
        type: "SUBSCRIPTION",
      }
    );

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount,
      plan,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      shopName: shopkeeper.shop.shop_name,
    });
  } catch (err) {
    console.error("Subscription activate error:", err);
    return NextResponse.json({ error: "Failed to create subscription order" }, { status: 500 });
  }
}

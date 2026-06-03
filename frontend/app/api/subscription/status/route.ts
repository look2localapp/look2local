// app/api/subscription/status/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { getTrialStatus } from "@/lib/subscription";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get shop for this shopkeeper
    const shopkeeper = await prisma.shopkeeper.findUnique({
      where: { id: userId },
      include: {
        shop: {
          include: { subscription: true },
        },
      },
    });

    if (!shopkeeper?.shop) {
      return NextResponse.json({ error: "No shop found" }, { status: 404 });
    }

    const shop = shopkeeper.shop;
    const sub = shop.subscription;

    if (!sub) {
      // Free trial based on shop creation date
      const trial = getTrialStatus(shop.createdAt);
      return NextResponse.json({
        plan: "FREE_TRIAL",
        status: trial.active ? "ACTIVE" : "EXPIRED",
        isActive: trial.active,
        daysRemaining: trial.daysRemaining,
        trialEndDate: trial.trialEndDate,
        subscriptionEndDate: null,
        isTrialExpired: !trial.active,
        shopCreatedAt: shop.createdAt,
      });
    }

    const isActive = sub.status === "ACTIVE" && new Date(sub.endDate) > new Date();
    const daysRemaining = Math.max(
      0,
      Math.ceil((new Date(sub.endDate).getTime() - Date.now()) / 86400000)
    );

    return NextResponse.json({
      plan: sub.plan,
      status: sub.status,
      isActive,
      daysRemaining,
      trialEndDate: null,
      subscriptionEndDate: sub.endDate,
      isTrialExpired: false,
      subscriptionId: sub.id,
    });
  } catch (err) {
    console.error("Subscription status error:", err);
    return NextResponse.json({ error: "Failed to fetch subscription status" }, { status: 500 });
  }
}

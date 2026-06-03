// app/api/subscription/verify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { getSubscriptionEndDate } from "@/lib/subscription";
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
      plan = "STANDARD",
    } = await req.json();

    const isValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const shopkeeper = await prisma.shopkeeper.findUnique({
      where: { id: userId },
      include: { shop: { include: { subscription: true } } },
    });

    if (!shopkeeper?.shop) {
      return NextResponse.json({ error: "No shop found" }, { status: 404 });
    }

    const endDate = getSubscriptionEndDate();
    const amount = plan === "STANDARD" ? 150 : 299;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        type: "SUBSCRIPTION",
        amount,
        status: "SUCCESS",
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
        description: `${plan} Plan - 1 Month`,
      },
    });

    // Upsert subscription
    const subscription = await prisma.subscription.upsert({
      where: { shopId: shopkeeper.shop.id },
      update: {
        plan,
        status: "ACTIVE",
        startDate: new Date(),
        endDate,
      },
      create: {
        plan,
        status: "ACTIVE",
        endDate,
        shopId: shopkeeper.shop.id,
      },
    });

    // Link payment to subscription
    await prisma.payment.update({
      where: { id: payment.id },
      data: { subscriptionId: subscription.id },
    });

    return NextResponse.json({ success: true, subscription, plan, endDate });
  } catch (err) {
    console.error("Subscription verify error:", err);
    return NextResponse.json({ error: "Failed to verify subscription payment" }, { status: 500 });
  }
}

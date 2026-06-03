import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// POST /api/customer/referral
// Link inviter and award ₹25 coupon credit to them
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { referralCode } = await req.json();
    if (!referralCode) {
      return NextResponse.json({ error: "Referral code is required" }, { status: 400 });
    }

    const formattedCode = referralCode.trim().toUpperCase();

    // 1. Get current customer
    const currentCustomer = await prisma.customerProfile.findUnique({
      where: { clerkId: userId }
    });

    if (!currentCustomer) {
      return NextResponse.json({ error: "Customer profile not found" }, { status: 404 });
    }

    // Check if already referred
    if (currentCustomer.referredById) {
      return NextResponse.json({ error: "You have already entered a referral code." }, { status: 400 });
    }

    // 2. Find inviter
    const inviter = await prisma.customerProfile.findUnique({
      where: { referralCode: formattedCode }
    });

    if (!inviter) {
      return NextResponse.json({ error: "Invalid referral code. No matching user found." }, { status: 404 });
    }

    // Prevent self-referral
    if (inviter.id === currentCustomer.id) {
      return NextResponse.json({ error: "You cannot use your own referral code." }, { status: 400 });
    }

    // 3. Perform atomic database update
    await prisma.$transaction([
      // Link the referral
      prisma.customerProfile.update({
        where: { id: currentCustomer.id },
        data: { referredById: inviter.id }
      }),
      // Credit ₹25 to inviter
      prisma.customerProfile.update({
        where: { id: inviter.id },
        data: {
          referralBalance: {
            increment: 25.0
          }
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      message: `Referral code applied! ₹25 credit rewarded to ${inviter.name}.`,
    });

  } catch (error) {
    console.error("Referral process error:", error);
    return NextResponse.json({ error: "Failed to process referral" }, { status: 500 });
  }
}

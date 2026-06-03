// app/api/admin/shops/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

// Simple admin check — in production, check role from DB or Clerk metadata
async function isAdmin(userId: string): Promise<boolean> {
  const adminIds = process.env.ADMIN_CLERK_IDS?.split(",") || [];
  return adminIds.includes(userId);
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // verified | unverified

    const shops = await prisma.shop.findMany({
      where: status === "verified"
        ? { verified: true }
        : status === "unverified"
        ? { verified: false }
        : undefined,
      include: {
        shopkeeper: true,
        subscription: true,
        _count: { select: { products: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ shops });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { shopId, action, featured } = await req.json();
    // action: "approve" | "reject" | "verify_gst" | "feature"

    let update: Record<string, unknown> = {};
    if (action === "approve") update = { verified: true };
    else if (action === "reject") update = { verified: false };
    else if (action === "verify_gst") update = { gst_verified: true };
    else if (action === "feature") update = { featured: !!featured };

    const shop = await prisma.shop.update({
      where: { id: shopId },
      data: update,
    });

    return NextResponse.json({ shop });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

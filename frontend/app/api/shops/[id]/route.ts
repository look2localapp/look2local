import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/shops/[id] — get single shop with all products and card offers
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const shop = await prisma.shop.findUnique({
      where: { id },
      include: {
        products: {
          include: { cardOffers: true },
          orderBy: { createdAt: "desc" },
        },
        reels: { orderBy: { createdAt: "desc" }, take: 6 },
      },
    });

    if (!shop) return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    return NextResponse.json({ shop });
  } catch (error) {
    console.error("GET /api/shops/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch shop" }, { status: 500 });
  }
}


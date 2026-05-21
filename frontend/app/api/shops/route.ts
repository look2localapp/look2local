import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/shops — list all verified shops
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const verified = searchParams.get("verified");

    const shops = await prisma.shop.findMany({
      where: {
        ...(category ? { category: { contains: category, mode: "insensitive" } } : {}),
        ...(verified === "true" ? { verified: true } : {}),
      },
      include: {
        products: { take: 3 },
        _count: { select: { products: true, reels: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ shops });
  } catch (error) {
    console.error("GET /api/shops error:", error);
    return NextResponse.json({ error: "Failed to fetch shops" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/search?q=iphone — find all shops selling products matching query
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";

    if (!q.trim()) {
      return NextResponse.json({ results: [] });
    }

    // Find all products matching the search query, include shop + card offers
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
        inStock: true,
      },
      include: {
        shop: true,
        cardOffers: true,
      },
      orderBy: { price: "asc" },
    });

    return NextResponse.json({ results: products, query: q });
  } catch (error) {
    console.error("GET /api/search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

// app/api/master-catalog/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";

    if (!q && !category) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.masterProduct.findMany({
      where: {
        AND: [
          q
            ? {
                OR: [
                  { name: { contains: q, mode: "insensitive" } },
                  { brand: { contains: q, mode: "insensitive" } },
                ],
              }
            : {},
          category ? { category: { equals: category, mode: "insensitive" } } : {},
        ],
      },
      take: 15,
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error("Master catalog search error:", err);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

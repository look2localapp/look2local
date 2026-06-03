// app/api/barcode/scan/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const barcode = searchParams.get("barcode");

  if (!barcode) {
    return NextResponse.json({ error: "Barcode required" }, { status: 400 });
  }

  try {
    // 1. Check our master catalog first
    const masterProduct = await prisma.masterProduct.findUnique({
      where: { barcode },
    });

    if (masterProduct) {
      return NextResponse.json({
        source: "master_catalog",
        product: masterProduct,
      });
    }

    // 2. Try Open Food Facts API (free, no key needed)
    const offResponse = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      { next: { revalidate: 3600 } }
    );

    if (offResponse.ok) {
      const offData = await offResponse.json();
      if (offData.status === 1 && offData.product) {
        const p = offData.product;
        return NextResponse.json({
          source: "open_food_facts",
          product: {
            name: p.product_name || p.product_name_en || "Unknown Product",
            brand: p.brands || "",
            category: p.categories_tags?.[0]?.replace("en:", "") || "Other",
            image: p.image_url || null,
            barcode,
            description: p.generic_name || "",
          },
        });
      }
    }

    // 3. Try UPC ItemDB (free tier)
    const upcResponse = await fetch(
      `https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`
    );

    if (upcResponse.ok) {
      const upcData = await upcResponse.json();
      if (upcData.code === "OK" && upcData.items?.length > 0) {
        const item = upcData.items[0];
        return NextResponse.json({
          source: "upcitemdb",
          product: {
            name: item.title,
            brand: item.brand,
            category: item.category || "Electronics",
            image: item.images?.[0] || null,
            barcode,
            description: item.description || "",
          },
        });
      }
    }

    return NextResponse.json({ error: "Product not found for this barcode" }, { status: 404 });
  } catch (err) {
    console.error("Barcode scan error:", err);
    return NextResponse.json({ error: "Failed to scan barcode" }, { status: 500 });
  }
}

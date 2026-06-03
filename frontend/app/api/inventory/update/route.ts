// app/api/inventory/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, stock } = await req.json();

    if (typeof stock !== "number" || stock < 0) {
      return NextResponse.json({ error: "Invalid stock value" }, { status: 400 });
    }

    // Verify shopkeeper owns this product
    const shopkeeper = await prisma.shopkeeper.findUnique({
      where: { id: userId },
      include: { shop: { include: { products: { where: { id: productId } } } } },
    });

    if (!shopkeeper?.shop || shopkeeper.shop.products.length === 0) {
      return NextResponse.json({ error: "Product not found or unauthorized" }, { status: 403 });
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        stock,
        inStock: stock > 0,
      },
    });

    return NextResponse.json({ product });
  } catch (err) {
    console.error("Inventory update error:", err);
    return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shopkeeper = await prisma.shopkeeper.findUnique({
      where: { id: userId },
      include: {
        shop: {
          include: {
            products: {
              orderBy: { stock: "asc" },
              select: {
                id: true,
                title: true,
                price: true,
                stock: true,
                inStock: true,
                images: true,
                category: true,
                brand: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!shopkeeper?.shop) {
      return NextResponse.json({ error: "No shop found" }, { status: 404 });
    }

    return NextResponse.json({ products: shopkeeper.shop.products });
  } catch (err) {
    console.error("Inventory fetch error:", err);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}

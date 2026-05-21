import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/lock-offer — customer locks an offer and their details are stored
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, customerName, customerPhone, customerAddress, customerMapLink } = body;

    // Validate required fields
    if (!productId || !customerName || !customerPhone || !customerAddress) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check product exists and is in stock
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { shop: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    if (!product.inStock) {
      return NextResponse.json({ error: "Product is out of stock" }, { status: 400 });
    }

    // Generate unique lock code: L2L-XXXXX
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let suffix = "";
    for (let i = 0; i < 5; i++) suffix += chars[Math.floor(Math.random() * chars.length)];
    const lock_code = `L2L-${suffix}`;

    // Expire in 2 hours
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

    const lockedOffer = await prisma.lockedOffer.create({
      data: {
        lock_code,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        customer_map_link: customerMapLink ?? null,
        expiresAt,
        status: "LOCKED",
        productId,
      },
    });

    return NextResponse.json({
      success: true,
      lockCode: lockedOffer.lock_code,
      expiresAt: lockedOffer.expiresAt,
      shopName: product.shop.shop_name,
      shopMapLink: product.shop.google_map_link,
    });
  } catch (error) {
    console.error("POST /api/lock-offer error:", error);
    return NextResponse.json({ error: "Failed to lock offer" }, { status: 500 });
  }
}

// GET /api/lock-offer?code=L2L-XXXXX — verify a lock code
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) return NextResponse.json({ error: "Lock code required" }, { status: 400 });

    const lock = await prisma.lockedOffer.findUnique({
      where: { lock_code: code },
      include: { product: { include: { shop: true } } },
    });

    if (!lock) return NextResponse.json({ error: "Lock code not found" }, { status: 404 });

    const isExpired = new Date() > new Date(lock.expiresAt);
    return NextResponse.json({
      lock,
      isExpired,
      status: isExpired ? "EXPIRED" : lock.status,
    });
  } catch (error) {
    console.error("GET /api/lock-offer error:", error);
    return NextResponse.json({ error: "Failed to verify code" }, { status: 500 });
  }
}

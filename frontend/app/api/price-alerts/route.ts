// app/api/price-alerts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const customer = await prisma.customerProfile.findUnique({ where: { clerkId: userId } });
    if (!customer) return NextResponse.json({ alerts: [] });

    const alerts = await prisma.priceAlert.findMany({
      where: { customerId: customer.id },
      include: { product: { include: { shop: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ alerts });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId, targetPrice } = await req.json();
    const customer = await prisma.customerProfile.findUnique({ where: { clerkId: userId } });
    if (!customer) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const alert = await prisma.priceAlert.upsert({
      where: { customerId_productId: { customerId: customer.id, productId } },
      create: { customerId: customer.id, productId, targetPrice },
      update: { targetPrice, triggered: false },
    });

    return NextResponse.json({ alert });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId } = await req.json();
    const customer = await prisma.customerProfile.findUnique({ where: { clerkId: userId } });
    if (!customer) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    await prisma.priceAlert.deleteMany({
      where: { customerId: customer.id, productId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

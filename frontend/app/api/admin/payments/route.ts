// app/api/admin/payments/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

async function isAdmin(userId: string) {
  const adminIds = process.env.ADMIN_CLERK_IDS?.split(",") || [];
  return adminIds.includes(userId);
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payments = await prisma.payment.findMany({
      orderBy: { createdAt: "desc" },
      include: { subscription: { include: { shop: true } } },
      take: 100,
    });

    return NextResponse.json({ payments });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

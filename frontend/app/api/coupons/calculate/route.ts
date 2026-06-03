// app/api/coupons/calculate/route.ts
import { NextRequest, NextResponse } from "next/server";
import { calculateCoupon } from "@/lib/couponCalculator";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const price = parseFloat(searchParams.get("price") || "0");

  if (!price || price <= 0) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const tier = calculateCoupon(price);
  return NextResponse.json({
    productPrice: price,
    couponCost: tier.cost,
    discountAmount: tier.discount,
    label: tier.label,
    roi: `${Math.round((tier.discount / tier.cost) * 100)}%`,
  });
}

// lib/couponCalculator.ts
// Dynamic coupon pricing based on product value

export interface CouponTier {
  cost: number;
  discount: number;
  label: string;
}

export function calculateCoupon(productPrice: number): CouponTier {
  if (productPrice < 2000) {
    return { cost: 10, discount: 50, label: "Starter Saver" };
  }
  if (productPrice < 7500) {
    return { cost: 25, discount: 150, label: "Value Saver" };
  }
  if (productPrice < 15000) {
    return { cost: 50, discount: 300, label: "Smart Saver" };
  }
  if (productPrice < 35000) {
    return { cost: 100, discount: 750, label: "Premium Saver" };
  }
  // ₹50,000+
  return {
    cost: 200,
    discount: Math.round(productPrice * 0.03),
    label: "Elite Saver",
  };
}

export function generateCouponCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "L2L-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getCouponExpiry(): Date {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7); // 7 days validity
  return expiry;
}

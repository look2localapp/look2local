// lib/razorpay.ts
// Razorpay server-side utility

import crypto from "crypto";

export function getRazorpayInstance() {
  // Dynamic import to avoid issues in edge runtime
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Razorpay = require("razorpay");
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET!;
  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
}

export async function createRazorpayOrder(
  amount: number, // in paise (₹1 = 100 paise)
  receipt: string,
  notes?: Record<string, string>
) {
  const razorpay = getRazorpayInstance();
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100), // convert ₹ to paise
    currency: "INR",
    receipt,
    notes,
  });
  return order;
}

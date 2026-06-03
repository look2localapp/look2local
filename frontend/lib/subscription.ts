// lib/subscription.ts
// Subscription plan management utilities

export type PlanType = "FREE_TRIAL" | "STANDARD" | "PREMIUM";

export interface SubscriptionStatus {
  plan: PlanType;
  status: string;
  isActive: boolean;
  daysRemaining: number;
  trialEndDate: Date | null;
  subscriptionEndDate: Date | null;
  isTrialExpired: boolean;
}

export const PLAN_PRICES = {
  STANDARD: 149, // ₹149/month
  PREMIUM: 299,  // ₹299/month (future)
} as const;

export const PLAN_FEATURES = {
  FREE_TRIAL: [
    "30 Days Free Trial",
    "Up to 500 Products",
    "Google Maps Listing",
    "Basic Analytics",
    "Offer Lock Feature",
  ],
  STANDARD: [
    "Up to 500 Products",
    "Unlimited Offers",
    "Google Maps Listing",
    "Offer Lock Feature",
    "Product Reels",
    "Basic Analytics",
  ],
  PREMIUM: [
    "Everything in Standard",
    "Featured Listings",
    "Homepage Promotion",
    "Advanced Analytics",
    "Priority Support",
  ],
} as const;

export function getTrialStatus(shopCreatedAt: Date): {
  active: boolean;
  daysRemaining: number;
  trialEndDate: Date;
} {
  const trialEndDate = new Date(shopCreatedAt);
  trialEndDate.setDate(trialEndDate.getDate() + 30);
  const daysRemaining = Math.max(
    0,
    Math.ceil((trialEndDate.getTime() - Date.now()) / 86400000)
  );
  return {
    active: daysRemaining > 0,
    daysRemaining,
    trialEndDate,
  };
}

export function getSubscriptionEndDate(): Date {
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);
  return endDate;
}

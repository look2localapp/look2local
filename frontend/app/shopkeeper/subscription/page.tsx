"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  Crown, CheckCircle2, Zap, Clock, AlertTriangle,
  CreditCard, ArrowLeft, Sparkles, Shield, BarChart3,
  Package, Video, MapPin, Lock
} from "lucide-react";

interface SubStatus {
  plan: string;
  status: string;
  isActive: boolean;
  daysRemaining: number;
  trialEndDate: string | null;
  subscriptionEndDate: string | null;
  isTrialExpired: boolean;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const STANDARD_FEATURES = [
  { icon: Package, text: "Up to 500 Products" },
  { icon: Zap, text: "Unlimited Offers" },
  { icon: MapPin, text: "Google Maps Listing" },
  { icon: Lock, text: "Offer Lock Feature" },
  { icon: Video, text: "Product Reels" },
  { icon: BarChart3, text: "Basic Analytics" },
];

export default function SubscriptionPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [status, setStatus] = useState<SubStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isSignedIn) { router.push("/sign-in"); return; }
    fetchStatus();
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const fetchStatus = async () => {
    const res = await fetch("/api/subscription/status");
    const data = await res.json();
    setStatus(data);
    setLoading(false);
  };

  const handleActivate = async () => {
    setPaying(true);
    try {
      const res = await fetch("/api/subscription/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "STANDARD" }),
      });
      const order = await res.json();

      const options = {
        key: order.keyId,
        amount: order.amount * 100,
        currency: "INR",
        name: "Look2Local",
        description: "Standard Plan — ₹149/month",
        order_id: order.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch("/api/subscription/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              plan: "STANDARD",
            }),
          });
          const data = await verifyRes.json();
          if (data.success) {
            setSuccess(true);
            await fetchStatus();
          }
        },
        prefill: { name: order.shopName },
        theme: { color: "#f97316" },
        modal: { ondismiss: () => setPaying(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      setPaying(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F0F2F8] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const isStandard = status?.plan === "STANDARD" && status?.isActive;
  const isTrial = status?.plan === "FREE_TRIAL";
  const isExpired = status?.isTrialExpired || (!status?.isActive && status?.plan !== "FREE_TRIAL");

  return (
    <div className="min-h-screen bg-[#F0F2F8]">
      {/* Header */}
      <div className={`pt-8 pb-20 px-4 ${isStandard ? "bg-gradient-to-br from-emerald-900 to-teal-900" : isExpired ? "bg-gradient-to-br from-red-900 to-rose-900" : "bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"}`}>
        <div className="max-w-2xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-white/60 hover:text-white mb-6 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="text-center">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl ${isStandard ? "bg-emerald-500" : isExpired ? "bg-red-500" : "bg-orange-500"}`}>
              {isStandard ? <Crown className="w-8 h-8 text-white" /> :
               isExpired ? <AlertTriangle className="w-8 h-8 text-white" /> :
               <Zap className="w-8 h-8 text-white" />}
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-2">
              {isStandard ? "Standard Plan Active" :
               isExpired ? "Subscription Expired" :
               "Your Subscription"}
            </h1>

            {isTrial && !isExpired && (
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm px-4 py-2 rounded-full">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span>{status.daysRemaining} days remaining in free trial</span>
              </div>
            )}
            {isStandard && (
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm px-4 py-2 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
                <span>Active until {new Date(status!.subscriptionEndDate!).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              </div>
            )}
            {isExpired && (
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-sm px-4 py-2 rounded-full">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Your trial has expired</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-12 pb-10">
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-green-800">Payment Successful!</p>
              <p className="text-green-700 text-sm">Your Standard Plan is now active. Thank you!</p>
            </div>
          </div>
        )}

        {/* Expired warning */}
        {isExpired && !success && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-5">
            <h3 className="font-bold text-red-900 mb-1 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Your trial has expired
            </h3>
            <p className="text-red-700 text-sm">
              Continue using Look2Local and keep your products visible to customers for only ₹149/month.
            </p>
          </div>
        )}

        {/* Plan Card */}
        <div className={`rounded-3xl p-6 mb-5 relative overflow-hidden ${isStandard ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-orange-500 to-red-500"}`}>
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -right-4 bottom-0 w-24 h-24 bg-white/5 rounded-full" />
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-white/70 text-xs font-bold uppercase tracking-widest">Standard Plan</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-4xl font-black text-white">₹149</span>
                  <span className="text-white/70 text-sm">/month</span>
                </div>
                <p className="text-white/60 text-xs mt-1">Equivalent to ₹5/day</p>
              </div>
              <div className="bg-white/20 rounded-2xl px-3 py-1.5">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {STANDARD_FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-white/80 flex-shrink-0" />
                  <span className="text-white/90 text-xs font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Free Trial info */}
        {isTrial && !isExpired && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-5">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" /> Free Trial Status
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all"
                  style={{ width: `${Math.max(0, 100 - (status!.daysRemaining / 30) * 100)}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-700">{status!.daysRemaining}/30 days</span>
            </div>
            <p className="text-gray-500 text-sm">
              {status!.daysRemaining <= 5
                ? `⚠️ Your trial expires in ${status!.daysRemaining} days. Subscribe now to keep your shop visible.`
                : `Enjoy ${status!.daysRemaining} more days of free access.`}
            </p>
          </div>
        )}

        {/* Trust badges */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5 mb-5">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: Shield, text: "Secure Payment", sub: "Razorpay" },
              { icon: CreditCard, text: "All Methods", sub: "UPI, Cards, Net Banking" },
              { icon: Zap, text: "Instant Activation", sub: "Auto-renew" },
            ].map(({ icon: Icon, text, sub }) => (
              <div key={text}>
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Icon className="w-5 h-5 text-gray-500" />
                </div>
                <p className="text-xs font-bold text-gray-800">{text}</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {!isStandard && (
          <button
            onClick={handleActivate}
            disabled={paying}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white font-black text-lg rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3"
          >
            {paying ? (
              <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                {isExpired ? "Reactivate — ₹149/month" : "Activate Standard Plan — ₹149/month"}
              </>
            )}
          </button>
        )}

        {isStandard && (
          <button
            onClick={handleActivate}
            disabled={paying}
            className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-90 text-white font-bold text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3"
          >
            <CreditCard className="w-5 h-5" />
            Renew for Another Month — ₹149
          </button>
        )}

        {/* Premium — Coming Soon */}
        <div className="mt-4 bg-gray-100 rounded-2xl p-4 text-center opacity-60">
          <Crown className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-gray-500">Premium Plan — Coming Soon</p>
          <p className="text-xs text-gray-400">Featured listings, homepage promotion, advanced analytics</p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  X, Ticket, IndianRupee, Zap, ShieldCheck,
  ArrowRight, CheckCircle2, Sparkles
} from "lucide-react";

interface Props {
  productId: string;
  productName: string;
  productPrice: number;
  shopName: string;
  productImage?: string;
  onClose: () => void;
  onSuccess: () => void;
}

interface CouponTier {
  couponCost: number;
  discountAmount: number;
  label: string;
  roi: string;
}

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function CouponPurchaseModal({
  productId,
  productName,
  productPrice,
  shopName,
  productImage,
  onClose,
  onSuccess,
}: Props) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [tier, setTier] = useState<CouponTier | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [step, setStep] = useState<"info" | "success">("info");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
    fetch(`/api/coupons/calculate?price=${productPrice}`)
      .then((r) => r.json())
      .then((d) => { setTier(d); setLoading(false); });
    return () => { document.body.removeChild(script); };
  }, [productPrice]);

  const handlePurchase = async () => {
    if (!isSignedIn) { router.push("/sign-in"); return; }
    setPurchasing(true);

    try {
      const res = await fetch("/api/coupons/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Failed to initiate purchase");
        setPurchasing(false);
        return;
      }

      const order = await res.json();

      const options = {
        key: order.keyId,
        amount: order.amount * 100,
        currency: "INR",
        name: "Look2Local",
        description: `Exclusive Coupon — ${productName}`,
        order_id: order.orderId,
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          const verifyRes = await fetch("/api/coupons/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              productId,
            }),
          });
          const data = await verifyRes.json();
          if (data.success) {
            setStep("success");
            onSuccess();
          }
          setPurchasing(false);
        },
        prefill: {},
        theme: { color: "#f97316" },
        modal: { ondismiss: () => setPurchasing(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      setPurchasing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Close */}
        <div className="flex justify-between items-center p-5 pb-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">Exclusive Coupon</span>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "success" ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Coupon Purchased! 🎉</h3>
            <p className="text-gray-500 text-sm mb-6">
              Your coupon is ready. Show it at <strong>{shopName}</strong> to save ₹{tier?.discountAmount}.
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm">Close</button>
              <button
                onClick={() => { onClose(); router.push("/profile/coupons"); }}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-1.5"
              >
                View Coupon <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5">
            {/* Product preview */}
            <div className="flex gap-3 bg-gray-50 rounded-2xl p-3 mb-5">
              {productImage ? (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <Image src={productImage} alt={productName} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm line-clamp-1">{productName}</p>
                <p className="text-xs text-gray-500 mb-1">{shopName}</p>
                <p className="text-sm font-bold text-orange-600">₹{productPrice.toLocaleString("en-IN")}</p>
              </div>
            </div>

            {loading ? (
              <div className="h-24 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : tier && (
              <>
                {/* Value proposition */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">{tier.label}</span>
                    <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-lg">{tier.roi} ROI</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">You Pay</p>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-5 h-5 text-orange-600" />
                        <span className="text-3xl font-black text-orange-600">{tier.couponCost}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <Zap className="w-5 h-5 text-purple-400 mb-1" />
                      <span className="text-xs text-gray-400">and save</span>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">You Save</p>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-5 h-5 text-green-600" />
                        <span className="text-3xl font-black text-green-600">{tier.discountAmount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2 mb-5">
                  {[
                    "Unique coupon code generated instantly",
                    "QR code for easy shop redemption",
                    "Valid for 7 days",
                    "Show at shop to get your discount",
                  ].map((b) => (
                    <div key={b} className="flex items-center gap-2 text-sm text-gray-600">
                      <Sparkles className="w-3.5 h-3.5 text-purple-500 flex-shrink-0" />
                      {b}
                    </div>
                  ))}
                </div>

                {/* Trust */}
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                  <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Secure payment via Razorpay · UPI, Cards, Net Banking accepted</span>
                </div>

                <button
                  onClick={handlePurchase}
                  disabled={purchasing}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 text-white font-black text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {purchasing ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Ticket className="w-5 h-5" />
                      Get Coupon — Pay ₹{tier.couponCost} → Save ₹{tier.discountAmount}
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

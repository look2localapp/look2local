"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Ticket, TrendingDown, IndianRupee, CheckCircle2,
  Clock, XCircle, QrCode, Copy, Check, ArrowLeft,
  ShoppingBag, Sparkles, Calendar, BadgePercent, Star
} from "lucide-react";
import QRCode from "qrcode";

interface CouponData {
  id: string;
  code: string;
  qrData: string;
  couponCost: number;
  discountAmount: number;
  status: string;
  expiresAt: string;
  createdAt: string;
  redeemedAt?: string;
  product: {
    id: string;
    title: string;
    images: string[];
    price: number;
    shop: { id: string; shop_name: string };
  };
  review?: { id: string; rating: number; comment?: string } | null;
}

interface Analytics {
  month: string;
  couponsPurchased: number;
  totalSpent: number;
  totalSaved: number;
  netSavings: number;
}

export default function MyCouponsPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<"all" | "active" | "redeemed">("all");

  // Review states
  const [selectedCouponForReview, setSelectedCouponForReview] = useState<CouponData | null>(null);
  const [newRating, setNewRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [reviewSubmitting, setReviewSubmitting] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  const fetchCoupons = useCallback(async () => {
    const res = await fetch("/api/coupons/my");
    const data = await res.json();
    setCoupons(data.coupons || []);
    setAnalytics(data.analytics || null);
    setLoading(false);

    // Generate QR codes
    for (const c of data.coupons || []) {
      try {
        const qr = await QRCode.toDataURL(c.qrData || c.code, {
          width: 200,
          margin: 1,
          color: { dark: "#1a1a2e", light: "#ffffff" },
        });
        setQrImages((prev) => ({ ...prev, [c.id]: qr }));
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (!isSignedIn) { router.push("/sign-in"); return; }
    fetchCoupons();
  }, [isSignedIn, router, fetchCoupons]);

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSimulateTime = async (couponId: string) => {
    try {
      const res = await fetch("/api/coupons/simulate-time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponId }),
      });
      if (res.ok) {
        await fetchCoupons();
      }
    } catch (err) {
      console.error("Simulation error:", err);
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedCouponForReview || newRating < 1 || newRating > 5) return;
    setReviewSubmitting(true);
    setReviewError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          couponId: selectedCouponForReview.id,
          rating: newRating,
          comment: reviewComment,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReviewError(data.error || "Failed to submit review");
      } else {
        await fetchCoupons();
        setSelectedCouponForReview(null);
        setNewRating(0);
        setReviewComment("");
      }
    } catch (err) {
      console.error(err);
      setReviewError("An error occurred. Please try again.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const filtered = coupons.filter((c) => {
    if (activeTab === "active") return c.status === "ACTIVE";
    if (activeTab === "redeemed") return c.status === "REDEEMED";
    return true;
  });

  const statusConfig = {
    ACTIVE: { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 border-green-200", label: "Active" },
    REDEEMED: { icon: Check, color: "text-blue-600", bg: "bg-blue-50 border-blue-200", label: "Redeemed" },
    EXPIRED: { icon: XCircle, color: "text-red-500", bg: "bg-red-50 border-red-200", label: "Expired" },
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-purple-200 font-medium">Loading your coupons…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F8]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] pt-8 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-300 hover:text-white mb-6 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">My Coupons</h1>
              <p className="text-blue-300 text-sm">Your exclusive deals &amp; savings</p>
            </div>
          </div>

          {/* Analytics cards */}
          {analytics && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Ticket, label: "Purchased", value: analytics.couponsPurchased, color: "from-blue-500 to-cyan-500", suffix: "" },
                { icon: IndianRupee, label: "Spent", value: analytics.totalSpent, color: "from-orange-500 to-red-500", suffix: "₹" },
                { icon: TrendingDown, label: "Saved", value: analytics.totalSaved, color: "from-green-500 to-emerald-500", suffix: "₹" },
                { icon: Sparkles, label: "Net Savings", value: analytics.netSavings, color: "from-purple-500 to-pink-500", suffix: "₹" },
              ].map(({ icon: Icon, label, value, color, suffix }) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-2`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-white/60 text-xs mb-0.5">{label}</p>
                  <p className="text-white text-xl font-extrabold">
                    {suffix}{typeof value === "number" ? value.toLocaleString("en-IN") : value}
                  </p>
                  <p className="text-white/40 text-[10px] mt-1">{analytics.month}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1.5 flex gap-1 mb-6">
          {(["all", "active", "redeemed"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all capitalize ${
                activeTab === tab
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab === "all" ? `All (${coupons.length})` :
               tab === "active" ? `Active (${coupons.filter(c => c.status === "ACTIVE").length})` :
               `Redeemed (${coupons.filter(c => c.status === "REDEEMED").length})`}
            </button>
          ))}
        </div>

        {/* Coupon list */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-purple-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Ticket className="w-10 h-10 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No coupons yet</h3>
            <p className="text-gray-500 text-sm mb-6">Browse products and get exclusive coupons to save money!</p>
            <button onClick={() => router.push("/search")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4 pb-8">
            {filtered.map((coupon) => {
              const cfg = statusConfig[coupon.status as keyof typeof statusConfig] || statusConfig.EXPIRED;
              const StatusIcon = cfg.icon;
              const isExpired = new Date(coupon.expiresAt) < new Date() && coupon.status === "ACTIVE";

              return (
                <div key={coupon.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Coupon top */}
                  <div className="p-5 flex gap-4">
                    {/* Product image */}
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0">
                      {coupon.product.images?.[0] ? (
                        <Image src={coupon.product.images[0]} alt={coupon.product.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{coupon.product.title}</h3>
                        <span className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {isExpired ? "Expired" : cfg.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{coupon.product.shop.shop_name}</p>

                      {/* Savings */}
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400">Paid</p>
                          <p className="text-sm font-bold text-orange-600">₹{coupon.couponCost}</p>
                        </div>
                        <div className="text-gray-300">→</div>
                        <div className="text-center">
                          <p className="text-[10px] text-gray-400">Saved</p>
                          <p className="text-sm font-bold text-green-600">₹{coupon.discountAmount}</p>
                        </div>
                        <div className="ml-auto">
                          <span className="bg-green-50 text-green-700 text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                            <BadgePercent className="w-3 h-3" />
                            {Math.round((coupon.discountAmount / coupon.couponCost) * 100)}x ROI
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Divider with dashed effect */}
                  <div className="flex items-center px-5 my-0">
                    <div className="w-6 h-6 bg-[#F0F2F8] rounded-full -ml-8 flex-shrink-0" />
                    <div className="flex-1 border-t-2 border-dashed border-gray-100 mx-2" />
                    <div className="w-6 h-6 bg-[#F0F2F8] rounded-full -mr-8 flex-shrink-0" />
                  </div>

                  {/* Coupon code + QR */}
                  <div className="p-5 flex items-center gap-4">
                    {/* QR Code */}
                    {qrImages[coupon.id] && (
                      <div className="flex-shrink-0">
                        <Image src={qrImages[coupon.id]} alt="QR" width={80} height={80} className="rounded-xl" />
                      </div>
                    )}
                    {!qrImages[coupon.id] && (
                      <div className="w-20 h-20 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <QrCode className="w-8 h-8 text-gray-300" />
                      </div>
                    )}

                    <div className="flex-1">
                      <p className="text-[10px] text-gray-400 mb-1">Show this code at the shop</p>
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-black text-lg text-purple-700 bg-purple-50 px-3 py-1.5 rounded-xl tracking-wider">
                          {coupon.code}
                        </code>
                        <button
                          onClick={() => copyCode(coupon.code)}
                          className="p-2 bg-gray-100 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all"
                        >
                          {copiedCode === coupon.code ? (
                            <Check className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {coupon.status === "REDEEMED"
                            ? `Redeemed`
                            : `Expires ${new Date(coupon.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                        </span>
                        <span className="mx-1">·</span>
                        <Clock className="w-3 h-3" />
                        <span>Purchased {new Date(coupon.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                      </div>
                    </div>
                  </div>

                  {coupon.status === "REDEEMED" && (
                    <div className="px-5 pb-5 pt-4 border-t border-dashed border-gray-100 bg-gray-50/55 flex flex-wrap items-center justify-between gap-3">
                      {coupon.review ? (
                        <div className="flex items-center gap-3 w-full justify-between sm:justify-start">
                          <span className="text-xs text-gray-500 font-bold">Your Review:</span>
                          <div className="flex gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= coupon.review!.rating ? "fill-current text-amber-500" : "text-gray-200 fill-current"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-lg flex items-center gap-0.5">
                            Verified Purchase
                          </span>
                        </div>
                      ) : (() => {
                        const redeemedTime = coupon.redeemedAt ? new Date(coupon.redeemedAt).getTime() : 0;
                        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;
                        const diff = Date.now() - redeemedTime;
                        const canReview = diff >= threeDaysMs;

                        if (canReview) {
                          return (
                            <div className="flex items-center justify-between w-full">
                              <span className="text-xs text-gray-500 font-bold">How was your purchase?</span>
                              <button
                                onClick={() => setSelectedCouponForReview(coupon)}
                                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1 active:scale-[0.98]"
                              >
                                <Star className="w-3.5 h-3.5 fill-current" /> Rate experience
                              </button>
                            </div>
                          );
                        } else {
                          const msLeft = threeDaysMs - diff;
                          const hoursLeft = Math.ceil(msLeft / (1000 * 60 * 60));
                          const daysLeft = Math.ceil(hoursLeft / 24);
                          const timeStr = daysLeft > 1 ? `${daysLeft} days` : `${hoursLeft} hours`;

                          return (
                            <div className="flex flex-wrap items-center justify-between w-full gap-2">
                              <span className="text-xs font-bold text-gray-500 bg-gray-100/80 px-2.5 py-1 rounded-xl flex items-center gap-1">
                                ⏳ Review locks in {timeStr}
                              </span>
                              <button
                                onClick={() => handleSimulateTime(coupon.id)}
                                className="text-[10px] font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-1 rounded-lg border border-purple-200 transition-colors"
                              >
                                ⚡ Simulate 3 Days Passed
                              </button>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedCouponForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-black text-gray-900 mb-1 flex items-center gap-2">
              ⭐ Rate Your Experience
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Share your verified purchase experience at <span className="font-bold text-purple-700">{selectedCouponForReview.product.shop.shop_name}</span> for <span className="font-bold text-gray-800">{selectedCouponForReview.product.title}</span>.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Rating</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setNewRating(star)}
                    className="transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        star <= (hoverRating || newRating) ? "text-amber-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Review Comment (Optional)</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                placeholder="How was the shop staff? Was the discount honored seamlessly?"
                className="w-full px-4 py-3 bg-gray-55 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-purple-400 focus:bg-white resize-none"
              />
            </div>

            {reviewError && (
              <p className="text-xs text-red-500 font-bold mb-4">{reviewError}</p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReviewSubmit}
                disabled={reviewSubmitting || newRating === 0}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md flex items-center justify-center"
              >
                {reviewSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  "Submit Review"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedCouponForReview(null);
                  setNewRating(0);
                  setReviewComment("");
                  setReviewError(null);
                }}
                className="px-5 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

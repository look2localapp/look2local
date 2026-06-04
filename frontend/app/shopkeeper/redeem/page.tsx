"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3, Package, Video, Settings, ShoppingBag, Store,
  QrCode, Camera, Loader2, AlertCircle, CheckCircle2,
  X, ArrowLeft, RefreshCw, Ticket, ShieldAlert, Award
} from "lucide-react";
import { BrowserQRCodeReader } from "@zxing/browser";

const SIDEBAR = [
  { href: "/shopkeeper/dashboard", icon: BarChart3, label: "Dashboard" },
  { href: "/shopkeeper/products", icon: Package, label: "Products" },
  { href: "/shopkeeper/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/shopkeeper/redeem", icon: QrCode, label: "Redeem Coupon", active: true },
  { href: "/shopkeeper/reels", icon: Video, label: "Reels" },
  { href: "/shopkeeper/analytics", icon: BarChart3, label: "Analytics" },
];

interface CouponDetails {
  id: string;
  code: string;
  status: string;
  redeemedAt: string | null;
  discountAmount: number;
  couponCost: number;
  productName: string;
  customerName: string;
}

export default function ShopkeeperRedeemPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<string | null>(null);
  const [redeemedCoupon, setRedeemedCoupon] = useState<CouponDetails | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/shopkeeper/stats");
        if (!res.ok) {
          router.push("/shopkeeper/login");
        } else {
          setAuthLoading(false);
        }
      } catch (err) {
        router.push("/shopkeeper/login");
      }
    }
    checkAuth();
  }, [router]);
  
  // Camera state
  const [cameraError, setCameraError] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<any>(null);

  // 1. Scan logic
  useEffect(() => {
    if (!scanning) {
      stopScanning();
      return;
    }

    setCameraError("");
    const codeReader = new BrowserQRCodeReader();

    codeReader.decodeFromVideoDevice(undefined, "qr-video", (result, err) => {
      if (result) {
        const text = result.getText();
        stopScanning();
        
        // Parse if JSON, otherwise use raw text
        try {
          const parsed = JSON.parse(text);
          if (parsed && parsed.code) {
            handleRedeem(parsed.code);
          } else {
            handleRedeem(text);
          }
        } catch {
          handleRedeem(text);
        }
      }
    })
    .then((controls) => {
      controlsRef.current = controls;
    })
    .catch((err) => {
      console.error("Camera access error:", err);
      setCameraError("Unable to access camera. Please check your browser permissions or enter code manually.");
      setScanning(false);
    });

    return () => {
      stopScanning();
    };
  }, [scanning]);

  const stopScanning = () => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
  };

  // 2. Submit Coupon code for verification and redemption
  const handleRedeem = async (codeToRedeem?: string) => {
    const finalCode = codeToRedeem || couponCode;
    if (!finalCode.trim()) {
      setError("Please enter a valid coupon code.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(null);
    setRedeemedCoupon(null);

    try {
      const res = await fetch("/api/coupons/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponCode: finalCode }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(data.message || "Coupon successfully redeemed!");
        setRedeemedCoupon(data.coupon);
        setCouponCode("");
      } else {
        setError(data.error || "Failed to redeem coupon.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-100 py-6 px-3 fixed top-16 bottom-0">
        {SIDEBAR.map(({ href, icon: Icon, label, active }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold mb-1 transition-colors ${active ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
            <Icon className="w-4 h-4 flex-shrink-0" /> {label}
          </Link>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-56 px-4 sm:px-6 py-8">
        <div className="max-w-xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/shopkeeper/dashboard" className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Verify & Redeem Coupon</h1>
              <p className="text-sm text-gray-500">Scan QR code or enter coupon code to mark as used</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Coupon Scan Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">
              {scanning ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Camera className="w-5 h-5 text-blue-600 animate-pulse" /> Scanning QR Code...
                    </h3>
                    <button onClick={() => setScanning(false)} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <div className="relative aspect-square max-w-[280px] mx-auto rounded-2xl overflow-hidden border-2 border-blue-500 bg-black">
                    <video id="qr-video" ref={videoRef} className="w-full h-full object-cover" />
                    <div className="absolute inset-4 border-2 border-dashed border-white/40 rounded-xl pointer-events-none animate-pulse" />
                  </div>
                  <p className="text-center text-xs text-gray-400">Position the customer&apos;s coupon QR code inside the frame.</p>
                </div>
              ) : (
                <div className="flex flex-col items-center py-4">
                  <button onClick={() => setScanning(true)}
                    className="w-20 h-20 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 shadow-sm flex items-center justify-center text-blue-600 transition-all hover:scale-105 group">
                    <QrCode className="w-10 h-10 group-hover:scale-110 transition-transform" />
                  </button>
                  <h3 className="font-bold text-gray-900 mt-4">Scan QR Code</h3>
                  <p className="text-sm text-gray-400 text-center mt-1">Click to open device camera and scan coupon QR</p>
                </div>
              )}

              {cameraError && (
                <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 font-medium">{cameraError}</p>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="h-[1px] bg-gray-100 flex-1" />
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">OR</span>
                <div className="h-[1px] bg-gray-100 flex-1" />
              </div>

              {/* Manual Input */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Enter Coupon Code Manually</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. L2L-AB123"
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm tracking-wider uppercase focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
                  />
                  <button
                    onClick={() => handleRedeem()}
                    disabled={loading || !couponCode.trim()}
                    className="px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-3xl p-5 shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                <ShieldAlert className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-red-900 text-sm">Verification Failed</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {/* Success Details Card */}
            {success && redeemedCoupon && (
              <div className="bg-white rounded-3xl border border-green-200 shadow-lg p-6 space-y-5 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                  <div className="w-12 h-12 bg-green-50 border border-green-100 rounded-2xl flex items-center justify-center text-green-600 shadow-sm animate-bounce">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-green-900 text-lg">{success}</h3>
                    <p className="text-xs text-green-600 font-semibold uppercase tracking-wider mt-0.5">One-Time Use Cleared ✓</p>
                  </div>
                </div>

                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between items-center bg-gray-50 px-4 py-3 rounded-xl">
                    <span className="text-gray-500 font-medium">Coupon Code</span>
                    <code className="font-mono font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg text-xs">{redeemedCoupon.code}</code>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-500 font-medium">Product</span>
                    <span className="font-bold text-gray-900 text-right max-w-[200px] line-clamp-2">{redeemedCoupon.productName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Customer</span>
                    <span className="font-bold text-gray-900">{redeemedCoupon.customerName}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                    <span className="text-gray-500 font-medium">Customer Saves</span>
                    <span className="text-lg font-black text-green-600 flex items-center gap-0.5">₹{redeemedCoupon.discountAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Customer Paid (L2L Platform)</span>
                    <span className="font-bold text-orange-600">₹{redeemedCoupon.couponCost.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="bg-green-50/50 border border-green-100 rounded-2xl p-4 flex gap-3">
                  <Award className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-green-800 leading-relaxed font-medium">
                    This coupon has been flagged as <strong>USED</strong> in the database and can never be scanned or redeemed again. Provide the discount of <strong>₹{redeemedCoupon.discountAmount}</strong> to the customer on their invoice.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSuccess(null);
                    setRedeemedCoupon(null);
                  }}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" /> Scan Another Coupon
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

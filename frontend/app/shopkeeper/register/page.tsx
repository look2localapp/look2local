"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Store, MapPin, FileText, Image as ImageIcon, CheckCircle2,
  ArrowRight, ArrowLeft, Upload, Clock, ShieldCheck, Loader2,
  XCircle, AlertCircle, Building2
} from "lucide-react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

const STEPS = [
  { num: 1, icon: Store, label: "Business Info" },
  { num: 2, icon: MapPin, label: "Location" },
  { num: 3, icon: Clock, label: "Hours" },
  { num: 4, icon: ImageIcon, label: "Photos" },
  { num: 5, icon: FileText, label: "Verify GST" },
];

type GSTState = "idle" | "checking" | "verified" | "failed" | "invalid_format";

interface GSTResult {
  businessName: string;
  gstStatus: string;
  stateCode: string;
  pan: string;
}

export default function ShopkeeperRegisterPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Step 5 — GST state
  const [gstNumber, setGstNumber] = useState("");
  const [gstState, setGstState] = useState<GSTState>("idle");
  const [gstResult, setGstResult] = useState<GSTResult | null>(null);
  const [password, setPassword] = useState("");

  // Auto-verify when 15 chars entered
  const verifyGST = useCallback(async (gst: string) => {
    setGstState("checking");
    setGstResult(null);
    try {
      const res = await fetch("/api/verify-gst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gstNumber: gst }),
      });
      const data = await res.json();
      if (data.success) {
        setGstState("verified");
        setGstResult({
          businessName: data.businessName,
          gstStatus: data.gstStatus,
          stateCode: data.stateCode,
          pan: data.pan,
        });
      } else {
        setGstState("failed");
      }
    } catch {
      setGstState("failed");
    }
  }, []);

  useEffect(() => {
    if (gstNumber.length === 15) {
      verifyGST(gstNumber);
    } else if (gstNumber.length > 0 && gstNumber.length < 15) {
      setGstState("idle");
      setGstResult(null);
    }
  }, [gstNumber, verifyGST]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length) setStep(step + 1);
    else {
      setSubmitting(true);
      setTimeout(() => router.push("/shopkeeper/dashboard"), 1500);
    }
  };

  const gstInputBorder =
    gstState === "verified" ? "border-green-400 focus:ring-green-100" :
    gstState === "failed" ? "border-red-400 focus:ring-red-100" :
    "border-gray-200 focus:ring-blue-100";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 py-10 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue-500/30">
            <Store className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Register Your Shop</h1>
          <p className="text-blue-300 text-sm mt-1">Join 2,000+ shops on Look2Local — It's Free</p>
        </div>

        {/* Step Bar */}
        <div className="flex items-center justify-between mb-8 relative px-2">
          <div className="absolute top-5 left-6 right-6 h-0.5 bg-white/10">
            <div className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }} />
          </div>
          {STEPS.map(({ num, icon: Icon, label }) => {
            const done = step > num;
            const active = step === num;
            return (
              <div key={num} className="flex flex-col items-center z-10 gap-1.5">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                  ${done ? "bg-blue-600 border-blue-600" : active ? "bg-white border-blue-500 shadow-md" : "bg-white/10 border-white/20"}`}>
                  {done
                    ? <CheckCircle2 className="w-5 h-5 text-white" />
                    : <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-white/40"}`} />}
                </div>
                <span className={`text-[10px] font-semibold hidden sm:block ${active ? "text-blue-300" : done ? "text-white/60" : "text-white/30"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleNext}>

            {/* ── Step 1: Business Info ── */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Business Information</h2>
                {[
                  { label: "Shop Name *", id: "shopName", type: "text", placeholder: "e.g. Tech Hub Electronics" },
                  { label: "Owner Name *", id: "ownerName", type: "text", placeholder: "Your full name" },
                  { label: "Business Phone *", id: "phone", type: "tel", placeholder: "+91 98765 43210" },
                  { label: "WhatsApp Number", id: "whatsapp", type: "tel", placeholder: "+91 98765 43210 (for customer queries)" },
                  { label: "Business Email *", id: "email", type: "email", placeholder: "shop@example.com" },
                ].map(({ label, id, type, placeholder }) => (
                  <div key={id}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{label}</label>
                    <input required={!label.includes("WhatsApp")} type={type} id={id} placeholder={placeholder}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Category *</label>
                  <select required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all">
                    <option value="">Select category</option>
                    {["Electronics & Gadgets", "Home & Furniture", "Clothing & Fashion", "Grocery & Supermarket",
                      "Beauty & Cosmetics", "Bakery & Cafe", "Footwear", "Pharmacy", "Apple Products", "Other"]
                      .map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* ── Step 2: Location ── */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Shop Location</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Address *</label>
                  <textarea required rows={3} placeholder="Shop no., Building, Street, Area…"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Landmark</label>
                  <input type="text" placeholder="e.g. Near GVK Mall, opposite HDFC Bank"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                    <input required type="text" placeholder="Hyderabad"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">PIN Code *</label>
                    <input required type="text" placeholder="500034"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" /> Google Maps Link *
                  </label>
                  <input required type="url" placeholder="https://maps.google.com/..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                  <p className="text-xs text-gray-400 mt-1">Customers will navigate directly to your store using this link</p>
                </div>
                <button type="button" className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 border-dashed text-blue-700 font-semibold py-3 rounded-xl transition-colors text-sm">
                  <MapPin className="w-4 h-4" /> Auto-detect my location via GPS
                </button>
              </div>
            )}

            {/* ── Step 3: Hours & Delivery ── */}
            {step === 3 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Hours & Delivery</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Opening Time *</label>
                    <input required type="time" defaultValue="10:00"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Closing Time *</label>
                    <input required type="time" defaultValue="21:00"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Open Days</label>
                  <div className="flex flex-wrap gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                      <label key={day} className="flex items-center gap-1.5 cursor-pointer bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 transition-colors">
                        <input type="checkbox" defaultChecked={day !== "Sun"} className="accent-blue-600" /> {day}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-0.5 w-4 h-4 accent-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Enable Home Delivery</p>
                      <p className="text-xs text-gray-500 mt-0.5">Customers can request delivery to their address</p>
                    </div>
                  </label>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Delivery Radius (km)</label>
                    <input type="number" defaultValue="5" min="1" max="50"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 4: Photos ── */}
            {step === 4 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Shop Photos</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Photos are uploaded directly to Cloudinary and stored permanently.
                </p>
                <ImageUpload
                  type="shop_image"
                  label="Shop Front Photo *"
                  hint="Main image shown on your listing card · JPG, PNG · Max 5MB"
                  aspectRatio="square"
                  onUpload={(url) => console.log("Shop image:", url)}
                />
                <ImageUpload
                  type="banner"
                  label="Shop Banner Photo *"
                  hint="Wide banner shown at top of your shop page · JPG, PNG · Max 5MB"
                  aspectRatio="banner"
                  onUpload={(url) => console.log("Banner:", url)}
                />
              </div>
            )}

            {/* ── Step 5: GST Verification ── */}
            {step === 5 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-gray-900 mb-1">GST Verification</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Enter your GST number — we'll verify it automatically with government records.
                  <span className="text-blue-600 font-medium"> Verified shops get 3× more visibility.</span>
                </p>

                {/* GST Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" /> GST Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value.toUpperCase().slice(0, 15))}
                      placeholder="37ABCDE1234F1Z5"
                      maxLength={15}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 transition-all pr-12 ${gstInputBorder}`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {gstState === "checking" && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                      {gstState === "verified" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      {gstState === "failed" && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <p className="text-xs text-gray-400">Auto-verifies at 15 characters</p>
                    <p className="text-xs text-gray-400 font-mono">{gstNumber.length}/15</p>
                  </div>
                </div>

                {/* Checking state */}
                {gstState === "checking" && (
                  <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 px-4 py-3 rounded-xl">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-800">Verifying with government records…</p>
                      <p className="text-xs text-blue-600">Checking GST database via Sandbox API</p>
                    </div>
                  </div>
                )}

                {/* Verified state */}
                {gstState === "verified" && gstResult && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <p className="text-sm font-bold text-green-800">✅ GST Verified — Eligible for Verified Badge</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-green-100">
                        <p className="text-xs text-gray-400 font-medium mb-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> Business Name
                        </p>
                        <p className="text-sm font-bold text-gray-900">{gstResult.businessName}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-100">
                        <p className="text-xs text-gray-400 font-medium mb-0.5">GST Status</p>
                        <p className={`text-sm font-bold ${gstResult.gstStatus === "Active" ? "text-green-600" : "text-orange-500"}`}>
                          {gstResult.gstStatus}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-100">
                        <p className="text-xs text-gray-400 font-medium mb-0.5">State Code</p>
                        <p className="text-sm font-bold text-gray-900">{gstResult.stateCode}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-100">
                        <p className="text-xs text-gray-400 font-medium mb-0.5">PAN</p>
                        <p className="text-sm font-bold font-mono text-gray-900">{gstResult.pan}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Failed state */}
                {gstState === "failed" && gstNumber.length === 15 && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-800">GST Number Not Found</p>
                      <p className="text-xs text-red-600 mt-0.5">This GST is not in government records. Double-check and try again.</p>
                    </div>
                  </div>
                )}

                {/* Skip GST note */}
                {gstState === "idle" && (
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 px-4 py-3 rounded-xl">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700">
                      GST is optional but verified shops appear higher in search results and get the <strong>Verified</strong> badge.
                    </p>
                  </div>
                )}

                {/* Password */}
                <div className="border-t border-gray-100 pt-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Create Password *</label>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>

                {/* Trust note */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-blue-800">100% Free to Join</p>
                    <p className="text-xs text-blue-600 mt-0.5">No commission. No subscription. Start selling for free.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <Link href="/shopkeeper/login"
                  className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  Cancel
                </Link>
              )}

              <button type="submit" disabled={submitting}
                className="flex items-center gap-2 px-7 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 rounded-xl transition-colors shadow-md shadow-blue-100 active:scale-[0.98]">
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Registering…</>
                ) : step === STEPS.length ? (
                  <><CheckCircle2 className="w-4 h-4" /> Complete Registration</>
                ) : (
                  <>Continue <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-blue-300/50 text-xs mt-4">
          Already registered?{" "}
          <Link href="/shopkeeper/login" className="text-blue-400 hover:text-white font-medium transition-colors">
            Sign In →
          </Link>
        </p>
      </div>
    </div>
  );
}

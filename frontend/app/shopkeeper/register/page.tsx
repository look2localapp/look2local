"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Store, MapPin, FileText, Image as ImageIcon, CheckCircle2,
  ArrowRight, ArrowLeft, Clock, ShieldCheck, Loader2,
  XCircle, AlertCircle, Building2, Award, AlertTriangle,
  Upload
} from "lucide-react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";
import Image from "next/image";

const STEPS = [
  { num: 1, icon: FileText, label: "Verify GST" },
  { num: 2, icon: Store, label: "Business Info" },
  { num: 3, icon: MapPin, label: "Location" },
  { num: 4, icon: Clock, label: "Hours" },
  { num: 5, icon: ImageIcon, label: "Photos" },
];

// success=true from API → always verified. Only error states are: invalid_format, failed, api_unavailable.
type GSTState = "idle" | "checking" | "verified" | "failed" | "invalid_format" | "api_unavailable";

interface GSTResult {
  gstNumber: string;
  businessName: string;   // legalName alias
  tradeName: string;
  legalName: string;
  taxType: string;        // taxPayerType e.g. "Regular"
  nature: string;         // natureOfBusiness
  businessType: string;   // natureOfBusiness (compat)
  gstStatus: string;
  state: string;
  district: string;
  pincode: string;
  principalAddress: string;
  lastFilingStatus: string;
  gstVerified: boolean;
  stateCode: string;
  pan: string;
  verificationDate: string;
}

export default function ShopkeeperRegisterPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  // Step 1: GST Verification State
  const [gstNumber, setGstNumber] = useState("");
  const [gstState, setGstState] = useState<GSTState>("idle");
  const [gstResult, setGstResult] = useState<GSTResult | null>(null);
  const [gstSkipped, setGstSkipped] = useState(false);

  // Form State for Auto-fill
  const [shopName, setShopName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [pin, setPin] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [mapLink, setMapLink] = useState("");
  const [password, setPassword] = useState("");
  const [detectingGPS, setDetectingGPS] = useState(false);
  const [shopImage, setShopImage] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [openingTime, setOpeningTime] = useState("10:00");
  const [closingTime, setClosingTime] = useState("21:00");
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const verifyGST = useCallback(async (gst: string) => {
    setGstState("checking");
    setGstResult(null);
    try {
      const res = await fetch("/api/gst/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gstNumber: gst }),
      });
      const data = await res.json();

      // ── Error handling ───────────────────────────────────────────────────
      if (!res.ok || !data.success) {
        if (data.invalidFormat) {
          setGstState("invalid_format");
        } else if (data.apiUnavailable) {
          setGstState("api_unavailable");
        } else {
          setGstState("failed");
        }
        return;
      }

      // ── SUCCESS: success=true from API always means GST is verified ──────
      // This API does NOT return inactive/cancelled status.
      setGstResult(data as GSTResult);
      setGstState("verified");

      // ── AUTO-FILL: State, District, Pincode ───────
      setAddress(data.principalAddress || "");
      setState(data.stateCode || "");
      setDistrict(data.district || "");
      setPin(data.pincode || "");

      // Smart category from nature
      const btype = (data.nature || "").toLowerCase();
      if (btype.includes("retail") && btype.includes("electron")) setCategory("Electronics & Gadgets");
      else if (btype.includes("motor") || btype.includes("vehicle") || btype.includes("auto")) setCategory("Other");
      else if (btype.includes("food") || btype.includes("bakery") || btype.includes("restaurant") || btype.includes("cafe")) setCategory("Bakery & Cafe");
      else if (btype.includes("cloth") || btype.includes("fashion") || btype.includes("garment") || btype.includes("textile")) setCategory("Clothing & Fashion");
      else if (btype.includes("grocery") || btype.includes("kirana") || btype.includes("supermarket")) setCategory("Grocery & Supermarket");
      else if (btype.includes("pharma") || btype.includes("medicine") || btype.includes("medical")) setCategory("Pharmacy");
      else if (btype.includes("footwear") || btype.includes("shoe")) setCategory("Footwear");
      else if (btype.includes("beauty") || btype.includes("cosmetic") || btype.includes("salon")) setCategory("Beauty & Cosmetics");

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

  // GST is optional. Only block Continue if format is invalid or still checking.
  const canProceedFromStep1 = (): boolean => {
    if (gstNumber.length === 0) return true;           // no GST entered — optional
    if (gstState === "verified") return true;           // verified ✅
    if (gstState === "api_unavailable") return true;   // allow manual fallback
    if (gstState === "idle") return true;               // still typing
    if (gstState === "checking") return false;          // wait for API
    return false;                                       // invalid_format | failed
  };

  const handleGPSDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetectingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapLink(`https://maps.google.com/?q=${lat},${lng}`);
        setDetectingGPS(false);
      },
      () => {
        alert("Unable to retrieve your location. Please check your browser permissions.");
        setDetectingGPS(false);
      }
    );
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    if (step < STEPS.length) {
      setStep(step + 1);
    } else {
      // Final step — save to database
      setSubmitting(true);
      try {
        const res = await fetch("/api/shops/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shop_name: shopName,
            owner_name: ownerName,
            phone,
            whatsapp,
            email,
            password,
            category,
            address,
            landmark,
            google_map_link: mapLink,
            city,
            pin,
            opening_time: openingTime,
            closing_time: closingTime,
            delivery_available: deliveryAvailable,
            shop_image: shopImage,
            banner_image: bannerImage,
            gst_number: gstNumber || null,
            gst_verified: gstState === "verified",
            business_name: gstResult?.legalName || null,
            gst_status: "Active",
            legal_name: gstResult?.legalName || null,
            trade_name: gstResult?.tradeName || null,
            tax_type: gstResult?.taxType || null,
            business_type: gstResult?.nature || null,
            principal_address: gstResult?.principalAddress || null,
            state: gstResult?.stateCode || state || null,
            district: gstResult?.district || district || null,
            pincode: gstResult?.pincode || pin || null,
            last_filing_status: gstResult?.lastFilingStatus || null,
            verification_date: gstResult?.verificationDate || null,
          }),
        });
        const data = await res.json();
        if (data.success) {
          router.push("/shopkeeper/dashboard");
        } else {
          setSubmitError(data.message || "Registration failed. Please try again.");
          setSubmitting(false);
        }
      } catch {
        setSubmitError("Network error. Please try again.");
        setSubmitting(false);
      }
    }
  };

  const gstInputBorder =
    gstState === "verified" ? "border-green-400 focus:ring-green-100" :
    gstState === "failed" || gstState === "invalid_format" ? "border-red-400 focus:ring-red-100" :
    "border-gray-200 focus:ring-blue-100";

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 py-10 px-4">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <Image src="/look2local_logo.png" alt="Look2Local" width={80} height={80} className="w-20 h-20 rounded-2xl mx-auto shadow-lg shadow-blue-500/30 object-contain bg-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Register Your Shop</h1>
          <p className="text-blue-300 text-sm mt-1">Join 2,000+ shops on Look2Local — It&apos;s Free</p>
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

            {/* ── Step 1: Verify GST ── */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Step 1: GST Verification</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Enter your GST number to instantly fetch and auto-fill your shop details.
                  <span className="text-blue-600 font-medium"> Verified shops get a 🏆 Trust Badge and 3× more visibility.</span>
                </p>

                {/* GST Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" /> GST Number
                    <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      id="gst-input"
                      type="text"
                      value={gstNumber}
                      onChange={(e) => {
                        setGstNumber(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15));
                      }}
                      placeholder="e.g. 27AAAAA0000A1Z5"
                      maxLength={15}
                      className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-mono tracking-widest uppercase focus:outline-none focus:ring-2 transition-all pr-12 ${gstInputBorder}`}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {gstState === "checking" && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
                      {gstState === "verified" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                      {(gstState === "failed" || gstState === "invalid_format") && <XCircle className="w-5 h-5 text-red-500" />}
                      {gstState === "api_unavailable" && <AlertCircle className="w-5 h-5 text-amber-500" />}
                    </div>
                  </div>
                  <div className="flex justify-between mt-1.5">
                    <p className="text-xs text-gray-400">Auto-verifies at 15 characters</p>
                    <p className="text-xs text-gray-400 font-mono">{gstNumber.length}/15</p>
                  </div>
                </div>

                {/* Invalid Format */}
                {gstState === "invalid_format" && (
                  <div className="flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3 rounded-xl">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-800">❌ Invalid GST Format</p>
                      <p className="text-xs text-red-600 mt-0.5">GST must be exactly 15 characters. Example: 27AAAAA0000A1Z5</p>
                    </div>
                  </div>
                )}

                {/* Checking */}
                {gstState === "checking" && (
                  <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 px-4 py-3 rounded-xl">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-800">Verifying with government records…</p>
                      <p className="text-xs text-blue-600">Checking GST database securely</p>
                    </div>
                  </div>
                )}

                {/* ✅ Verified */}
                {gstState === "verified" && gstResult && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Award className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <p className="text-sm font-bold text-green-800">✅ GST Verified</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white rounded-lg p-3 border border-green-100 col-span-2">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3" /> Business Name
                        </p>
                        <p className="text-sm font-bold text-gray-900">{gstResult.legalName}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-100 col-span-2">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Business Type</p>
                        <p className="text-xs font-bold text-gray-900">{gstResult.nature || "—"}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-100">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">Registration Type</p>
                        <p className="text-sm font-bold text-gray-900">{gstResult.taxType || "—"}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-green-100">
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">State</p>
                        <p className="text-sm font-bold text-gray-900">{gstResult.stateCode || "—"}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2 bg-green-100 rounded-lg px-3 py-2">
                      <Award className="w-4 h-4 text-green-700 flex-shrink-0" />
                      <p className="text-xs font-semibold text-green-800">🏆 GST VERIFIED SHOP assigned</p>
                    </div>
                  </div>
                )}


                {/* API Unavailable — allow manual fallback */}
                {gstState === "api_unavailable" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-amber-800">Unable to verify GST right now</p>
                        <p className="text-xs text-amber-700 mt-1">
                          Please upload your GST Certificate for manual review. Admin will approve your shop after verification.
                        </p>
                        <div className="mt-3 border-2 border-dashed border-amber-300 rounded-lg p-4 flex flex-col items-center bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer">
                          <Upload className="w-5 h-5 text-amber-600 mb-1" />
                          <span className="text-xs font-semibold text-amber-700">Upload GST Certificate</span>
                          <span className="text-[10px] text-amber-600 mt-0.5">PDF or JPG, up to 5MB</span>
                        </div>
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
                      <p className="text-xs text-red-600 mt-0.5">This GST is not in government records. Check the number and try again, or skip GST verification.</p>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-5 mt-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Create Look2Local Password *</label>
                  <p className="text-xs text-gray-500 mb-2">Password must be at least 8 characters long.</p>
                  <input
                    required
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                </div>
              </div>
            )}

            {/* ── Step 2: Business Info ── */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Business Information</h2>
                  {gstState === "verified" && (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200">
                      ✅ Auto-filled via GST
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Shop Name (Trade Name) *</label>
                  <input required type="text" value={shopName} onChange={e => setShopName(e.target.value)} placeholder="e.g. Tech Hub Electronics"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Legal / Business Name</label>
                  <input type="text" value={gstResult?.legalName || ""} readOnly={!!gstResult?.legalName} placeholder="Auto-filled from GST"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Owner Name *</label>
                  <input required type="text" value={ownerName} onChange={e => setOwnerName(e.target.value)} placeholder="Your full name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Phone *</label>
                  <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">WhatsApp Number</label>
                  <input type="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Email *</label>
                  <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="shop@example.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                    Business Category *
                    {gstState === "verified" && category && (
                      <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">Suggested by GST</span>
                    )}
                  </label>
                  <select required value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all">
                    <option value="">Select category</option>
                    {["Electronics & Gadgets", "Home & Furniture", "Clothing & Fashion", "Grocery & Supermarket",
                      "Beauty & Cosmetics", "Bakery & Cafe", "Footwear", "Pharmacy", "Apple Products", "Other"]
                      .map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            )}

            {/* ── Step 3: Location ── */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Shop Location</h2>
                  {gstState === "verified" && (
                    <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-md border border-green-200">
                      ✅ Auto-filled via GST
                    </span>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Address (Shop no., Building, Street, Area) *</label>
                  <textarea required rows={3} value={address} onChange={e => setAddress(e.target.value)} placeholder="Shop no., Building, Street, Area…"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                    <input required type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Vijayawada"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">State *</label>
                    <input required type="text" value={state} onChange={e => setState(e.target.value)} placeholder="e.g. Andhra Pradesh"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">PIN Code *</label>
                    <input required type="text" value={pin} onChange={e => setPin(e.target.value)} placeholder="e.g. 520001"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" /> Google Maps Link *
                  </label>
                  <input required type="url" value={mapLink} onChange={e => setMapLink(e.target.value)} placeholder="https://maps.google.com/..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                  <p className="text-xs text-gray-400 mt-1">Customers will navigate directly to your store using this link</p>
                </div>
                <button
                  type="button"
                  onClick={handleGPSDetect}
                  disabled={detectingGPS}
                  className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 border-dashed text-blue-700 font-semibold py-3 rounded-xl transition-colors text-sm disabled:opacity-50"
                >
                  {detectingGPS ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Detecting Location…</>
                  ) : (
                    <><MapPin className="w-4 h-4" /> Auto-detect my location via GPS</>
                  )}
                </button>
              </div>
            )}

            {/* ── Step 4: Hours & Delivery ── */}
            {step === 4 && (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Hours & Delivery</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Opening Time *</label>
                    <input required type="time" value={openingTime} onChange={e => setOpeningTime(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Closing Time *</label>
                    <input required type="time" value={closingTime} onChange={e => setClosingTime(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <input type="checkbox" id="delivery" checked={deliveryAvailable} onChange={e => setDeliveryAvailable(e.target.checked)}
                    className="w-4 h-4 accent-blue-600 rounded" />
                  <label htmlFor="delivery" className="text-sm font-medium text-gray-700">Offer home delivery</label>
                </div>
              </div>
            )}

            {/* ── Step 5: Photos ── */}
            {step === 5 && (
              <div className="space-y-5">
                <h2 className="text-lg font-bold text-gray-900 mb-1">Shop Photos</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Photos are uploaded directly to Cloudinary and stored permanently.
                </p>
                <ImageUpload
                  type="shop_image"
                  label="Shop Front Photo *"
                  hint="Main image shown on your listing card"
                  aspectRatio="square"
                  onUpload={(url) => setShopImage(url)}
                />
                <ImageUpload
                  type="banner"
                  label="Shop Banner Photo *"
                  hint="Wide banner shown at top of your shop page"
                  aspectRatio="banner"
                  onUpload={(url) => setBannerImage(url)}
                />
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

              <button
                type="submit"
                disabled={submitting || (step === 1 && !canProceedFromStep1())}
                className="flex items-center gap-2 px-7 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-md shadow-blue-100 active:scale-[0.98]"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Registering…</>
                ) : step === STEPS.length ? (
                  <><CheckCircle2 className="w-4 h-4" /> Complete Registration</>
                ) : step === 1 && gstState === "checking" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Verifying…</>
                ) : (
                  <>Continue <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>

          {/* Submit error */}
          {submitError && (
            <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <p className="text-sm text-red-700 font-medium">{submitError}</p>
            </div>
          )}
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

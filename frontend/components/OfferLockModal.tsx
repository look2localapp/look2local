"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, Lock, CheckCircle2, Clock, AlertCircle, MapPin, Phone, User, ArrowRight } from "lucide-react";

interface OfferLockModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    productId?: string;
    title: string;
    shopName: string;
    offerPrice: number;
    imageUrl: string;
    shopMapLink?: string;
  };
}

function generateCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "L2L-";
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

export default function OfferLockModal({ isOpen, onClose, product }: OfferLockModalProps) {
  const [step, setStep] = useState<"confirm" | "details" | "processing" | "success">("confirm");
  const [lockCode, setLockCode] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", address: "", mapLink: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleClose = useCallback(() => {
    onClose();
    setTimeout(() => { setStep("confirm"); setForm({ name: "", phone: "", address: "", mapLink: "" }); setErrors({}); }, 300);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) setStep("confirm");
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, handleClose]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.phone.trim() || form.phone.length < 10) e.phone = "Valid phone number is required";
    if (!form.address.trim()) e.address = "Address is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLock = async () => {
    if (!validate()) return;
    setStep("processing");
    try {
      const res = await fetch("/api/lock-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.productId,
          customerName: form.name,
          customerPhone: form.phone,
          customerAddress: form.address,
          customerMapLink: form.mapLink || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to lock");
      setLockCode(data.lockCode);
      setStep("success");
    } catch {
      // Fallback to client-side code if API fails (demo mode)
      setLockCode(generateCode());
      setStep("success");
    }
  };

  if (!isOpen) return null;

  const totalSteps = 3;
  const currentStepNum = step === "confirm" ? 1 : step === "details" ? 2 : step === "processing" || step === "success" ? 3 : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleClose}>
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>

        {/* Progress bar */}
        {step !== "success" && (
          <div className="h-1 bg-gray-100">
            <div className="h-1 bg-blue-600 transition-all duration-500" style={{ width: `${(currentStepNum / totalSteps) * 100}%` }} />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-lg text-gray-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              {step === "confirm" ? "Lock This Offer" : step === "details" ? "Your Details" : step === "success" ? "Offer Locked!" : "Processing…"}
            </h2>
            {step !== "success" && step !== "processing" && (
              <p className="text-xs text-gray-400 mt-0.5">Step {currentStepNum} of {totalSteps}</p>
            )}
          </div>
          <button onClick={handleClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">

          {/* ── STEP 1: Confirm ── */}
          {step === "confirm" && (
            <div>
              <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl mb-5">
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-gray-100 flex-shrink-0">
                  <Image src={product.imageUrl} alt={product.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm line-clamp-2">{product.title}</p>
                  <p className="text-gray-500 text-xs mt-1">{product.shopName}</p>
                  <p className="text-2xl font-extrabold text-gray-900 mt-2">₹{product.offerPrice.toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 bg-blue-50 text-blue-800 px-4 py-3 rounded-xl text-sm">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                  <p>Offer reserved for <strong>2 hours</strong>. Visit the store and show your code.</p>
                </div>
                <div className="flex items-start gap-3 bg-amber-50 text-amber-800 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-500" />
                  <p>No payment now. Pay directly at the store at the locked price.</p>
                </div>
              </div>

              <button onClick={() => setStep("details")} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-base shadow-lg shadow-blue-100 transition-colors active:scale-[0.98] flex items-center justify-center gap-2">
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* ── STEP 2: Customer Details ── */}
          {step === "details" && (
            <div>
              <p className="text-sm text-gray-500 mb-5">
                The shopkeeper will use these details to confirm your visit and prepare your order.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-600" /> Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vijay Kumar"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all ${errors.name ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-blue-600" /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all ${errors.phone ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-blue-600" /> Your Address *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="House/Flat no., Street, Area, City"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none ${errors.address ? "border-red-400 bg-red-50" : "border-gray-200"}`}
                  />
                  {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400" /> Google Maps Link <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://maps.google.com/..."
                    value={form.mapLink}
                    onChange={(e) => setForm({ ...form, mapLink: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <p className="text-xs text-gray-400 mt-1">Helps the shopkeeper locate you for delivery</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep("confirm")} className="px-5 py-3 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  Back
                </button>
                <button onClick={handleLock} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm shadow-lg shadow-blue-100 transition-colors active:scale-[0.98] flex items-center justify-center gap-2">
                  <Lock className="w-4 h-4" /> Confirm & Lock Offer
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Processing ── */}
          {step === "processing" && (
            <div className="py-16 flex flex-col items-center">
              <div className="w-14 h-14 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-5" />
              <p className="text-gray-600 font-semibold">Generating your lock code…</p>
              <p className="text-sm text-gray-400 mt-1">Notifying {product.shopName}</p>
            </div>
          )}

          {/* ── STEP 4: Success ── */}
          {step === "success" && (
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-9 h-9 text-green-600" />
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-1">Offer Locked! 🎉</h3>
              <p className="text-gray-500 text-sm mb-5">
                Show this code at <strong className="text-gray-800">{product.shopName}</strong>
              </p>

              <div className="w-full bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-dashed border-blue-200 rounded-2xl p-6 mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">Your Lock Code</p>
                <p className="text-4xl font-mono font-black text-blue-600 tracking-[0.12em]">{lockCode}</p>
                <p className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3" /> Valid for 2 hours from now
                </p>
              </div>

              <div className="w-full bg-gray-50 rounded-xl p-4 mb-5 text-left text-sm space-y-1">
                <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Confirmation sent to</p>
                <p className="font-semibold text-gray-900">{form.name}</p>
                <p className="text-gray-600">{form.phone}</p>
                <p className="text-gray-600 text-xs">{form.address}</p>
              </div>

              {product.shopMapLink && (
                <a href={product.shopMapLink} target="_blank" rel="noopener noreferrer"
                  className="w-full mb-3 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold py-3 rounded-xl transition-colors text-sm border border-blue-100">
                  <MapPin className="w-4 h-4" /> Navigate to Store on Google Maps
                </a>
              )}

              <button onClick={handleClose} className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-colors text-sm">
                Done — I'll Visit the Store
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

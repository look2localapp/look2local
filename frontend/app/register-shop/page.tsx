"use client";

import { useState } from "react";
import { Store, MapPin, FileText, CheckCircle2, ArrowRight, Upload, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STEPS = [
  { num: 1, icon: Store, label: "Business Info" },
  { num: 2, icon: MapPin, label: "Location" },
  { num: 3, icon: FileText, label: "Verification" },
];

export default function RegisterShopPage() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setSubmitting(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto">

        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-100">
            <Store className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">List Your Shop</h1>
          <p className="text-gray-500 mt-2">Join 2,000+ local businesses on Look2Local</p>
        </div>

        {/* Stepper */}
        <div className="relative flex justify-between mb-10 px-4">
          <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
          {STEPS.map(({ num, icon: Icon, label }) => {
            const done = step > num;
            const active = step === num;
            return (
              <div key={num} className="flex flex-col items-center relative z-10 gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  done ? "bg-blue-600 border-blue-600" : active ? "bg-white border-blue-600 shadow-md shadow-blue-100" : "bg-white border-gray-200"
                }`}>
                  {done ? <CheckCircle2 className="w-5 h-5 text-white" /> : <Icon className={`w-4 h-4 ${active ? "text-blue-600" : "text-gray-400"}`} />}
                </div>
                <span className={`text-xs font-semibold ${active ? "text-blue-600" : done ? "text-gray-600" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <form onSubmit={handleNext}>

            {step === 1 && (
              <div className="space-y-5">
                <h2 className="font-bold text-gray-900 text-lg mb-1">Business Information</h2>
                <p className="text-sm text-gray-500 mb-5">Tell us about your shop</p>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Shop Name *</label>
                  <input required type="text" placeholder="e.g. Urban Furniture Studio" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Category *</label>
                  <select required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all">
                    <option value="">Select a category</option>
                    <option>Electronics & Gadgets</option>
                    <option>Home & Furniture</option>
                    <option>Clothing & Fashion</option>
                    <option>Grocery & Supermarket</option>
                    <option>Beauty & Cosmetics</option>
                    <option>Bakery & Cafe</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Business Phone *</label>
                  <input required type="tel" placeholder="+91 98765 43210" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address *</label>
                  <input required type="email" placeholder="shop@example.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h2 className="font-bold text-gray-900 text-lg mb-1">Shop Location</h2>
                <p className="text-sm text-gray-500 mb-5">Help customers find you</p>

                <button type="button" className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 border-dashed text-blue-700 font-semibold py-4 rounded-xl transition-colors text-sm">
                  <MapPin className="w-4 h-4" /> Auto-detect my location
                </button>
                <div className="relative flex items-center my-2">
                  <div className="flex-grow border-t border-gray-200" />
                  <span className="mx-3 text-xs text-gray-400 font-medium">OR enter manually</span>
                  <div className="flex-grow border-t border-gray-200" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Address *</label>
                  <textarea required rows={3} placeholder="Shop no., Building, Street, Area…" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">City *</label>
                    <input required type="text" placeholder="Hyderabad" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">PIN Code *</label>
                    <input required type="text" placeholder="500034" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <h2 className="font-bold text-gray-900 text-lg mb-1">Verification Documents</h2>
                <p className="text-sm text-gray-500 mb-5">Verified shops get 3× more visibility</p>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">GST Number</label>
                  <input type="text" placeholder="22AAAAA0000A1Z5" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all" />
                  <p className="text-xs text-gray-400 mt-1">Optional — adds verified badge to your shop</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Shop Front Photo</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 group-hover:-translate-y-1 transition-transform">
                      <Upload className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-sm text-gray-700">Click to upload photo</span>
                    <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">Free to join</p>
                    <p className="text-xs text-green-700 mt-0.5">No commission. No subscription fee. Start for free.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              {step > 1 ? (
                <button type="button" onClick={() => setStep(step - 1)} className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  Back
                </button>
              ) : (
                <Link href="/" className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  Cancel
                </Link>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-7 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 rounded-xl transition-colors shadow-md shadow-blue-100 active:scale-[0.98]"
              >
                {submitting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Registering…</>
                ) : step === 3 ? (
                  <>Complete Registration <CheckCircle2 className="w-4 h-4" /></>
                ) : (
                  <>Continue <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

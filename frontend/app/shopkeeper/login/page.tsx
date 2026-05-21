"use client";

import Link from "next/link";
import { useState } from "react";
import { Store, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";

export default function ShopkeeperLoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { window.location.href = "/shopkeeper/dashboard"; }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/30">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Shopkeeper Portal</h1>
          <p className="text-blue-300 mt-2 text-sm">Manage your store, offers, and orders</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Sign in to your store</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                placeholder="shopkeeper@example.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all pr-12"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <button type="button" className="text-xs text-blue-600 font-semibold hover:underline">Forgot password?</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-blue-100 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative text-center"><span className="px-3 bg-white text-xs text-gray-400">New to Look2Local?</span></div>
          </div>

          <Link href="/shopkeeper/register" className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">
            Register Your Shop
          </Link>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
            <span>Secure login. Your data is encrypted.</span>
          </div>
        </div>

        <p className="text-center text-blue-300/60 text-xs mt-4">
          Are you a customer?{" "}
          <Link href="/login" className="text-blue-400 hover:text-white font-medium transition-colors">
            Customer Login →
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ArrowRight, ShoppingBag } from "lucide-react";

export default function CustomerLoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { window.location.href = "/"; }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-blue-200 mt-2">Sign in to discover local deals</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone or Email</label>
              <input required type="text" placeholder="+91 98765 43210 or email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input required type={showPass ? "text" : "password"} placeholder="••••••••" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all pr-12" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 p-1">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-blue-100 transition-colors flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative text-center"><span className="px-3 bg-white text-xs text-gray-400">New here?</span></div>
          </div>

          <button className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl text-sm transition-colors">
            Create Customer Account
          </button>

          <p className="text-center text-xs text-gray-400 mt-5">
            Are you a shopkeeper?{" "}
            <Link href="/shopkeeper/login" className="text-blue-600 font-semibold hover:underline">Shopkeeper Portal →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

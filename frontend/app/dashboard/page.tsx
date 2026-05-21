"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlusCircle, Package, Settings, BarChart3, Store,
  TrendingUp, Eye, Lock, ShoppingBag, Video, ArrowUpRight
} from "lucide-react";

const RECENT_LOCKS = [
  { product: "Sony PlayStation 5", customer: "Ravi K.", code: "X7A9M2", amount: 44990, expiresIn: "1h 15m" },
  { product: "DualSense Controller", customer: "Priya S.", code: "B3Q8N1", amount: 5200, expiresIn: "42m" },
  { product: "AirPods Pro (2nd Gen)", customer: "Arjun M.", code: "K5R2P7", amount: 21500, expiresIn: "2h 58m" },
];

const STATS = [
  { label: "Active Offers", value: "12", change: "+2 this week", icon: Lock, color: "blue" },
  { label: "Locked Offers", value: "48", change: "8 pending visits", icon: ShoppingBag, color: "orange" },
  { label: "Total Views", value: "1.2K", change: "+15% vs last week", icon: Eye, color: "green" },
  { label: "Revenue (est.)", value: "₹3.2L", change: "This month", icon: TrendingUp, color: "purple" },
];

const COLOR_MAP: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  orange: "bg-orange-50 text-orange-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
};

const NAV_ITEMS = [
  { icon: BarChart3, label: "Overview", href: "/dashboard", active: true },
  { icon: Package, label: "Products", href: "/dashboard/products" },
  { icon: Video, label: "Reels", href: "/dashboard/reels" },
  { icon: Settings, label: "Settings", href: "/dashboard" },
];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">

      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 hidden md:flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Tech Hub Electronics</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-md">
                ✓ Verified
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map(({ icon: Icon, label, href, active }) => (
            <Link
              key={label}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <Link href="/register-shop" className="flex items-center gap-2 text-sm text-blue-600 font-semibold hover:bg-blue-50 px-3 py-2.5 rounded-xl transition-colors">
            <PlusCircle className="w-4 h-4" /> Add New Shop
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here's your store at a glance.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/dashboard/products" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
              <Package className="w-4 h-4" /> Manage Products
            </Link>
            <Link href="/dashboard/reels" className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-100">
              <PlusCircle className="w-4 h-4" /> Create Offer
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map(({ label, value, change, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${COLOR_MAP[color]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
              <p className="text-2xl font-extrabold text-gray-900">{value}</p>
              <p className="text-xs text-green-600 font-medium mt-1">{change}</p>
            </div>
          ))}
        </div>

        {/* Recent Locks */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900">Recent Offer Locks</h2>
            <button className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_LOCKS.map((lock) => (
              <div key={lock.code} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-mono font-bold text-xs">
                    {lock.code}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{lock.product}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{lock.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 text-sm">₹{lock.amount.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-orange-600 font-semibold mt-0.5">⏱ {lock.expiresIn} left</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: "/dashboard/products", icon: Package, title: "Product Management", desc: "Add, edit, and set discounts on your products", color: "text-blue-600 bg-blue-50" },
            { href: "/dashboard/reels", icon: Video, title: "Upload Reels", desc: "Create short videos to showcase your products", color: "text-purple-600 bg-purple-50" },
            { href: "/shops/1", icon: Eye, title: "View My Shop", desc: "See how customers see your shop listing", color: "text-green-600 bg-green-50" },
          ].map(({ href, icon: Icon, title, desc, color }) => (
            <Link key={href} href={href} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">{title}</h3>
              <p className="text-xs text-gray-500">{desc}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { BarChart3, Package, Video, Settings, ShoppingBag, Store, TrendingUp, Eye, Users, Lock, ArrowUpRight } from "lucide-react";

const NAV = [
  { icon: BarChart3, label: "Overview", href: "/shopkeeper/dashboard" },
  { icon: Package, label: "Products", href: "/shopkeeper/products" },
  { icon: Video, label: "Reels", href: "/dashboard/reels" },
  { icon: ShoppingBag, label: "Orders", href: "/shopkeeper/orders" },
  { icon: BarChart3, label: "Analytics", href: "/shopkeeper/analytics", active: true },
  { icon: Settings, label: "Settings", href: "/shopkeeper/dashboard" },
];

const WEEKLY = [42, 58, 35, 70, 90, 65, 88];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MAX = Math.max(...WEEKLY);

export default function ShopkeeperAnalyticsPage() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Store className="w-5 h-5 text-white" /></div>
            <div><p className="font-bold text-sm">Tech Hub Electronics</p><span className="text-[11px] text-green-400">✓ Verified</span></div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}>
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500">Track your shop's performance and customer engagement</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Views", value: "1,248", change: "+15.2%", icon: Eye, color: "bg-blue-50 text-blue-600" },
            { label: "Offer Locks", value: "48", change: "+8.3%", icon: Lock, color: "bg-orange-50 text-orange-600" },
            { label: "Unique Visitors", value: "312", change: "+21.6%", icon: Users, color: "bg-purple-50 text-purple-600" },
            { label: "Conversion", value: "15.4%", change: "+2.1%", icon: TrendingUp, color: "bg-green-50 text-green-600" },
          ].map(({ label, value, change, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className="text-2xl font-extrabold text-gray-900">{value}</p>
              <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> {change} vs last week
              </p>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900">Views This Week</h2>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full">May 5 – May 11</span>
          </div>
          <div className="flex items-end justify-between gap-2 h-40">
            {WEEKLY.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-500 font-semibold">{val}</span>
                <div className="w-full bg-blue-50 rounded-lg overflow-hidden">
                  <div
                    className="bg-blue-600 rounded-lg transition-all duration-700 w-full"
                    style={{ height: `${(val / MAX) * 96}px` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400">{DAYS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900">Top Locked Products</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { title: "Sony PlayStation 5", locks: 18, views: 342, conversion: "5.3%" },
              { title: "Apple AirPods Pro", locks: 14, views: 285, conversion: "4.9%" },
              { title: "iPhone 16 Pro Max", locks: 10, views: 198, conversion: "5.1%" },
              { title: "Samsung 65\" 4K TV", locks: 6, views: 143, conversion: "4.2%" },
            ].map(({ title, locks, views, conversion }) => (
              <div key={title} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{views} views · {locks} locks</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{conversion}</p>
                  <p className="text-xs text-gray-400">conversion</p>
                </div>
                <div className="ml-4 w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: conversion }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

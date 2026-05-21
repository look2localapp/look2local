"use client";

import Link from "next/link";
import Image from "next/image";
import {
  BarChart3, Package, Video, Settings, Store,
  TrendingUp, Eye, Lock, ShoppingBag, PlusCircle,
  Bell, MapPin, ArrowUpRight, Truck, Clock
} from "lucide-react";

const STATS = [
  { label: "Active Offers", value: "12", sub: "+2 this week", icon: Lock, color: "bg-blue-50 text-blue-600" },
  { label: "Locked Offers", value: "48", sub: "8 pending visits", icon: ShoppingBag, color: "bg-orange-50 text-orange-600" },
  { label: "Total Views", value: "1.2K", sub: "+15% vs last week", icon: Eye, color: "bg-green-50 text-green-600" },
  { label: "Delivery Orders", value: "6", sub: "3 confirmed", icon: Truck, color: "bg-purple-50 text-purple-600" },
];

const RECENT_LOCKS = [
  { product: "Sony PlayStation 5", customer: "Vijay K.", phone: "98765 43210", code: "L2L-X7A9M", amount: 44990, expiresIn: "1h 15m", type: "Store Visit" },
  { product: "Apple AirPods Pro", customer: "Priya S.", phone: "90123 45678", code: "L2L-B3Q8N", amount: 21500, expiresIn: "42m", type: "Delivery" },
  { product: "Samsung 4K TV", customer: "Arjun M.", phone: "87654 32109", code: "L2L-K5R2P", amount: 49900, expiresIn: "2h 58m", type: "Store Visit" },
];

const NAV = [
  { icon: BarChart3, label: "Overview", href: "/shopkeeper/dashboard", active: true },
  { icon: Package, label: "Products", href: "/shopkeeper/products" },
  { icon: Video, label: "Reels", href: "/shopkeeper/reels" },
  { icon: ShoppingBag, label: "Orders", href: "/shopkeeper/orders" },
  { icon: BarChart3, label: "Analytics", href: "/shopkeeper/analytics" },
  { icon: Settings, label: "Settings", href: "/shopkeeper/dashboard" },
];

export default function ShopkeeperDashboard() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm text-white">Tech Hub Electronics</p>
              <span className="text-[11px] font-semibold text-green-400 flex items-center gap-1">✓ Verified Seller</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400">
            <MapPin className="w-3 h-3" /> Banjara Hills, Hyderabad
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}>
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href="/shops/1" className="flex items-center gap-2 text-sm text-gray-400 hover:text-white px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors">
            <Eye className="w-4 h-4" /> View My Shop
          </Link>
          <Link href="/shopkeeper/login" className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors">
            → Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-extrabold text-gray-900">Dashboard</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> Today, {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <Link href="/shopkeeper/products" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
              <PlusCircle className="w-4 h-4" /> Add Product
            </Link>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {STATS.map(({ label, value, sub, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{value}</p>
                <p className="text-xs text-green-600 font-medium mt-1">{sub}</p>
              </div>
            ))}
          </div>

          {/* Recent Locks */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-50">
              <h2 className="font-bold text-gray-900">Recent Offer Locks</h2>
              <Link href="/shopkeeper/orders" className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:underline">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-400 uppercase font-semibold bg-gray-50/50 border-b border-gray-50">
                    <th className="px-6 py-3 text-left">Customer</th>
                    <th className="px-6 py-3 text-left">Product</th>
                    <th className="px-6 py-3 text-left">Code</th>
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">Amount</th>
                    <th className="px-6 py-3 text-left">Expires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {RECENT_LOCKS.map((lock) => (
                    <tr key={lock.code} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 text-sm">{lock.customer}</p>
                        <p className="text-xs text-gray-400">{lock.phone}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-[160px] truncate">{lock.product}</td>
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg text-xs">{lock.code}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${lock.type === "Delivery" ? "bg-purple-50 text-purple-700" : "bg-green-50 text-green-700"}`}>
                          {lock.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900 text-sm">₹{lock.amount.toLocaleString("en-IN")}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-orange-600 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {lock.expiresIn}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/shopkeeper/products", icon: Package, title: "Add Products", desc: "List new products and set offer prices", color: "bg-blue-50 text-blue-600" },
              { href: "/shopkeeper/reels", icon: Video, title: "Upload Reels", desc: "Create short videos for your products", color: "bg-purple-50 text-purple-600" },
              { href: "/shopkeeper/analytics", icon: TrendingUp, title: "View Analytics", desc: "See views, clicks, and conversion data", color: "bg-green-50 text-green-600" },
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
        </div>
      </main>
    </div>
  );
}

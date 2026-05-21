"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlusCircle, Search, Edit2, Trash2, Package,
  BarChart3, Settings, Video, Store, ArrowLeft
} from "lucide-react";

const PRODUCTS = [
  { id: "1", title: "Sony PlayStation 5 Disc Edition", price: 49990, offerPrice: 44990, stock: 12, status: "Active", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=200&auto=format&fit=crop" },
  { id: "2", title: "DualSense Wireless Controller", price: 5990, offerPrice: 5200, stock: 45, status: "Active", image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=200&auto=format&fit=crop" },
  { id: "3", title: "Logitech G Pro X Superlight", price: 12995, offerPrice: 12995, stock: 0, status: "Out of Stock", image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=200&auto=format&fit=crop" },
  { id: "4", title: "Apple AirPods Pro (2nd Gen)", price: 24900, offerPrice: 21500, stock: 8, status: "Active", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=200&auto=format&fit=crop" },
];

const NAV = [
  { icon: BarChart3, label: "Overview", href: "/dashboard" },
  { icon: Package, label: "Products", href: "/dashboard/products", active: true },
  { icon: Video, label: "Reels", href: "/dashboard/reels" },
  { icon: Settings, label: "Settings", href: "/dashboard" },
];

export default function DashboardProductsPage() {
  const [query, setQuery] = useState("");
  const filtered = PRODUCTS.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()));

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
              <span className="text-[11px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-md">✓ Verified</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}>
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Products & Offers</h1>
            <p className="text-sm text-gray-500">Manage inventory and set flash discounts</p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search products…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 bg-white"
            />
          </div>
          <div className="flex gap-2 ml-auto">
            <select className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-600 outline-none focus:border-blue-400">
              <option>All Status</option>
              <option>Active</option>
              <option>Out of Stock</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm shadow-blue-100">
              <PlusCircle className="w-4 h-4" /> Add Product
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Offer Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden relative flex-shrink-0">
                          <Image src={p.image} alt={p.title} fill className="object-cover" />
                        </div>
                        <span className="font-semibold text-gray-900 text-sm line-clamp-2 max-w-[200px]">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 line-through">₹{p.price.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">₹{p.offerPrice.toLocaleString("en-IN")}</span>
                      {p.price !== p.offerPrice && (
                        <span className="ml-2 text-xs text-green-600 font-semibold">
                          {Math.round(((p.price - p.offerPrice) / p.price) * 100)}% off
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${p.stock === 0 ? "text-red-500" : p.stock < 10 ? "text-amber-600" : "text-gray-900"}`}>
                        {p.stock === 0 ? "Out of stock" : `${p.stock} units`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        p.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">No products found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BarChart3, Package, Video, Settings, Store, ShoppingBag,
  Clock, CheckCircle2, XCircle, Eye, Phone, MapPin, ArrowLeft,
  Filter, Search, TrendingUp
} from "lucide-react";
import dynamic from "next/dynamic";

const CountdownTimer = dynamic(() => import("@/components/CountdownTimer"), { ssr: false });

const SIDEBAR = [
  { href: "/shopkeeper/dashboard", icon: BarChart3, label: "Dashboard" },
  { href: "/shopkeeper/products", icon: Package, label: "Products" },
  { href: "/shopkeeper/orders", icon: ShoppingBag, label: "Orders", active: true },
  { href: "/shopkeeper/reels", icon: Video, label: "Reels" },
  { href: "/shopkeeper/analytics", icon: TrendingUp, label: "Analytics" },
];

type OrderStatus = "LOCKED" | "REDEEMED" | "EXPIRED" | "CANCELLED";

const ORDERS = [
  {
    id: "o1", lockCode: "L2L-DEMO1", status: "LOCKED" as OrderStatus,
    customer: "Vijay Kumar", phone: "+91 98765 00001",
    address: "Flat 4B, Sunshine Apts, Madhapur",
    product: "Sony PlayStation 5 Disc Edition", price: 44990,
    lockedAt: "2026-05-11T08:00:00Z",
    expiresAt: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
  },
  {
    id: "o2", lockCode: "L2L-X7KPQ", status: "REDEEMED" as OrderStatus,
    customer: "Priya Sharma", phone: "+91 98765 00002",
    address: "302, Lake View Apts, Banjara Hills",
    product: "Apple AirPods Pro (2nd Gen)", price: 21500,
    lockedAt: "2026-05-10T14:00:00Z",
    expiresAt: "2026-05-10T16:00:00Z",
  },
  {
    id: "o3", lockCode: "L2L-M3NZP", status: "EXPIRED" as OrderStatus,
    customer: "Ravi Teja", phone: "+91 87654 33333",
    address: "Villa 5, HITEC City",
    product: "iPhone 16 Pro Max 256GB", price: 129900,
    lockedAt: "2026-05-09T10:00:00Z",
    expiresAt: "2026-05-09T12:00:00Z",
  },
  {
    id: "o4", lockCode: "L2L-YQWRT", status: "LOCKED" as OrderStatus,
    customer: "Anjali Rao", phone: "+91 76543 44444",
    address: "12-3, SR Nagar, Hyderabad",
    product: "Samsung 65\" 4K Smart TV", price: 69990,
    lockedAt: "2026-05-11T09:30:00Z",
    expiresAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
  },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string; icon: typeof CheckCircle2 }> = {
  LOCKED: { label: "Awaiting Visit", bg: "bg-blue-50 border-blue-100", text: "text-blue-700", icon: Clock },
  REDEEMED: { label: "Redeemed ✓", bg: "bg-green-50 border-green-100", text: "text-green-700", icon: CheckCircle2 },
  EXPIRED: { label: "Expired", bg: "bg-gray-50 border-gray-100", text: "text-gray-500", icon: XCircle },
  CANCELLED: { label: "Cancelled", bg: "bg-red-50 border-red-100", text: "text-red-600", icon: XCircle },
};

export default function OrdersPage() {
  const [filter, setFilter] = useState<"ALL" | OrderStatus>("ALL");
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState(ORDERS);

  const filtered = orders.filter(o => {
    const matchStatus = filter === "ALL" || o.status === filter;
    const matchSearch = o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.lockCode.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const redeem = (id: string) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: "REDEEMED" as OrderStatus } : o));

  const counts = {
    ALL: orders.length,
    LOCKED: orders.filter(o => o.status === "LOCKED").length,
    REDEEMED: orders.filter(o => o.status === "REDEEMED").length,
    EXPIRED: orders.filter(o => o.status === "EXPIRED").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-gray-100 py-6 px-3 fixed top-16 bottom-0">
        {SIDEBAR.map(({ href, icon: Icon, label, active }) => (
          <Link key={href} href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold mb-1 transition-colors ${active ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
            <Icon className="w-4 h-4 flex-shrink-0" /> {label}
          </Link>
        ))}
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-56 px-4 sm:px-6 py-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link href="/shopkeeper/dashboard" className="p-2 hover:bg-gray-100 rounded-xl transition-colors lg:hidden">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Locked Offers</h1>
              <p className="text-sm text-gray-500">Customers who locked prices at your shop</p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Active Locks", val: counts.LOCKED, color: "blue" },
              { label: "Redeemed", val: counts.REDEEMED, color: "green" },
              { label: "Expired", val: counts.EXPIRED, color: "gray" },
            ].map(({ label, val, color }) => (
              <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 text-center shadow-sm">
                <p className={`text-2xl font-extrabold ${color === "blue" ? "text-blue-600" : color === "green" ? "text-green-600" : "text-gray-400"}`}>{val}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Filters + Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex gap-2 overflow-x-auto">
              {(["ALL", "LOCKED", "REDEEMED", "EXPIRED"] as const).map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${filter === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>
                  {s} ({counts[s] ?? orders.length})
                </button>
              ))}
            </div>
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, code or product…"
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400" />
            </div>
          </div>

          {/* Orders list */}
          <div className="space-y-4">
            {filtered.map(order => {
              const cfg = STATUS_CONFIG[order.status];
              const StatusIcon = cfg.icon;
              return (
                <div key={order.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${order.status === "LOCKED" ? "border-blue-100" : "border-gray-100"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Top row */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg text-sm tracking-wide">
                          {order.lockCode}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${cfg.bg} ${cfg.text}`}>
                          <StatusIcon className="w-3 h-3" /> {cfg.label}
                        </span>
                      </div>

                      {/* Product */}
                      <p className="font-bold text-gray-900 mb-2">{order.product}</p>
                      <p className="text-lg font-extrabold text-blue-600 mb-3">₹{order.price.toLocaleString("en-IN")}</p>

                      {/* Customer info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5"><Store className="w-3.5 h-3.5 text-blue-400" /> {order.customer}</span>
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-green-400" /><a href={`tel:${order.phone}`} className="text-blue-600 hover:underline">{order.phone}</a></span>
                        <span className="flex items-center gap-1.5 sm:col-span-2"><MapPin className="w-3.5 h-3.5 text-red-400" /> {order.address}</span>
                        <span className="flex items-center gap-1.5 sm:col-span-2"><Clock className="w-3.5 h-3.5 text-gray-400" />
                          Locked: {new Date(order.lockedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                      </div>
                    </div>

                    {/* Right side — countdown + action */}
                    <div className="flex flex-col gap-3 sm:w-56 flex-shrink-0">
                      {order.status === "LOCKED" && (
                        <>
                          <CountdownTimer expiresAt={order.expiresAt} lockCode={order.lockCode} />
                          <button onClick={() => redeem(order.id)}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm shadow-green-100">
                            <CheckCircle2 className="w-4 h-4" /> Mark as Redeemed
                          </button>
                        </>
                      )}
                      {order.status === "REDEEMED" && (
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                          <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-1" />
                          <p className="text-sm font-bold text-green-700">Redeemed</p>
                          <p className="text-xs text-green-500">Offer was successfully used</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <ShoppingBag className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="font-semibold text-gray-500">No orders found</p>
                <p className="text-sm text-gray-400">Try a different filter or search term</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

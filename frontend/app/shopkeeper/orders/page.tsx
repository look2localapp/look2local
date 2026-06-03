"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3, Package, Video, Settings, ShoppingBag,
  Clock, CheckCircle2, XCircle, Phone, MapPin, ArrowLeft,
  Filter, Search, QrCode, Ticket, ShieldAlert, Loader2, Store
} from "lucide-react";
import dynamic from "next/dynamic";

const CountdownTimer = dynamic(() => import("@/components/CountdownTimer"), { ssr: false });

const SIDEBAR = [
  { href: "/shopkeeper/dashboard", icon: BarChart3, label: "Dashboard" },
  { href: "/shopkeeper/products", icon: Package, label: "Products" },
  { href: "/shopkeeper/orders", icon: ShoppingBag, label: "Orders", active: true },
  { href: "/shopkeeper/redeem", icon: QrCode, label: "Redeem Coupon" },
  { href: "/shopkeeper/reels", icon: Video, label: "Reels" },
  { href: "/shopkeeper/analytics", icon: BarChart3, label: "Analytics" },
];

type OrderType = "LOCK" | "COUPON";
type OrderStatus = "LOCKED" | "ACTIVE" | "REDEEMED" | "EXPIRED" | "CANCELLED";

interface OrderItem {
  id: string;
  code: string;
  type: OrderType;
  status: OrderStatus;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  productName: string;
  price: number;
  createdAt: string;
  expiresAt: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string; icon: any }> = {
  LOCKED: { label: "Awaiting Visit", bg: "bg-blue-50 border-blue-100", text: "text-blue-700", icon: Clock },
  ACTIVE: { label: "Coupon Active", bg: "bg-purple-50 border-purple-100", text: "text-purple-700", icon: Ticket },
  REDEEMED: { label: "Redeemed ✓", bg: "bg-green-50 border-green-100", text: "text-green-700", icon: CheckCircle2 },
  EXPIRED: { label: "Expired", bg: "bg-gray-50 border-gray-100", text: "text-gray-500", icon: XCircle },
  CANCELLED: { label: "Cancelled", bg: "bg-red-50 border-red-100", text: "text-red-600", icon: XCircle },
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "LOCK" | "COUPON" | "REDEEMED">("ALL");
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/shopkeeper/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      } else if (res.status === 401) {
        router.push("/shopkeeper/login");
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRedeemLock = async (lockId: string) => {
    try {
      const res = await fetch("/api/shopkeeper/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lockId })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Offer locked price successfully redeemed!");
        fetchOrders();
      } else {
        alert(data.error || "Failed to redeem offer.");
      }
    } catch {
      alert("Network error.");
    }
  };

  const filtered = orders.filter(o => {
    // Type/Status filters
    let matchFilter = true;
    if (filter === "LOCK") matchFilter = o.type === "LOCK";
    else if (filter === "COUPON") matchFilter = o.type === "COUPON";
    else if (filter === "REDEEMED") matchFilter = o.status === "REDEEMED";

    // Search query match
    const matchSearch =
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.code.toLowerCase().includes(search.toLowerCase()) ||
      o.productName.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  const counts = {
    ALL: orders.length,
    LOCK: orders.filter(o => o.type === "LOCK").length,
    COUPON: orders.filter(o => o.type === "COUPON").length,
    REDEEMED: orders.filter(o => o.status === "REDEEMED").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Loading orders & coupons...</p>
          </div>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-extrabold text-gray-900">Visits & Coupons</h1>
              <p className="text-sm text-gray-500">Track and redeem locked prices and coupons for your shop</p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {[
              { label: "All Activity", val: counts.ALL, color: "text-gray-600 bg-white" },
              { label: "Locked Offers", val: counts.LOCK, color: "text-blue-600 bg-white" },
              { label: "Coupons", val: counts.COUPON, color: "text-purple-600 bg-white" },
              { label: "Total Redeemed", val: counts.REDEEMED, color: "text-green-600 bg-white" },
            ].map(({ label, val, color }) => (
              <div key={label} className={`rounded-2xl border border-gray-100 p-4 text-center shadow-sm ${color}`}>
                <p className="text-2xl font-extrabold">{val}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Filters + Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <div className="flex gap-2 overflow-x-auto">
              {(["ALL", "LOCK", "COUPON", "REDEEMED"] as const).map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${filter === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>
                  {s === "ALL" ? "All Activity" : s === "LOCK" ? "Locked Offers" : s === "COUPON" ? "Coupons" : "Redeemed"} ({counts[s]})
                </button>
              ))}
            </div>
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by customer name, code or product…"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400" />
            </div>
          </div>

          {/* Orders list */}
          <div className="space-y-4">
            {filtered.map(order => {
              const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.EXPIRED;
              const StatusIcon = cfg.icon;
              return (
                <div key={order.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${order.status === "LOCKED" || order.status === "ACTIVE" ? "border-blue-100" : "border-gray-100"}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Top row */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`font-mono font-bold px-2.5 py-1 rounded-lg text-sm tracking-wide ${order.type === "COUPON" ? "text-purple-700 bg-purple-50" : "text-blue-700 bg-blue-50"}`}>
                          {order.code}
                        </span>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${cfg.bg} ${cfg.text}`}>
                          <StatusIcon className="w-3 h-3" /> {cfg.label}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase ${order.type === "COUPON" ? "bg-purple-100 text-purple-800" : "bg-blue-100 text-blue-800"}`}>
                          {order.type === "COUPON" ? "Coupon" : "Locked Offer"}
                        </span>
                      </div>

                      {/* Product */}
                      <h3 className="font-bold text-gray-900 mb-2">{order.productName}</h3>
                      <p className="text-lg font-extrabold text-blue-600 mb-3">
                        Effective Price: ₹{order.price.toLocaleString("en-IN")}
                      </p>

                      {/* Customer info */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1.5"><Store className="w-3.5 h-3.5 text-blue-400" /> {order.customerName}</span>
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-green-400" /><a href={`tel:${order.customerPhone}`} className="text-blue-600 hover:underline">{order.customerPhone}</a></span>
                        <span className="flex items-center gap-1.5 sm:col-span-2"><MapPin className="w-3.5 h-3.5 text-red-400" /> {order.customerAddress}</span>
                        <span className="flex items-center gap-1.5 sm:col-span-2"><Clock className="w-3.5 h-3.5 text-gray-400" />
                          Created: {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                      </div>
                    </div>

                    {/* Right side — actions */}
                    <div className="flex flex-col gap-3 sm:w-56 flex-shrink-0">
                      {order.type === "LOCK" && order.status === "LOCKED" && (
                        <>
                          <CountdownTimer expiresAt={order.expiresAt} lockCode={order.code} />
                          <button onClick={() => handleRedeemLock(order.id)}
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm shadow-green-100">
                            <CheckCircle2 className="w-4 h-4" /> Mark as Visited
                          </button>
                        </>
                      )}
                      
                      {order.type === "COUPON" && order.status === "ACTIVE" && (
                        <button onClick={() => router.push("/shopkeeper/redeem")}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm shadow-purple-100">
                          <QrCode className="w-4 h-4" /> Redeem via Scanner
                        </button>
                      )}

                      {order.status === "REDEEMED" && (
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                          <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-1" />
                          <p className="text-sm font-bold text-green-700">Redeemed</p>
                          <p className="text-xs text-green-500">Transaction completed successfully</p>
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
                <p className="font-semibold text-gray-500">No activity found</p>
                <p className="text-sm text-gray-400">Try a different filter or search term</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

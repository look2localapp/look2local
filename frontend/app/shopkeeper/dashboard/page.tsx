"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3, Package, Video, Settings, Store,
  Eye, Lock, ShoppingBag, PlusCircle,
  Bell, MapPin, ArrowUpRight, Truck, Clock,
  AlertTriangle, Trash2, X, QrCode, CheckCircle2, Ticket, Loader2
} from "lucide-react";

const NAV = [
  { icon: BarChart3, label: "Overview", href: "/shopkeeper/dashboard", active: true },
  { icon: Package, label: "Products", href: "/shopkeeper/products" },
  { icon: ShoppingBag, label: "Orders", href: "/shopkeeper/orders" },
  { icon: QrCode, label: "Redeem Coupon", href: "/shopkeeper/redeem" },
  { icon: Video, label: "Reels", href: "/shopkeeper/reels" },
  { icon: BarChart3, label: "Analytics", href: "/shopkeeper/analytics" },
];

interface StatsData {
  activeProducts: number;
  lockedOffersCount: number;
  redeemedCouponsCount: number;
  totalViews: number;
}

interface LockItem {
  id: string;
  product: string;
  customer: string;
  phone: string;
  code: string;
  amount: number;
  expiresIn: string;
  status: string;
}

export default function ShopkeeperDashboard() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const router = useRouter();
  
  // Dynamic DB states
  const [shopName, setShopName] = useState("My Shop");
  const [verified, setVerified] = useState(false);
  const [address, setAddress] = useState("");
  const [stats, setStats] = useState<StatsData>({
    activeProducts: 0,
    lockedOffersCount: 0,
    redeemedCouponsCount: 0,
    totalViews: 0,
  });
  const [recentLocks, setRecentLocks] = useState<LockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/shopkeeper/stats");
        if (res.ok) {
          const data = await res.json();
          setShopName(data.shopName || "My Shop");
          setVerified(data.verified || false);
          setAddress(data.address || "");
          setStats(data.stats);
          setRecentLocks(data.recentLocks);
        } else if (res.status === 401) {
          router.push("/shopkeeper/login");
        }
      } catch (err) {
        console.error("Dashboard stats load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [router]);

  const handleDeleteShop = () => {
    // Simulate shop deletion and logout
    router.push("/shopkeeper/login");
  };

  const statCards = [
    { label: "Active Offers", value: stats.activeProducts, sub: "Listed in shop", icon: Lock, color: "bg-blue-50 text-blue-600" },
    { label: "Locked Offers", value: stats.lockedOffersCount, sub: "Awaiting visits", icon: ShoppingBag, color: "bg-orange-50 text-orange-600" },
    { label: "Coupon Redemptions", value: stats.redeemedCouponsCount, sub: "Used in store", icon: Ticket, color: "bg-green-50 text-green-600" },
    { label: "Total Views", value: stats.totalViews.toLocaleString("en-IN"), sub: "Profile & Reels", icon: Eye, color: "bg-purple-50 text-purple-600" },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm text-white truncate">{shopName}</p>
              <span className={`text-[11px] font-semibold flex items-center gap-1 ${verified ? "text-green-400" : "text-amber-400"}`}>
                {verified ? "✓ Verified Seller" : "Pending Verification"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-400 truncate">
            <MapPin className="w-3 h-3 flex-shrink-0" /> {address || "Hyderabad"}
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
            <Link href="/shopkeeper/redeem" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl transition-colors shadow-sm shadow-green-100">
              <QrCode className="w-4 h-4" /> Redeem Coupon
            </Link>
            <Link href="/shopkeeper/products" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
              <PlusCircle className="w-4 h-4" /> Add Product
            </Link>
          </div>
        </div>

        <div className="p-6 lg:p-8">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statCards.map(({ label, value, sub, icon: Icon, color }) => (
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
              <h2 className="font-bold text-gray-900">Recent Customer Activity</h2>
              <Link href="/shopkeeper/orders" className="text-sm text-blue-600 font-semibold flex items-center gap-1 hover:underline">
                View All <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              {recentLocks.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400 font-semibold">No recent customer activity</p>
                </div>
              ) : (
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
                    {recentLocks.map((lock) => (
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
                          <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-green-50 text-green-700">
                            Store Visit
                          </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900 text-sm">₹{lock.amount.toLocaleString("en-IN")}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold flex items-center gap-1 ${lock.status === "LOCKED" ? "text-orange-600" : "text-gray-400"}`}>
                            <Clock className="w-3 h-3" /> {lock.status === "LOCKED" ? lock.expiresIn : lock.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { href: "/shopkeeper/products", icon: Package, title: "Add Products", desc: "List new products and set offer prices", color: "bg-blue-50 text-blue-600" },
              { href: "/shopkeeper/redeem", icon: QrCode, title: "Redeem Coupon", desc: "Scan or enter customer coupons", color: "bg-green-50 text-green-600" },
              { href: "/shopkeeper/analytics", icon: BarChart3, title: "View Analytics", desc: "See views, clicks, and conversion data", color: "bg-purple-50 text-purple-600" },
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

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-5 border border-red-200 shadow-sm">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-xl font-extrabold text-gray-900 mb-2">Delete Shop?</h2>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. All your data, products, and offers will be permanently erased.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteShop}
                className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-red-200"
              >
                Yes, Delete Shop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

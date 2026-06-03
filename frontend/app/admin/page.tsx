"use client";

import { useEffect, useState } from "react";
import {
  Store, Users, Ticket, CreditCard, Package,
  TrendingUp, CheckCircle2, IndianRupee, Sparkles, Clock
} from "lucide-react";

interface Stats {
  totalShops: number;
  verifiedShops: number;
  pendingShops: number;
  totalCustomers: number;
  totalProducts: number;
  totalCoupons: number;
  activeCoupons: number;
  totalRevenue: number;
  activeSubscriptions: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!stats) return null;

  const cards = [
    { icon: Store, label: "Total Shops", value: stats.totalShops, sub: `${stats.verifiedShops} verified`, bg: "bg-blue-500/10", iconColor: "text-blue-400" },
    { icon: Clock, label: "Pending Approval", value: stats.pendingShops, sub: "Awaiting review", bg: "bg-orange-500/10", iconColor: "text-orange-400" },
    { icon: Users, label: "Customers", value: stats.totalCustomers, sub: "Registered users", bg: "bg-purple-500/10", iconColor: "text-purple-400" },
    { icon: Package, label: "Total Products", value: stats.totalProducts, sub: "Listed products", bg: "bg-teal-500/10", iconColor: "text-teal-400" },
    { icon: Ticket, label: "Total Coupons", value: stats.totalCoupons, sub: `${stats.activeCoupons} active`, bg: "bg-pink-500/10", iconColor: "text-pink-400" },
    { icon: Sparkles, label: "Subscriptions", value: stats.activeSubscriptions, sub: "Standard plan", bg: "bg-violet-500/10", iconColor: "text-violet-400" },
    { icon: IndianRupee, label: "Total Revenue", value: `₹${stats.totalRevenue.toLocaleString("en-IN")}`, sub: "All time", bg: "bg-green-500/10", iconColor: "text-green-400" },
    { icon: TrendingUp, label: "Verified Rate", value: `${Math.round((stats.verifiedShops / (stats.totalShops || 1)) * 100)}%`, sub: "Shops verified", bg: "bg-cyan-500/10", iconColor: "text-cyan-400" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white mb-1">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm">Look2Local platform overview</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ icon: Icon, label, value, sub, bg, iconColor }) => (
          <div key={label} className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${bg}`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <p className="text-xs text-gray-400 font-medium mb-1">{label}</p>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-xs text-gray-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Shop Approval Rate", value: `${Math.round((stats.verifiedShops / (stats.totalShops || 1)) * 100)}%`, icon: CheckCircle2, color: "text-green-400" },
          { label: "Coupon Activity", value: `${stats.activeCoupons} active`, icon: Ticket, color: "text-purple-400" },
          { label: "Subscription Revenue", value: `₹${(stats.activeSubscriptions * 150).toLocaleString("en-IN")}/mo`, icon: CreditCard, color: "text-blue-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-gray-900 rounded-2xl border border-gray-800 p-5 flex items-center gap-4">
            <Icon className={`w-8 h-8 ${color} flex-shrink-0`} />
            <div>
              <p className="text-xs text-gray-400">{label}</p>
              <p className="text-lg font-black text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

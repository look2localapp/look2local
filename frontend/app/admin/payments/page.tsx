"use client";

import { useEffect, useState } from "react";
import { CreditCard, CheckCircle2, XCircle, Clock, Search, IndianRupee } from "lucide-react";

interface Payment {
  id: string;
  type: string;
  amount: number;
  status: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  description?: string;
  createdAt: string;
  subscription?: { shop: { shop_name: string } };
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetch("/api/admin/payments").then((r) => r.json()).then((d) => {
      const p = d.payments || [];
      setPayments(p);
      setTotalRevenue(p.filter((x: Payment) => x.status === "SUCCESS").reduce((s: number, x: Payment) => s + x.amount, 0));
      setLoading(false);
    });
  }, []);

  const filtered = payments.filter(
    (p) =>
      (p.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.razorpayPaymentId || "").toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase())
  );

  const statusConfig = {
    SUCCESS: { icon: CheckCircle2, color: "text-green-400", bg: "bg-green-500/10" },
    PENDING: { icon: Clock, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    FAILED: { icon: XCircle, color: "text-red-400", bg: "bg-red-500/10" },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Payments</h1>
          <p className="text-gray-400 text-sm">Total Revenue: ₹{totalRevenue.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl px-4 py-2.5 flex items-center gap-2">
          <IndianRupee className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-black">₹{totalRevenue.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search payments…"
          className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 uppercase font-semibold border-b border-gray-800">
                <th className="px-5 py-3.5 text-left">Type</th>
                <th className="px-5 py-3.5 text-left">Description</th>
                <th className="px-5 py-3.5 text-left">Amount</th>
                <th className="px-5 py-3.5 text-left">Status</th>
                <th className="px-5 py-3.5 text-left">Payment ID</th>
                <th className="px-5 py-3.5 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((p) => {
                const cfg = statusConfig[p.status as keyof typeof statusConfig] || statusConfig.PENDING;
                const StatusIcon = cfg.icon;
                return (
                  <tr key={p.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${p.type === "SUBSCRIPTION" ? "bg-purple-500/10 text-purple-400" : "bg-orange-500/10 text-orange-400"}`}>
                        {p.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-gray-300">{p.description || "—"}</p>
                      {p.subscription?.shop && <p className="text-xs text-gray-500">{p.subscription.shop.shop_name}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-bold text-white text-sm">₹{p.amount.toLocaleString("en-IN")}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg w-fit ${cfg.bg} ${cfg.color}`}>
                        <StatusIcon className="w-3 h-3" /> {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <code className="text-xs text-gray-400 font-mono">{p.razorpayPaymentId?.slice(0, 16) || "—"}</code>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleDateString("en-IN")}</p>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center">
                  <CreditCard className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No payments found</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

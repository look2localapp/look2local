"use client";

import { useState } from "react";
import {
  ShieldCheck, XCircle, Clock, CheckCircle2, AlertTriangle,
  Store, Phone, MapPin, FileText, Search, Filter, Eye, BarChart3,
  Users, ShoppingBag, TrendingUp
} from "lucide-react";

const PENDING_SHOPS = [
  {
    id: "s1", name: "Vijaya Electronics", owner: "Ravi Kumar", phone: "+91 98765 11111",
    category: "Electronics & Gadgets", address: "MG Road, Vijayawada, AP",
    gst: "37AABCV1234F1Z5", gstVerified: true, submittedAt: "2026-05-11T04:00:00Z",
    image: "https://images.unsplash.com/photo-1550009158-9effb619a6c4?q=80&w=200",
  },
  {
    id: "s2", name: "Fashion Street Boutique", owner: "Priya Reddy", phone: "+91 87654 22222",
    category: "Clothing & Fashion", address: "Benz Circle, Vijayawada",
    gst: "", gstVerified: false, submittedAt: "2026-05-10T18:30:00Z",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=200",
  },
  {
    id: "s3", name: "Green Grocers", owner: "Suresh Babu", phone: "+91 76543 33333",
    category: "Grocery & Supermarket", address: "Labbipet, Vijayawada",
    gst: "37ABCGS5678H1Z2", gstVerified: true, submittedAt: "2026-05-10T09:15:00Z",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=200",
  },
];

const STATS = [
  { label: "Total Shops", value: "147", icon: Store, color: "blue", change: "+12 this week" },
  { label: "Pending Review", value: "3", icon: Clock, color: "amber", change: "Needs action" },
  { label: "Active Users", value: "2,841", icon: Users, color: "green", change: "+128 today" },
  { label: "Locked Offers", value: "394", icon: ShoppingBag, color: "purple", change: "+47 today" },
];

type Status = "approved" | "rejected" | null;

export default function AdminPage() {
  const [decisions, setDecisions] = useState<Record<string, Status>>({});
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [search, setSearch] = useState("");

  const decide = (id: string, status: Status) =>
    setDecisions(prev => ({ ...prev, [id]: status }));

  const filtered = PENDING_SHOPS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.owner.toLowerCase().includes(search.toLowerCase());
    if (activeTab === "pending") return !decisions[s.id] && matchSearch;
    return decisions[s.id] === activeTab && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-blue-500/30 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold">Admin Panel</h1>
          </div>
          <p className="text-blue-200 text-sm ml-13">Look2Local Platform Management</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map(({ label, value, icon: Icon, color, change }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3
                ${color === "blue" ? "bg-blue-50" : color === "amber" ? "bg-amber-50" : color === "green" ? "bg-green-50" : "bg-purple-50"}`}>
                <Icon className={`w-5 h-5 ${color === "blue" ? "text-blue-600" : color === "amber" ? "text-amber-600" : color === "green" ? "text-green-600" : "text-purple-600"}`} />
              </div>
              <p className="text-2xl font-extrabold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              <p className={`text-xs font-semibold mt-1 ${color === "amber" ? "text-amber-600" : "text-green-600"}`}>{change}</p>
            </div>
          ))}
        </div>

        {/* Shop Verification Section */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-extrabold text-gray-900 text-lg mb-4">Shop Verification Queue</h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-4">
              {(["pending", "approved", "rejected"] as const).map((tab) => {
                const count = tab === "pending"
                  ? PENDING_SHOPS.filter(s => !decisions[s.id]).length
                  : PENDING_SHOPS.filter(s => decisions[s.id] === tab).length;
                return (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all flex items-center gap-2 ${activeTab === tab
                      ? tab === "pending" ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : tab === "approved" ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {tab}
                    <span className="bg-white px-1.5 py-0.5 rounded-md text-xs font-bold">{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search shops…" className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <CheckCircle2 className="w-10 h-10 text-green-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-500">No shops in this category</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map(shop => {
                const status = decisions[shop.id];
                return (
                  <div key={shop.id} className="p-6">
                    <div className="flex items-start gap-5">
                      {/* Shop image */}
                      <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bold text-gray-900">{shop.name}</h3>
                          {shop.gstVerified
                            ? <span className="text-xs bg-green-100 text-green-700 border border-green-200 font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> GST Verified</span>
                            : <span className="text-xs bg-amber-100 text-amber-700 border border-amber-200 font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> No GST</span>}
                          {status === "approved" && <span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-lg">✅ Approved</span>}
                          {status === "rejected" && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-lg">❌ Rejected</span>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-gray-500 mb-3">
                          <span className="flex items-center gap-1.5"><Store className="w-3.5 h-3.5 text-blue-400" /> {shop.owner}</span>
                          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-green-400" /> {shop.phone}</span>
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-red-400" /> {shop.address}</span>
                          <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-purple-400" /> {shop.category}</span>
                          {shop.gst && <span className="flex items-center gap-1.5 font-mono col-span-2"><ShieldCheck className="w-3.5 h-3.5 text-teal-400" /> {shop.gst}</span>}
                        </div>

                        <p className="text-xs text-gray-400">
                          Submitted: {new Date(shop.submittedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                        </p>
                      </div>

                      {/* Action buttons — only show if not decided */}
                      {!status && (
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <button onClick={() => decide(shop.id, "approved")}
                            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-green-100">
                            <CheckCircle2 className="w-4 h-4" /> Approve
                          </button>
                          <button onClick={() => decide(shop.id, "rejected")}
                            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
                            <XCircle className="w-4 h-4" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

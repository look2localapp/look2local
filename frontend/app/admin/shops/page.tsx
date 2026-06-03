"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Store, CheckCircle2, XCircle, ShieldCheck, Star,
  MapPin, Package, Search, SlidersHorizontal
} from "lucide-react";

interface Shop {
  id: string;
  shop_name: string;
  owner_name: string;
  phone: string;
  address: string;
  category: string;
  shop_image: string;
  verified: boolean;
  gst_verified: boolean;
  featured: boolean;
  gst_number?: string;
  createdAt: string;
  shopkeeper: { email: string };
  subscription?: { plan: string; status: string };
  _count: { products: number };
}

export default function AdminShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "verified" | "unverified">("all");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchShops();
  }, [filter]);

  const fetchShops = async () => {
    setLoading(true);
    const q = filter !== "all" ? `?status=${filter}` : "";
    const res = await fetch(`/api/admin/shops${q}`);
    const data = await res.json();
    setShops(data.shops || []);
    setLoading(false);
  };

  const doAction = async (shopId: string, action: string, extra?: Record<string, unknown>) => {
    setActionLoading(`${shopId}-${action}`);
    await fetch("/api/admin/shops", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ shopId, action, ...extra }),
    });
    await fetchShops();
    setActionLoading(null);
  };

  const filtered = shops.filter(
    (s) =>
      s.shop_name.toLowerCase().includes(search.toLowerCase()) ||
      s.owner_name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-black text-white">Shop Management</h1>
          <p className="text-gray-400 text-sm">{shops.length} shops total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search shops…"
            className="w-full pl-11 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-sm text-white placeholder:text-gray-500 outline-none focus:border-blue-500 transition-all" />
        </div>
        <div className="flex items-center gap-1 bg-gray-800 rounded-xl p-1 border border-gray-700">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 ml-2" />
          {(["all", "unverified", "verified"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((shop) => (
            <div key={shop.id} className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <div className="flex gap-4">
                {/* Image */}
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-800 flex-shrink-0">
                  {shop.shop_image ? (
                    <Image src={shop.shop_image} alt={shop.shop_name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Store className="w-8 h-8 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="font-bold text-white text-sm">{shop.shop_name}</h3>
                      <p className="text-gray-400 text-xs">{shop.owner_name} · {shop.shopkeeper.email}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {shop.verified && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-lg">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      )}
                      {shop.gst_verified && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-lg">
                          <ShieldCheck className="w-3 h-3" /> GST
                        </span>
                      )}
                      {shop.featured && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-lg">
                          <Star className="w-3 h-3" /> Featured
                        </span>
                      )}
                      {shop.subscription?.plan === "STANDARD" && (
                        <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded-lg">
                          Standard
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{shop.address.substring(0, 30)}…</span>
                    <span className="flex items-center gap-1"><Package className="w-3 h-3" />{shop._count.products} products</span>
                    <span>{shop.category}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {!shop.verified ? (
                      <button onClick={() => doAction(shop.id, "approve")}
                        disabled={actionLoading === `${shop.id}-approve`}
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Approve
                      </button>
                    ) : (
                      <button onClick={() => doAction(shop.id, "reject")}
                        disabled={actionLoading === `${shop.id}-reject`}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Revoke
                      </button>
                    )}
                    {!shop.gst_verified && shop.gst_number && (
                      <button onClick={() => doAction(shop.id, "verify_gst")}
                        disabled={actionLoading === `${shop.id}-verify_gst`}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" /> Verify GST
                      </button>
                    )}
                    <button onClick={() => doAction(shop.id, "feature", { featured: !shop.featured })}
                      disabled={actionLoading === `${shop.id}-feature`}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 ${shop.featured ? "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border border-yellow-500/20" : "bg-gray-800 text-gray-400 hover:text-yellow-400 hover:bg-yellow-500/10 border border-gray-700"}`}>
                      <Star className="w-3 h-3" /> {shop.featured ? "Unfeature" : "Feature"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-12 text-center">
              <Store className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No shops found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

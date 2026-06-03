"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Package, ArrowLeft, Search, Plus, Minus,
  AlertTriangle, CheckCircle2, BarChart3, RefreshCw,
  TrendingDown
} from "lucide-react";

interface InventoryItem {
  id: string;
  title: string;
  price: number;
  stock: number;
  inStock: boolean;
  images: string[];
  category?: string;
  brand?: string;
}

export default function InventoryPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [products, setProducts] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [stockInputs, setStockInputs] = useState<Record<string, number>>({});
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) { router.push("/sign-in"); return; }
    fetchInventory();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  const fetchInventory = async () => {
    setLoading(true);
    const res = await fetch("/api/inventory/update");
    const data = await res.json();
    const items = data.products || [];
    setProducts(items);
    const inputs: Record<string, number> = {};
    items.forEach((p: InventoryItem) => { inputs[p.id] = p.stock; });
    setStockInputs(inputs);
    setLoading(false);
  };

  const updateStock = async (productId: string) => {
    const newStock = stockInputs[productId] ?? 0;
    setUpdating(productId);
    const res = await fetch("/api/inventory/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, stock: newStock }),
    });
    const data = await res.json();
    if (data.product) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, stock: data.product.stock, inStock: data.product.inStock } : p
        )
      );
      setSaved(productId);
      setTimeout(() => setSaved(null), 2000);
    }
    setUpdating(null);
  };

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  const outOfStock = products.filter((p) => !p.inStock).length;
  const lowStock = products.filter((p) => p.inStock && p.stock <= 3).length;

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <ArrowLeft className="w-4 h-4 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-extrabold text-gray-900">Inventory Management</h1>
              <p className="text-xs text-gray-500">{products.length} products total</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchInventory} className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors" title="Refresh">
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
            <Link href="/shopkeeper/products"
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors">
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-6">
        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: Package, label: "Total Products", value: products.length, color: "bg-blue-50 text-blue-600" },
            { icon: TrendingDown, label: "Out of Stock", value: outOfStock, color: "bg-red-50 text-red-600" },
            { icon: AlertTriangle, label: "Low Stock (≤3)", value: lowStock, color: "bg-orange-50 text-orange-600" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className="text-2xl font-extrabold text-gray-900">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, brand, category…"
            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:border-blue-400 transition-all shadow-sm"
          />
        </div>

        {/* Inventory table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-gray-400 uppercase font-semibold bg-gray-50/80 border-b border-gray-100">
                  <th className="px-5 py-3.5 text-left">Product</th>
                  <th className="px-5 py-3.5 text-left">Category</th>
                  <th className="px-5 py-3.5 text-left">Price</th>
                  <th className="px-5 py-3.5 text-left">Status</th>
                  <th className="px-5 py-3.5 text-left">Stock</th>
                  <th className="px-5 py-3.5 text-left">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center">
                      <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No products found</p>
                      <Link href="/shopkeeper/products" className="text-blue-600 text-sm font-semibold hover:underline mt-2 inline-block">
                        Add your first product →
                      </Link>
                    </td>
                  </tr>
                ) : filtered.map((product) => (
                  <tr key={product.id} className={`hover:bg-gray-50/50 transition-colors ${!product.inStock ? "bg-red-50/30" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                          {product.images?.[0] ? (
                            <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-5 h-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm line-clamp-1 max-w-[180px]">{product.title}</p>
                          {product.brand && <p className="text-xs text-gray-400">{product.brand}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg font-medium">
                        {product.category || "General"}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-gray-900 text-sm">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-4">
                      {!product.inStock ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded-lg">
                          <AlertTriangle className="w-3 h-3" /> Out of Stock
                        </span>
                      ) : product.stock <= 3 ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-orange-600 bg-orange-50 border border-orange-100 px-2 py-1 rounded-lg">
                          <AlertTriangle className="w-3 h-3" /> Low ({product.stock})
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-lg">
                          <CheckCircle2 className="w-3 h-3" /> In Stock ({product.stock})
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setStockInputs((s) => ({ ...s, [product.id]: Math.max(0, (s[product.id] ?? 0) - 1) }))}
                          className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <input
                          type="number"
                          min={0}
                          value={stockInputs[product.id] ?? 0}
                          onChange={(e) => setStockInputs((s) => ({ ...s, [product.id]: Math.max(0, parseInt(e.target.value) || 0) }))}
                          className="w-16 text-center py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 outline-none focus:border-blue-400"
                        />
                        <button
                          onClick={() => setStockInputs((s) => ({ ...s, [product.id]: (s[product.id] ?? 0) + 1 }))}
                          className="w-7 h-7 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => updateStock(product.id)}
                        disabled={updating === product.id || (stockInputs[product.id] ?? 0) === product.stock}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          saved === product.id
                            ? "bg-green-100 text-green-700"
                            : updating === product.id
                            ? "bg-gray-100 text-gray-400 cursor-wait"
                            : (stockInputs[product.id] ?? 0) === product.stock
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {saved === product.id ? (
                          <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Saved</span>
                        ) : updating === product.id ? (
                          <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3 animate-spin" /> Saving</span>
                        ) : "Update"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

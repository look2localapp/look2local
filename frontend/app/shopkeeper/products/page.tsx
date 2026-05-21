"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { BarChart3, Package, Video, Settings, ShoppingBag, Store, PlusCircle, Search, Edit2, Trash2, X, ArrowLeft } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const PRODUCTS = [
  { id: "1", title: "Sony PlayStation 5 Disc Edition", price: 49990, offerPrice: 44990, stock: 12, status: "Active", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=200&auto=format&fit=crop", bankOffers: 2 },
  { id: "2", title: "Apple AirPods Pro (2nd Gen)", price: 24900, offerPrice: 21500, stock: 8, status: "Active", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=200&auto=format&fit=crop", bankOffers: 3 },
  { id: "3", title: "Samsung 65\" 4K Smart TV", price: 84990, offerPrice: 69990, stock: 3, status: "Active", image: "https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?q=80&w=200&auto=format&fit=crop", bankOffers: 1 },
  { id: "4", title: "Logitech G Pro X Superlight", price: 12995, offerPrice: 12995, stock: 0, status: "Out of Stock", image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=200&auto=format&fit=crop", bankOffers: 0 },
];

const NAV = [
  { icon: BarChart3, label: "Overview", href: "/shopkeeper/dashboard" },
  { icon: Package, label: "Products", href: "/shopkeeper/products", active: true },
  { icon: Video, label: "Reels", href: "/dashboard/reels" },
  { icon: ShoppingBag, label: "Orders", href: "/shopkeeper/orders" },
  { icon: Settings, label: "Settings", href: "/shopkeeper/dashboard" },
];

export default function ShopkeeperProductsPage() {
  const [query, setQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [bankOffers, setBankOffers] = useState([{ bank: "", type: "", text: "" }]);

  // Autocomplete State
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [apiResults, setApiResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (val: string) => {
    setFormTitle(val);
    if (!val.trim()) {
      setApiResults([]);
      setShowDropdown(false);
      return;
    }
    
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    searchTimeoutRef.current = setTimeout(async () => {
      setIsSearching(true);
      setShowDropdown(true);
      try {
        const res = await fetch(`/api/product-search?q=${encodeURIComponent(val)}`);
        const data = await res.json();
        setApiResults(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  const handleProductSelect = (device: any) => {
    setFormTitle(device.name || "");
    const specs = [];
    if (device.brand) specs.push(`Brand: ${device.brand}`);
    if (device.resolution) specs.push(`Resolution: ${device.resolution}`);
    if (device.os) specs.push(`OS: ${device.os}`);
    setFormDescription(specs.join(" | "));
    setShowDropdown(false);
  };

  const filtered = PRODUCTS.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));

  const addBankOffer = () => setBankOffers([...bankOffers, { bank: "", type: "", text: "" }]);
  const removeBankOffer = (i: number) => setBankOffers(bankOffers.filter((_, idx) => idx !== i));

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white hidden md:flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center"><Store className="w-5 h-5 text-white" /></div>
            <div><p className="font-bold text-sm">Tech Hub Electronics</p><span className="text-[11px] text-green-400">✓ Verified</span></div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}>
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/shopkeeper/dashboard" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-extrabold text-gray-900">Products & Bank Offers</h1>
            <p className="text-sm text-gray-500">Manage inventory, discounts, and bank card offers</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-blue-100"
          >
            <PlusCircle className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search products…" value={query} onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
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
                  <th className="px-6 py-4">Bank Offers</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden relative flex-shrink-0">
                          <Image src={p.image} alt={p.title} fill className="object-cover" />
                        </div>
                        <span className="font-semibold text-gray-900 text-sm line-clamp-2 max-w-[180px]">{p.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400 line-through">₹{p.price.toLocaleString("en-IN")}</td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900">₹{p.offerPrice.toLocaleString("en-IN")}</span>
                      {p.price !== p.offerPrice && (
                        <span className="ml-2 text-xs text-green-600 font-semibold">
                          {Math.round(((p.price - p.offerPrice) / p.price) * 100)}% off
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${p.stock === 0 ? "text-red-500" : p.stock < 5 ? "text-amber-600" : "text-gray-900"}`}>
                        {p.stock === 0 ? "Out of stock" : `${p.stock} units`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.bankOffers > 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">🏦 {p.bankOffers} active</span>
                      ) : (
                        <button onClick={() => setShowAddModal(true)} className="text-xs text-gray-400 hover:text-blue-600 hover:underline">+ Add offer</button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${p.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h3 className="font-bold text-lg text-gray-900">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-5">
              <ImageUpload
                type="product"
                label="Product Photo *"
                hint="Clear product photo on white/neutral background · Max 5MB"
                aspectRatio="product"
                onUpload={(url) => console.log("Product image URL:", url)}
              />
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Product Title *</label>
                <input 
                  type="text" 
                  value={formTitle}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => { if (apiResults.length > 0) setShowDropdown(true); }}
                  placeholder="e.g. iPhone 16 Pro 256GB" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" 
                />
                
                {/* Autocomplete Dropdown */}
                {showDropdown && (formTitle.trim() !== "") && (
                  <div className="absolute z-20 left-0 right-0 mt-2 bg-white border border-gray-100 shadow-xl rounded-xl max-h-64 overflow-y-auto">
                    {isSearching ? (
                      <div className="px-4 py-3 text-sm text-gray-500 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" /> Searching database...
                      </div>
                    ) : apiResults.length > 0 ? (
                      apiResults.map((item, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleProductSelect(item)}
                          className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors flex items-center gap-3"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{item.brand || "Unknown Brand"}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">No products found. Enter manually.</div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea 
                  rows={2} 
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Brief description…" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition-all" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">MRP *</label>
                  <input type="number" placeholder="49990" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Offer Price *</label>
                  <input type="number" placeholder="44990" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Stock Quantity</label>
                <input type="number" placeholder="10" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all" />
              </div>

              {/* Bank Offers */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">🏦 Bank & Card Offers</label>
                  <button onClick={addBankOffer} className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1">
                    <PlusCircle className="w-3.5 h-3.5" /> Add offer
                  </button>
                </div>
                <div className="space-y-3">
                  {bankOffers.map((_, i) => (
                    <div key={i} className="flex gap-2 bg-gray-50 rounded-xl p-3">
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400">
                            <option value="">Bank</option>
                            {["HDFC", "SBI", "ICICI", "AXIS", "KOTAK"].map(b => <option key={b}>{b}</option>)}
                          </select>
                          <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400">
                            <option value="">Card Type</option>
                            {["Credit Card", "Debit Card", "EMI", "Net Banking"].map(t => <option key={t}>{t}</option>)}
                          </select>
                        </div>
                        <input type="text" placeholder="e.g. 10% off up to ₹3,000" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400" />
                      </div>
                      {bankOffers.length > 1 && (
                        <button onClick={() => removeBankOffer(i)} className="text-gray-400 hover:text-red-500 p-1 flex-shrink-0">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowAddModal(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-blue-100 active:scale-[0.98]"
              >
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

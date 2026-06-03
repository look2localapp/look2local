"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin, Search, ChevronRight, ShieldCheck, Clock, Star,
  Play, Zap, Lock, Navigation, Smartphone, Monitor, Tv,
  Armchair, ShoppingBag, ShoppingCart, Sparkles, Gamepad2, ArrowRight,
  Loader2, BadgePercent, Gift, Landmark, Award
} from "lucide-react";
import LocationPicker from "@/components/LocationPicker";
import { getUserLocation } from "@/lib/geo";
import CouponPurchaseModal from "@/components/CouponPurchaseModal";

const CATEGORIES = [
  { icon: Smartphone,  label: "Mobiles",   q: "mobile",    color: "bg-blue-50 text-blue-600" },
  { icon: Monitor,     label: "Laptops",   q: "laptop",    color: "bg-purple-50 text-purple-600" },
  { icon: Tv,          label: "TVs",       q: "tv",        color: "bg-pink-50 text-pink-600" },
  { icon: Armchair,    label: "Furniture", q: "furniture", color: "bg-amber-50 text-amber-600" },
  { icon: ShoppingBag, label: "Fashion",   q: "fashion",   color: "bg-rose-50 text-rose-600" },
  { icon: ShoppingCart,label: "Grocery",   q: "grocery",   color: "bg-green-50 text-green-600" },
  { icon: Sparkles,    label: "Beauty",    q: "beauty",    color: "bg-fuchsia-50 text-fuchsia-600" },
  { icon: Gamepad2,    label: "Gaming",    q: "gaming",    color: "bg-indigo-50 text-indigo-600" },
];

const HOT_SEARCHES = ["iPhone 16 Pro", "PS5", "MacBook Pro", "AirPods"];

interface ShopOffer {
  productId: string;
  shopId: string;
  shopName: string;
  shopImage: string;
  price: number;
  offerPrice: number;
  distanceVal: number;
  distanceText: string;
  rating: number;
  reviewsCount: number;
  gstVerified: boolean;
  aadhaarVerified: boolean;
  successfulOrders: number;
  cardOffers: Array<{
    bankName: string;
    cardType: string;
    offerText: string;
    discountAmount: number;
    effectivePrice: number;
  }>;
}

interface ComparisonGroup {
  name: string;
  brand: string;
  image: string;
  bestPrice: number;
  shops: ShopOffer[];
}

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [comparisons, setComparisons] = useState<ComparisonGroup[]>([]);
  const [gpsLocation, setGpsLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [detectingGps, setDetectingGps] = useState(false);
  
  // Selected bank card filter for comparisons: "NONE" | "HDFC" | "ICICI" | "SBI"
  const [cardFilter, setCardFilter] = useState<string>("NONE");

  // Coupon checkout modal state
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string; price: number; shopName: string } | null>(null);

  // Stats for local counts
  const [stats, setStats] = useState({ shops: 3, products: 6, orders: 100 });

  // 1. Detect location on mount
  useEffect(() => {
    setDetectingGps(true);
    getUserLocation()
      .then((pos) => {
        setGpsLocation(pos);
        setDetectingGps(false);
      })
      .catch(() => {
        // Fallback to central Hyderabad coordinates
        setGpsLocation({ lat: 17.4483, lng: 78.3915 });
        setDetectingGps(false);
      });
  }, []);

  // 2. Fetch stats on mount
  useEffect(() => {
    fetch("/api/product-search/compare?q=iPhone")
      .then(res => res.json())
      .then(data => {
        // Just warm up / verify
      }).catch(() => {});
  }, []);

  // 3. Search & Compare
  const handleCompare = async (searchTerm: string) => {
    const finalSearch = searchTerm || query;
    if (!finalSearch.trim()) return;

    setSearching(true);
    setQuery(finalSearch);

    try {
      const lat = gpsLocation?.lat ?? "";
      const lng = gpsLocation?.lng ?? "";
      const res = await fetch(`/api/product-search/compare?q=${encodeURIComponent(finalSearch)}&lat=${lat}&lng=${lng}`);
      const data = await res.json();
      setComparisons(data.comparisons || []);
    } catch (err) {
      console.error(err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top Strip */}
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <LocationPicker />
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-green-500" />
              {detectingGps ? "Detecting GPS location..." : "GPS Location Active"}
            </span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-blue-500" /> GST Verified Shops</span>
          </div>
        </div>
      </div>

      {/* HERO Section with Search Comparison Widget */}
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] pt-12 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-orange-400 text-xs font-bold tracking-widest uppercase mb-3 px-3 py-1 bg-white/5 rounded-full inline-flex items-center gap-1.5 border border-white/10">
            <Zap className="w-3.5 h-3.5" /> Hyperlocal Comparison Hero
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
            Find local shops. <span className="text-orange-400">Compare real prices.</span>
          </h1>
          <p className="text-blue-200 text-sm md:text-base mb-8 max-w-xl mx-auto">
            Search any mobile or laptop, instantly compare price &amp; distance from nearby shops, and buy a discount coupon!
          </p>

          {/* Search/Comparison Hero Input */}
          <div className="bg-white p-2 rounded-2xl shadow-2xl overflow-hidden flex items-center max-w-2xl mx-auto border-2 border-white focus-within:border-orange-500 transition-all">
            <Search className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleCompare(query)}
              placeholder="Search e.g. iPhone 16 Pro Max, PS5, AirPods..."
              className="flex-1 px-3 py-3 text-gray-900 placeholder:text-gray-400 text-sm md:text-base outline-none bg-transparent"
            />
            <button
              onClick={() => handleCompare(query)}
              disabled={searching}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors flex-shrink-0 flex items-center gap-1.5 shadow-sm shadow-orange-300"
            >
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Compare Prices"}
            </button>
          </div>

          {/* Hot Searches */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span className="text-blue-300 text-xs font-semibold">Try:</span>
            {HOT_SEARCHES.map(term => (
              <button
                key={term}
                onClick={() => handleCompare(term)}
                className="text-xs bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium px-3.5 py-1.5 rounded-xl transition-all"
              >
                {term}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Referral System Promo Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-900 text-white py-3 px-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-xs md:text-sm">
          <div className="flex items-center gap-2 font-semibold">
            <Gift className="w-4 h-4 text-pink-400 animate-bounce" />
            <span>Invite Friends, Earn ₹25 Coupon Credit! Your friend gets immediate access.</span>
          </div>
          <Link href="/profile" className="bg-white text-purple-950 font-bold px-3 py-1 rounded-lg hover:bg-pink-100 transition-colors text-xs">
            Get Invite Code
          </Link>
        </div>
      </div>

      {/* Platform Stats */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 divide-x divide-gray-100">
          {[
            { val: `${stats.shops}+`, label: "Local Verified Shops" },
            { val: `${stats.products}+`, label: "Products Compare" },
            { val: `${stats.orders}+`, label: "Successful Orders" },
          ].map(({ val, label }) => (
            <div key={label} className="py-4 text-center">
              <p className="font-heading text-lg md:text-xl font-black text-orange-500">{val}</p>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Main Page Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Dynamic Comparison Panel (Shows only if search results exist) */}
        {comparisons.length > 0 && (
          <section className="space-y-6 scroll-mt-6" id="comparison-results">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-1.5 h-6 bg-orange-500 rounded-full" />
                <h2 className="font-heading text-xl md:text-2xl font-black text-gray-900">Local Shop Comparisons</h2>
              </div>
              
              {/* Card Offer Comparison selector */}
              <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-gray-200 rounded-2xl shadow-sm text-xs">
                <Landmark className="w-4 h-4 text-blue-600" />
                <span className="text-gray-500 font-semibold">Bank Offers:</span>
                <select 
                  value={cardFilter} 
                  onChange={(e) => setCardFilter(e.target.value)} 
                  className="outline-none bg-transparent font-bold text-gray-900 cursor-pointer"
                >
                  <option value="NONE">Standard Price (No Card)</option>
                  <option value="HDFC">HDFC Credit Card</option>
                  <option value="ICICI">ICICI Credit Card</option>
                  <option value="SBI">SBI Credit Card</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">
              {comparisons.map((group, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-md p-6">
                  {/* Product Header */}
                  <div className="flex flex-col md:flex-row gap-5 items-start md:items-center border-b border-gray-50 pb-5 mb-5">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden relative border border-gray-100 flex-shrink-0">
                      <Image src={group.image || "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=200"} alt={group.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">{group.brand}</span>
                      <h3 className="text-lg md:text-xl font-extrabold text-gray-900 mt-1 line-clamp-1">{group.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Comparing prices across {group.shops.length} verified stores near you</p>
                    </div>
                    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-3 text-center">
                      <p className="text-xs text-orange-500 font-semibold">Best Price</p>
                      <p className="text-xl font-black text-orange-600">₹{group.bestPrice.toLocaleString("en-IN")}</p>
                    </div>
                  </div>

                  {/* Shop Comparison Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[640px]">
                      <thead>
                        <tr className="text-xs font-bold text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
                          <th className="px-4 py-3">Shop</th>
                          <th className="px-4 py-3">Trust Score</th>
                          <th className="px-4 py-3">Distance</th>
                          <th className="px-4 py-3">MRP</th>
                          <th className="px-4 py-3 text-orange-600">L2L Price</th>
                          {cardFilter !== "NONE" && <th className="px-4 py-3 text-green-600">{cardFilter} Effective Price</th>}
                          <th className="px-4 py-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {group.shops.map((shop) => {
                          // Find card offer for filter
                          const cardOffer = shop.cardOffers.find(o => o.bankName === cardFilter);
                          const finalPrice = cardOffer ? cardOffer.effectivePrice : shop.offerPrice;

                          return (
                            <tr key={shop.shopId} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl overflow-hidden relative flex-shrink-0 bg-gray-50">
                                    <Image src={shop.shopImage} alt={shop.shopName} fill className="object-cover" />
                                  </div>
                                  <div>
                                    <Link href={`/shops/${shop.shopId}`} className="font-bold text-gray-900 hover:text-blue-600 hover:underline text-sm truncate max-w-[150px] block">
                                      {shop.shopName}
                                    </Link>
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                      {shop.gstVerified && (
                                        <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 px-1 rounded flex items-center gap-0.5" title="GSTIN Verified">
                                          GST
                                        </span>
                                      )}
                                      {shop.aadhaarVerified && (
                                        <span className="text-[9px] font-extrabold text-green-700 bg-green-50 px-1 rounded flex items-center gap-0.5" title="Aadhaar Verified">
                                          UID
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-4">
                                <div className="flex items-center gap-1 text-amber-500">
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                  <span className="text-sm font-extrabold text-gray-900">{shop.rating}</span>
                                  <span className="text-gray-400 text-xs">({shop.reviewsCount})</span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-semibold flex items-center gap-0.5 mt-0.5">
                                  <Award className="w-3 h-3 text-blue-500" /> {shop.successfulOrders} successful visits
                                </span>
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                                  {shop.distanceText}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-400 line-through">
                                ₹{shop.price.toLocaleString("en-IN")}
                              </td>
                              <td className="px-4 py-4">
                                <span className="text-base font-black text-gray-900">₹{shop.offerPrice.toLocaleString("en-IN")}</span>
                              </td>
                              {cardFilter !== "NONE" && (
                                <td className="px-4 py-4">
                                  <span className="text-base font-black text-green-600">₹{finalPrice.toLocaleString("en-IN")}</span>
                                  <p className="text-[10px] text-green-500 font-semibold mt-0.5">With card offer</p>
                                </td>
                              )}
                              <td className="px-4 py-4 text-right">
                                <button
                                  onClick={() => setSelectedProduct({
                                    id: shop.productId,
                                    name: group.name,
                                    price: shop.offerPrice,
                                    shopName: shop.shopName
                                  })}
                                  className="bg-orange-500 hover:bg-orange-600 text-white font-extrabold px-4 py-2 rounded-xl text-xs transition-colors shadow-sm"
                                >
                                  Get Coupon
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Categories Section */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            <h2 className="font-heading text-xl md:text-2xl font-black text-gray-900">Search by Category</h2>
          </div>
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {CATEGORIES.map(({ icon: Icon, label, q, color }) => (
                <button key={q} onClick={() => handleCompare(q)}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform shadow-sm`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Banner / Promo Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-6 text-white relative overflow-hidden shadow-md">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
            <ShieldCheck className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="font-heading text-lg font-bold mb-1">GST &amp; Aadhaar Verified Sellers</h3>
            <p className="text-blue-200 text-sm mb-4">Every shopkeeper is verified with government GST records &amp; biometric ID validation. Shop secure.</p>
            <Link href="/shops" className="bg-white text-blue-700 font-bold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 hover:bg-blue-50 transition-colors">
              Browse Shops <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl p-6 text-white relative overflow-hidden shadow-md">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
            <Zap className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="font-heading text-lg font-bold mb-1">Lock Prices Instantly</h3>
            <p className="text-orange-100 text-sm mb-4">Visit the store today! Reserve the deal before you visit. Price guaranteed for 24 hours.</p>
            <Link href="/shopkeeper/register" className="bg-white text-orange-600 font-bold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 hover:bg-orange-50 transition-colors">
              Register Your Shop <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>

      {/* Coupon Purchase Modal */}
      {selectedProduct && (
        <CouponPurchaseModal
          productId={selectedProduct.id}
          productName={selectedProduct.name}
          productPrice={selectedProduct.price}
          shopName={selectedProduct.shopName}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}

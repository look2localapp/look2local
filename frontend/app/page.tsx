"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  MapPin, Search, ChevronRight, ShieldCheck, Clock, Star,
  Play, Zap, Lock, Navigation, Smartphone, Monitor, Tv,
  Armchair, ShoppingBag, ShoppingCart, Sparkles, Gamepad2, ArrowRight
} from "lucide-react";
import LocationPicker from "@/components/LocationPicker";

/* ─── Data ─────────────────────────────────────── */
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

const HOT_SEARCHES = ["iPhone 16 Pro", "PS5", "MacBook Air M3", "Samsung S25"];

const OFFERS = [
  { id: "101", title: "Sony PlayStation 5", shopName: "Tech Hub Electronics", originalPrice: 49990, offerPrice: 44990, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600&auto=format&fit=crop", badge: "10% OFF", expires: "2h 15m" },
  { id: "102", title: "Oak Dining Chair",    shopName: "Urban Furniture",      originalPrice: 4500,  offerPrice: 2999,  image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=600&auto=format&fit=crop", badge: "33% OFF", expires: "45m" },
  { id: "103", title: "Nike Air Force 1",   shopName: "The Sneaker Drop",     originalPrice: 8495,  offerPrice: 7200,  image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop", badge: "15% OFF", expires: "1h 30m" },
  { id: "104", title: "AirPods Pro 2nd Gen",shopName: "Tech Hub Electronics", originalPrice: 24900, offerPrice: 21500, image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600&auto=format&fit=crop", badge: "14% OFF", expires: "3h" },
];

const SHOPS = [
  { id: "1", name: "Tech Hub Electronics",   category: "Electronics",   rating: 4.8, distance: "1.2 km", image: "https://images.unsplash.com/photo-1550009158-9effb619a6c4?q=80&w=800&auto=format&fit=crop", verified: true },
  { id: "2", name: "Urban Furniture Studio", category: "Furniture",     rating: 4.6, distance: "2.5 km", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop", verified: true },
  { id: "3", name: "The Sneaker Drop",       category: "Fashion",       rating: 4.9, distance: "0.8 km", image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800&auto=format&fit=crop", verified: false },
];

const REELS = [
  { thumb: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=300&auto=format&fit=crop", shop: "Tech Hub", title: "PS5 Unboxing" },
  { thumb: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=300&auto=format&fit=crop", shop: "iWorld",    title: "iPhone 16 Pro" },
  { thumb: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=300&auto=format&fit=crop", shop: "Sneaker Drop", title: "Nike Air Drop" },
  { thumb: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=300&auto=format&fit=crop", shop: "Urban Studio",  title: "New Collection" },
];


/* ─── Main homepage ─── */
export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);


  const handleSearch = (q: string) => {
    const term = q.trim() || query.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA]">

      {/* ═══════════════════════════════════════════════════
          TOP STRIP — location + delivery info (like Blinkit)
      ═══════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <LocationPicker />
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-green-500" /> Offers active near you</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-blue-500" /> GST Verified Shops</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          HERO — Search focused (like Flipkart)
      ═══════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] pt-10 pb-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-3 flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5" /> India&apos;s Hyperlocal Marketplace
          </p>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 leading-tight">
            Find. Compare. <span className="text-orange-400">Lock the Price.</span>
          </h1>
          <p className="text-blue-200 text-base mb-8 max-w-xl mx-auto">
            Search any product, compare prices across nearby shops, and lock the best deal before you visit.
          </p>

          {/* Search box */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex items-center max-w-2xl mx-auto">
            <Search className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch(query)}
              placeholder="Search mobiles, laptops, TVs, shoes…"
              className="flex-1 px-3 py-4 text-gray-900 placeholder:text-gray-400 text-base outline-none bg-transparent"
            />
            <button
              onClick={() => handleSearch(query)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-4 text-sm transition-colors flex-shrink-0"
            >
              Search
            </button>
          </div>

          {/* Hot searches */}
          <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
            <span className="text-blue-300 text-xs">Trending:</span>
            {HOT_SEARCHES.map(q => (
              <button key={q} onClick={() => handleSearch(q)}
                className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium px-3 py-1.5 rounded-full transition-all">
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          STATS STRIP
      ═══════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 divide-x divide-gray-100">
          {[
            { val: "0", label: "Local Shops" },
            { val: "0", label: "Products" },
            { val: "0", label: "Customers" },
          ].map(({ val, label }) => (
            <div key={label} className="py-4 text-center">
              <p className="font-heading text-lg font-bold text-orange-500">{val}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════
          PAGE BODY
      ═══════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

        {/* CATEGORIES — like Flipkart top nav strip */}
        <section>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {CATEGORIES.map(({ icon: Icon, label, q, color }) => (
                <Link key={q} href={`/search?q=${q}`}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 text-center leading-tight">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* LIVE OFFERS — like Amazon deals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-orange-500 rounded-full" />
              <h2 className="font-heading text-xl font-bold text-gray-900">Live Offers — Lock Now</h2>
              <span className="text-xs font-bold text-white bg-orange-500 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
            </div>
            <Link href="/search" className="text-sm text-orange-600 font-semibold hover:underline flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {OFFERS.map(o => {
              const disc = Math.round(((o.originalPrice - o.offerPrice) / o.originalPrice) * 100);
              return (
                <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden card-hover flex flex-col">
                  <div className="relative h-44 bg-gray-50">
                    <Image src={o.image} alt={o.title} fill className="object-cover" />
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-lg">
                      {disc}% OFF
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-semibold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {o.expires}
                    </div>
                  </div>
                  <div className="p-3 flex flex-col flex-grow">
                    <p className="text-xs text-orange-600 font-semibold mb-1">{o.shopName}</p>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 flex-grow">{o.title}</h3>
                    <div className="flex items-end gap-2 mb-3">
                      <span className="text-lg font-bold text-gray-900">₹{o.offerPrice.toLocaleString("en-IN")}</span>
                      <span className="text-xs text-gray-400 line-through mb-0.5">₹{o.originalPrice.toLocaleString("en-IN")}</span>
                    </div>
                    <Link href={`/shops/1`}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors">
                      <Lock className="w-3.5 h-3.5" /> Lock This Price
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* TWO COLUMN BANNER — like Flipkart promos */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
            <div className="absolute -right-2 bottom-0 w-20 h-20 bg-white/5 rounded-full" />
            <ShieldCheck className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="font-heading text-lg font-bold mb-1">GST Verified Shops</h3>
            <p className="text-blue-200 text-sm mb-4">Every shop is verified with real GST records. Shop with confidence.</p>
            <Link href="/shops" className="bg-white text-blue-700 font-bold text-sm px-4 py-2 rounded-xl inline-flex items-center gap-1.5 hover:bg-blue-50 transition-colors">
              Browse Shops <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
            <Zap className="w-8 h-8 mb-3 opacity-80" />
            <h3 className="font-heading text-lg font-bold mb-1">Lock Prices Instantly</h3>
            <p className="text-orange-100 text-sm mb-4">Reserve the deal before you visit. Price guaranteed for 24 hours.</p>
            <Link href="/shopkeeper/register" className="bg-white text-orange-600 font-bold text-sm px-4 py-2 rounded-xl inline-flex items-center gap-1.5 hover:bg-orange-50 transition-colors">
              Register Your Shop <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>

        {/* NEARBY SHOPS */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full" />
              <h2 className="font-heading text-xl font-bold text-gray-900">Nearby Shops</h2>
            </div>
            <Link href="/shops" className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1">
              See all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SHOPS.map(shop => (
              <Link key={shop.id} href={`/shops/${shop.id}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden card-hover block">
                <div className="relative h-40">
                  <Image src={shop.image} alt={shop.name} fill className="object-cover" />
                  {shop.verified && (
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <MapPin className="w-2.5 h-2.5 text-orange-500" /> {shop.distance}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm">{shop.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{shop.category}</p>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold text-gray-700">{shop.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* REELS STRIP — like Instagram */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-purple-500 rounded-full" />
              <h2 className="font-heading text-xl font-bold text-gray-900">Shop Reels</h2>
            </div>
            <Link href="/reels" className="text-sm text-purple-600 font-semibold hover:underline flex items-center gap-1">
              Watch all <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {REELS.map((r, i) => (
              <Link key={i} href="/reels" className="flex-shrink-0 w-32 group">
                <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-200">
                  <Image src={r.thumb} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-white text-[11px] font-bold line-clamp-2 leading-tight">{r.title}</p>
                    <p className="text-white/70 text-[10px] mt-0.5">{r.shop}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SELLER CTA — like Flipkart "Sell on Flipkart" */}
        <section className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-heading text-2xl font-bold text-white mb-2">Own a shop in Vijayawada?</h2>
            <p className="text-gray-300 text-sm">Join 2,000+ local businesses. List your products, verify your GST, and get discovered by customers near you.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
            <Link href="/shopkeeper/register"
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors text-center whitespace-nowrap">
              Register Your Shop — Free
            </Link>
            <Link href="/shopkeeper/login"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl text-sm transition-colors text-center whitespace-nowrap">
              Shopkeeper Login
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

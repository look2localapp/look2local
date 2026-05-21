"use client";

import { useState, useEffect } from "react";
import ShopCard from "@/components/ShopCard";
import dynamic from "next/dynamic";
import { MapPin, List, SlidersHorizontal, Map } from "lucide-react";
import { getUserLocation, getDistanceKm, formatDistance } from "@/lib/geo";

const NearbyShopsMap = dynamic(() => import("@/components/NearbyShopsMap"), { ssr: false });

const SHOP_DATA = [
  { id: "1", name: "Tech Hub Electronics", category: "Electronics & Gadgets", rating: 4.8, imageUrl: "https://images.unsplash.com/photo-1550009158-9effb619a6c4?q=80&w=800&auto=format&fit=crop", verified: true, lat: 17.4155, lng: 78.4521 },
  { id: "2", name: "Urban Furniture Studio", category: "Home & Furniture", rating: 4.6, imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop", verified: true, lat: 17.4260, lng: 78.4489 },
  { id: "3", name: "The Sneaker Drop", category: "Footwear & Fashion", rating: 4.9, imageUrl: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800&auto=format&fit=crop", verified: false, lat: 17.4325, lng: 78.4651 },
  { id: "4", name: "iWorld Premium", category: "Apple Products", rating: 4.7, imageUrl: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=800&auto=format&fit=crop", verified: true, lat: 17.4089, lng: 78.4753 },
  { id: "5", name: "Mobile World", category: "Electronics & Gadgets", rating: 4.5, imageUrl: "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?q=80&w=800&auto=format&fit=crop", verified: true, lat: 17.4402, lng: 78.4398 },
  { id: "6", name: "Gadget Galaxy", category: "Electronics & Gadgets", rating: 4.3, imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=800&auto=format&fit=crop", verified: false, lat: 17.4199, lng: 78.4601 },
];

const CATEGORIES = ["All", "Electronics & Gadgets", "Home & Furniture", "Footwear & Fashion", "Apple Products", "Grocery"];

type View = "list" | "map";

export default function ShopsPage() {
  const [view, setView] = useState<View>("list");
  const [activeCategory, setActiveCategory] = useState("All");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [locationLabel, setLocationLabel] = useState<string>("Detecting location…");

  // Get user location on mount
  useEffect(() => {
    getUserLocation()
      .then(({ lat, lng }) => {
        setUserLat(lat);
        setUserLng(lng);
        setLocationLabel("Using your location");
      })
      .catch(() => {
        // Fallback to Vijayawada center
        setUserLat(16.5062);
        setUserLng(80.6480);
        setLocationLabel("Vijayawada, AP (approximate)");
      });
  }, []);

  // Compute distances and filter
  const shops = SHOP_DATA
    .map((s) => ({
      ...s,
      distanceKm: userLat && userLng ? getDistanceKm(userLat, userLng, s.lat, s.lng) : 0,
    }))
    .filter((s) => activeCategory === "All" || s.category === activeCategory)
    .filter((s) => !verifiedOnly || s.verified)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Nearby Shops</h1>
          <p className="text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span>{locationLabel}</span>
            {userLat && <span className="text-green-600 font-semibold">· {shops.length} shops found</span>}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-xl border transition-colors ${showFilters ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"}`}
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          {/* View toggle: List / Map */}
          <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${view === "list" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              <List className="w-4 h-4" /> List
            </button>
            <button
              onClick={() => setView("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${view === "map" ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
            >
              <Map className="w-4 h-4" /> Map
            </button>
          </div>
        </div>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 mb-5 flex flex-wrap gap-3 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} className="w-4 h-4 accent-blue-600" />
            <span className="text-sm font-medium text-gray-700">Verified Shops Only</span>
          </label>
        </div>
      )}

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${activeCategory === cat ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MAP VIEW */}
      {view === "map" && (
        <div className="mb-6">
          <NearbyShopsMap
            shops={shops.map((s) => ({
              id: s.id,
              name: s.name,
              lat: s.lat,
              lng: s.lng,
              category: s.category,
              rating: s.rating,
              distance: formatDistance(s.distanceKm),
              verified: s.verified,
            }))}
            center={[userLat ?? 16.5062, userLng ?? 80.6480]}
          />
          <p className="text-xs text-center text-gray-400 mt-2">Click any pin to see shop details</p>
        </div>
      )}

      {/* LIST VIEW */}
      {view === "list" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {shops.map((shop) => (
            <ShopCard
              key={shop.id}
              id={shop.id}
              name={shop.name}
              category={shop.category}
              rating={shop.rating}
              distance={formatDistance(shop.distanceKm)}
              imageUrl={shop.imageUrl}
              verified={shop.verified}
            />
          ))}
        </div>
      )}

      {shops.length === 0 && (
        <div className="text-center py-20">
          <p className="text-4xl mb-3">🏪</p>
          <p className="text-lg font-bold text-gray-700">No shops found</p>
          <p className="text-sm text-gray-400">Try a different category or remove filters</p>
        </div>
      )}
    </div>
  );
}

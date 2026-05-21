"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, MapPin, Star, ShieldCheck, Lock, Store, ArrowUpDown, ChevronDown } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import CardOffer from "@/components/CardOffer";
import OfferLockModal from "@/components/OfferLockModal";

// Mock product results per shop for demo
const ALL_RESULTS = [
  {
    shopId: "1", shopName: "Tech Hub Electronics", shopImage: "https://images.unsplash.com/photo-1550009158-9effb619a6c4?q=80&w=200&auto=format&fit=crop",
    verified: true, rating: 4.8, reviews: 342, distance: "1.2 km", address: "Banjara Hills",
    googleMapLink: "https://maps.google.com/?q=Banjara+Hills+Hyderabad",
    productId: "101", title: "iPhone 16 Pro Max 256GB", price: 134900, offerPrice: 129900,
    productImage: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop",
    inStock: true,
    cardOffers: [
      { bankName: "HDFC", cardType: "Credit Card", offerText: "10% off up to ₹5,000", minAmount: 50000 },
      { bankName: "SBI", cardType: "Debit Card", offerText: "₹3,000 cashback", minAmount: 100000 },
      { bankName: "ICICI", cardType: "EMI", offerText: "No Cost EMI from ₹10,825/mo" },
    ],
  },
  {
    shopId: "2", shopName: "iWorld Premium", shopImage: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=200&auto=format&fit=crop",
    verified: true, rating: 4.6, reviews: 218, distance: "2.8 km", address: "Jubilee Hills",
    googleMapLink: "https://maps.google.com/?q=Jubilee+Hills+Hyderabad",
    productId: "102", title: "iPhone 16 Pro Max 256GB", price: 134900, offerPrice: 132000,
    productImage: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop",
    inStock: true,
    cardOffers: [
      { bankName: "AXIS", cardType: "Credit Card", offerText: "5% cashback up to ₹3,500" },
      { bankName: "ICICI", cardType: "EMI", offerText: "No Cost EMI from ₹11,000/mo" },
    ],
  },
  {
    shopId: "3", shopName: "Gadget Galaxy", shopImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=200&auto=format&fit=crop",
    verified: false, rating: 4.3, reviews: 97, distance: "3.5 km", address: "Madhapur",
    googleMapLink: "https://maps.google.com/?q=Madhapur+Hyderabad",
    productId: "103", title: "iPhone 16 Pro Max 256GB", price: 134900, offerPrice: 130500,
    productImage: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop",
    inStock: false,
    cardOffers: [
      { bankName: "HDFC", cardType: "Debit Card", offerText: "5% off up to ₹2,000" },
    ],
  },
  {
    shopId: "4", shopName: "Mobile World", shopImage: "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?q=80&w=200&auto=format&fit=crop",
    verified: true, rating: 4.7, reviews: 531, distance: "0.9 km", address: "Kukatpally",
    googleMapLink: "https://maps.google.com/?q=Kukatpally+Hyderabad",
    productId: "104", title: "iPhone 16 Pro Max 256GB", price: 134900, offerPrice: 128990,
    productImage: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop",
    inStock: true,
    cardOffers: [
      { bankName: "HDFC", cardType: "Credit Card", offerText: "10% off up to ₹5,000", minAmount: 50000 },
      { bankName: "KOTAK", cardType: "Debit Card", offerText: "₹1,500 cashback" },
      { bankName: "SBI", cardType: "EMI", offerText: "No Cost EMI from ₹10,749/mo" },
    ],
  },
];

type SortKey = "price_low" | "price_high" | "nearest" | "rating";

function SearchResults() {
  const params = useSearchParams();
  const query = params.get("q") ?? "";
  const [sort, setSort] = useState<SortKey>("price_low");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [lockItem, setLockItem] = useState<typeof ALL_RESULTS[0] | null>(null);

  let results = [...ALL_RESULTS];
  if (verifiedOnly) results = results.filter(r => r.verified);
  if (inStockOnly) results = results.filter(r => r.inStock);
  if (sort === "price_low") results.sort((a, b) => a.offerPrice - b.offerPrice);
  if (sort === "price_high") results.sort((a, b) => b.offerPrice - a.offerPrice);
  if (sort === "nearest") results.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
  if (sort === "rating") results.sort((a, b) => b.rating - a.rating);

  const bestPrice = Math.min(...results.map(r => r.offerPrice));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

      {/* Search bar */}
      <div className="mb-6">
        <SearchBar large placeholder={`Search mobiles, laptops, TVs…`} />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Results for &ldquo;<span className="text-blue-600">{query}</span>&rdquo;
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            <span className="font-bold text-gray-700">{results.length} nearby shops</span> selling this product · Sorted by {sort.replace("_", " ")}
          </p>
        </div>

        {/* Sort + Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowFilters(!showFilters)} className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-sm font-medium transition-colors ${showFilters ? "bg-gray-900 text-white border-gray-900" : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"}`}>
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="pl-3 pr-8 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:border-blue-400 appearance-none cursor-pointer"
            >
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="nearest">Nearest First</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Filter bar */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} className="w-4 h-4 accent-blue-600" />
            <span className="text-sm font-medium text-gray-700">Verified Shops Only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={inStockOnly} onChange={e => setInStockOnly(e.target.checked)} className="w-4 h-4 accent-blue-600" />
            <span className="text-sm font-medium text-gray-700">In Stock Only</span>
          </label>
        </div>
      )}

      {/* Results */}
      <div className="space-y-4">
        {results.map((result, idx) => {
          const discount = Math.round(((result.price - result.offerPrice) / result.price) * 100);
          const isBest = result.offerPrice === bestPrice;
          return (
            <div key={result.productId} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${isBest ? "border-green-300 ring-1 ring-green-300" : "border-gray-100"}`}>
              {isBest && (
                <div className="bg-green-500 text-white text-xs font-bold px-4 py-1.5 flex items-center gap-1.5">
                  🏆 Best Price Among Nearby Shops
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
                {/* Product Image */}
                <div className="relative w-full sm:w-36 h-36 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
                  <Image src={result.productImage} alt={result.title} fill className="object-cover" />
                  {!result.inStock && (
                    <div className="absolute inset-0 bg-gray-900/60 flex items-center justify-center">
                      <span className="text-white text-xs font-bold px-2 py-1 bg-red-500 rounded-lg">Out of Stock</span>
                    </div>
                  )}
                  {discount > 0 && result.inStock && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md">{discount}% OFF</div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-3">
                    {/* Shop Info */}
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        <Image src={result.shopImage} alt={result.shopName} fill className="object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-gray-900 text-sm">{result.shopName}</p>
                          {result.verified && <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-500 fill-current" /> {result.rating} ({result.reviews})
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {result.distance}</span>
                          <span>•</span>
                          <span>{result.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{result.title}</h3>

                  {/* Price */}
                  <div className="flex items-end gap-2 mb-3">
                    <span className="text-2xl font-extrabold text-gray-900">₹{result.offerPrice.toLocaleString("en-IN")}</span>
                    {discount > 0 && (
                      <span className="text-sm text-gray-400 line-through mb-0.5">₹{result.price.toLocaleString("en-IN")}</span>
                    )}
                    {discount > 0 && (
                      <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg mb-0.5">Save ₹{(result.price - result.offerPrice).toLocaleString("en-IN")}</span>
                    )}
                  </div>

                  {/* Card Offers - compact */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {result.cardOffers.slice(0, 2).map((co, i) => (
                      <CardOffer key={i} {...co} compact />
                    ))}
                    {result.cardOffers.length > 2 && (
                      <span className="text-[11px] font-semibold text-gray-400 px-2 py-1 bg-gray-50 rounded-lg">+{result.cardOffers.length - 2} more</span>
                    )}
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setLockItem(result)}
                      disabled={!result.inStock}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-colors shadow-sm shadow-blue-100 active:scale-[0.98]"
                    >
                      <Lock className="w-3.5 h-3.5" /> Lock Offer
                    </button>
                    <Link href={`/shops/${result.shopId}`} className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-700 font-semibold rounded-xl text-sm transition-colors">
                      <Store className="w-3.5 h-3.5" /> View Shop
                    </Link>
                    <a href={result.googleMapLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-gray-200 hover:border-green-300 hover:text-green-600 text-gray-700 font-semibold rounded-xl text-sm transition-colors">
                      <MapPin className="w-3.5 h-3.5" /> Navigate
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {results.length === 0 && (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">🔍</p>
          <p className="text-xl font-bold text-gray-600 mb-2">No shops found nearby</p>
          <p className="text-sm">Try adjusting your filters or search a different product</p>
        </div>
      )}

      {lockItem && (
        <OfferLockModal
          isOpen={!!lockItem}
          onClose={() => setLockItem(null)}
          product={{ title: lockItem.title, shopName: lockItem.shopName, offerPrice: lockItem.offerPrice, imageUrl: lockItem.productImage, shopMapLink: lockItem.googleMapLink }}
        />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500">Loading results…</p>
      </div>
    }>
      <SearchResults />
    </Suspense>
  );
}

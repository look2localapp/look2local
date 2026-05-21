"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, MapPin, ShieldCheck, Lock, Truck, Store, Heart, Share2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import OfferLockModal from "@/components/OfferLockModal";

const PRODUCT = {
  title: "Sony PlayStation 5 Disc Edition",
  price: 49990,
  offerPrice: 44990,
  rating: 4.8,
  reviews: 124,
  images: [
    "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=800&auto=format&fit=crop",
  ],
  shop: {
    id: "1",
    name: "Tech Hub Electronics",
    rating: 4.9,
    distance: "1.2 km",
    address: "Banjara Hills, Hyderabad",
    verified: true,
    imageUrl: "https://images.unsplash.com/photo-1550009158-9effb619a6c4?q=80&w=200&auto=format&fit=crop",
  },
  description: "Experience lightning-fast loading with an ultra-high speed SSD, deeper immersion with haptic feedback, adaptive triggers, and 3D Audio. Includes DualSense wireless controller.",
  specs: [
    { label: "Storage", value: "825GB SSD" },
    { label: "Resolution", value: "Up to 4K" },
    { label: "Frame Rate", value: "Up to 120fps" },
    { label: "Edition", value: "Disc Edition" },
    { label: "Warranty", value: "1 Year Sony" },
    { label: "Availability", value: "In Stock" },
  ],
};

export default function ProductPage({ params }: { params: { id: string } }) {
  const [activeImage, setActiveImage] = useState(0);
  const [isLockModalOpen, setIsLockModalOpen] = useState(false);
  const discountPercent = Math.round(((PRODUCT.price - PRODUCT.offerPrice) / PRODUCT.price) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Discover
        </Link>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex flex-col lg:flex-row">

            {/* Images */}
            <div className="lg:w-1/2 p-6 lg:p-8">
              <div className="relative w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 mb-4">
                <Image
                  src={PRODUCT.images[activeImage]}
                  alt={PRODUCT.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute top-4 left-4 bg-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-sm">
                  {discountPercent}% OFF
                </div>
              </div>
              <div className="flex gap-3">
                {PRODUCT.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      i === activeImage ? "border-blue-500 shadow-md" : "border-gray-100 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="lg:w-1/2 lg:border-l border-gray-100 p-6 lg:p-8 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight pr-4">
                  {PRODUCT.title}
                </h1>
                <div className="flex gap-1 flex-shrink-0">
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg text-sm font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" /> {PRODUCT.rating}
                </div>
                <span className="text-gray-400 text-sm">({PRODUCT.reviews} reviews)</span>
              </div>

              <div className="flex items-end gap-3 mb-6">
                <span className="text-4xl font-black text-gray-900">₹{PRODUCT.offerPrice.toLocaleString("en-IN")}</span>
                <span className="text-xl text-gray-400 line-through mb-0.5">₹{PRODUCT.price.toLocaleString("en-IN")}</span>
                <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-lg mb-0.5">
                  Save ₹{(PRODUCT.price - PRODUCT.offerPrice).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Shop */}
              <Link href={`/shops/${PRODUCT.shop.id}`} className="flex items-start gap-3 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 transition-colors group">
                <div className="w-12 h-12 rounded-xl bg-white border border-blue-100 relative overflow-hidden flex-shrink-0">
                  <Image src={PRODUCT.shop.imageUrl} alt={PRODUCT.shop.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-gray-900">{PRODUCT.shop.name}</span>
                    {PRODUCT.shop.verified && <ShieldCheck className="w-4 h-4 text-blue-600" />}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm mt-0.5">
                    <MapPin className="w-3.5 h-3.5" /> {PRODUCT.shop.distance} • {PRODUCT.shop.address}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors mt-2" />
              </Link>

              {/* CTAs */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setIsLockModalOpen(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl text-base shadow-lg shadow-blue-100 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Lock className="w-5 h-5" /> Lock This Offer
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm">
                    <Store className="w-4 h-4" /> Visit Store
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm">
                    <Truck className="w-4 h-4" /> Request Delivery
                  </button>
                </div>
              </div>

              {/* Spec Guarantees */}
              <div className="flex gap-4 text-xs text-gray-500 border-t border-gray-100 pt-4 mb-6">
                {[
                  <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Genuine Product</>,
                  <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Verified Shop</>,
                  <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> No Pre-payment</>,
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1">{item}</div>
                ))}
              </div>

              {/* Specs */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
                  {PRODUCT.specs.map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-1.5 border-b border-gray-50 text-sm">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-semibold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-100 p-6 lg:p-8">
            <h3 className="font-bold text-gray-900 mb-2">About this product</h3>
            <p className="text-gray-600 leading-relaxed">{PRODUCT.description}</p>
          </div>
        </div>
      </div>

      <OfferLockModal
        isOpen={isLockModalOpen}
        onClose={() => setIsLockModalOpen(false)}
        product={{ title: PRODUCT.title, shopName: PRODUCT.shop.name, offerPrice: PRODUCT.offerPrice, imageUrl: PRODUCT.images[0] }}
      />
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

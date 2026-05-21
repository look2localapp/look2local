"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, use } from "react";
import { ArrowLeft, Star, MapPin, ShieldCheck, Clock, Lock, Truck, Heart, Share2, Phone, MessageCircle, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import OfferLockModal from "@/components/OfferLockModal";
import CardOffer from "@/components/CardOffer";
import dynamic from "next/dynamic";
import ReviewsSection from "@/components/ReviewsSection";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const SHOPS: Record<string, {
  id: string; name: string; ownerName: string; phone: string; whatsapp: string;
  address: string; landmark: string; googleMapLink: string;
  lat: number; lng: number;
  shopImage: string; bannerImage: string; category: string;
  openingHours: string; rating: number; reviews: number;
  verified: boolean; deliveryAvailable: boolean; isOpen: boolean;
  products: { id: string; title: string; price: number; offerPrice: number; image: string; }[];
  cardOffers: { bankName: string; cardType: string; offerText: string; minAmount?: number }[];
}> = {
  "1": {
    id: "1", name: "Tech Hub Electronics", ownerName: "Rajesh Kumar",
    phone: "+91 98765 43210", whatsapp: "+919876543210",
    address: "Shop No. 42, Panjagutta Complex, Banjara Hills",
    landmark: "Near GVK Mall, opposite HDFC Bank",
    googleMapLink: "https://maps.google.com/?q=Banjara+Hills+Hyderabad",
    lat: 17.4155, lng: 78.4521,
    shopImage: "https://images.unsplash.com/photo-1550009158-9effb619a6c4?q=80&w=400&auto=format&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop",
    category: "Electronics & Gadgets", openingHours: "10:00 AM – 9:00 PM",
    rating: 4.8, reviews: 342, verified: true, deliveryAvailable: true, isOpen: true,
    products: [
      { id: "101", title: "Sony PlayStation 5 Disc Edition", price: 49990, offerPrice: 44990, image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=400&auto=format&fit=crop" },
      { id: "102", title: "Apple AirPods Pro (2nd Gen)", price: 24900, offerPrice: 21500, image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=400&auto=format&fit=crop" },
      { id: "103", title: "Samsung 65\" 4K Smart TV", price: 84990, offerPrice: 69990, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?q=80&w=400&auto=format&fit=crop" },
      { id: "104", title: "iPhone 16 Pro Max 256GB", price: 134900, offerPrice: 129900, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=400&auto=format&fit=crop" },
    ],
    cardOffers: [
      { bankName: "HDFC", cardType: "Credit Card", offerText: "10% instant discount up to ₹5,000", minAmount: 20000 },
      { bankName: "SBI", cardType: "Debit Card", offerText: "₹2,000 cashback on orders above ₹20,000", minAmount: 20000 },
      { bankName: "ICICI", cardType: "EMI", offerText: "No Cost EMI starting at ₹1,499/month" },
      { bankName: "AXIS", cardType: "Credit Card", offerText: "5% cashback up to ₹3,500 on Flipkart Axis card" },
    ],
  },
};

export default function ShopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const shop = SHOPS[id] ?? SHOPS["1"];
  const [lockProduct, setLockProduct] = useState<typeof shop.products[0] | null>(null);
  const [offersOpen, setOffersOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 pb-16">

      {/* Banner */}
      <div className="relative h-56 md:h-72 w-full overflow-hidden bg-gray-200">
        <Image src={shop.bannerImage} alt={`${shop.name} banner`} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
        {/* Back + Actions */}
        <div className="absolute top-4 left-4">
          <Link href="/shops" className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white text-sm font-medium px-3.5 py-2 rounded-full hover:bg-black/60 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Shops
          </Link>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="p-2.5 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-colors"><Heart className="w-4 h-4" /></button>
          <button className="p-2.5 bg-black/40 backdrop-blur-sm text-white rounded-full hover:bg-black/60 transition-colors"><Share2 className="w-4 h-4" /></button>
        </div>
        {/* Open/Closed badge */}
        <div className="absolute bottom-4 right-4">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${shop.isOpen ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {shop.isOpen ? "● Open Now" : "● Closed"}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-10 pb-8">

        {/* Shop Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 mb-5">
          <div className="flex items-start gap-5 mb-5">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-4 border-white shadow-md flex-shrink-0">
              <Image src={shop.shopImage} alt={shop.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-2xl font-extrabold text-gray-900">{shop.name}</h1>
                {shop.verified && (
                  <span className="flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-2">{shop.category}</p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-lg text-sm font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" /> {shop.rating}
                  <span className="text-amber-500 font-normal text-xs">({shop.reviews})</span>
                </div>
                {shop.deliveryAvailable && (
                  <span className="text-xs font-semibold text-green-700 bg-green-50 border border-green-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                    <Truck className="w-3 h-3" /> Delivery Available
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-5 mb-5 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Address</p>
                <p className="text-sm text-gray-700 font-medium">{shop.address}</p>
                <p className="text-xs text-gray-400">{shop.landmark}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Opening Hours</p>
                <p className="text-sm text-gray-700 font-medium">{shop.openingHours}</p>
                <p className={`text-xs font-semibold ${shop.isOpen ? "text-green-600" : "text-red-500"}`}>
                  {shop.isOpen ? "Open Now" : "Currently Closed"}
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <a href={shop.googleMapLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors text-sm shadow-sm shadow-blue-100">
              <MapPin className="w-4 h-4" /> Open in Google Maps <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
            <a href={`tel:${shop.phone}`}
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-green-300 hover:text-green-700 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm">
              <Phone className="w-4 h-4" /> Call Shop
            </a>
            <a href={`https://wa.me/${shop.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-green-400 hover:text-green-600 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm">
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>

        {/* ── Embedded Google Map ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <h2 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" /> Shop Location
          </h2>
          <MapView
            lat={shop.lat}
            lng={shop.lng}
            shopName={shop.name}
            address={shop.address}
            googleMapLink={shop.googleMapLink}
            phone={shop.phone}
            whatsapp={shop.whatsapp}
            height="320px"
          />
        </div>

        {/* Bank & Card Offers */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <button onClick={() => setOffersOpen(!offersOpen)} className="w-full flex items-center justify-between">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              🏦 Bank & Card Offers
              <span className="text-xs font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-md">{shop.cardOffers.length} offers</span>
            </h2>
            {offersOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
          </button>
          {offersOpen && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {shop.cardOffers.map((co, i) => <CardOffer key={i} {...co} />)}
            </div>
          )}
        </div>

        {/* Products */}
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-4">Products & Offers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {shop.products.map((product) => {
              const disc = Math.round(((product.price - product.offerPrice) / product.price) * 100);
              return (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 flex flex-col">
                  <div className="relative h-44 bg-gray-50">
                    <Image src={product.image} alt={product.title} fill className="object-cover" />
                    {disc > 0 && (
                      <div className="absolute top-2.5 left-2.5 bg-orange-500 text-white text-[11px] font-bold px-2 py-1 rounded-lg">{disc}% OFF</div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">{product.title}</h3>
                    <div className="flex items-end gap-2 mb-3 mt-auto">
                      <span className="text-xl font-extrabold text-gray-900">₹{product.offerPrice.toLocaleString("en-IN")}</span>
                      {product.price !== product.offerPrice && (
                        <span className="text-sm text-gray-400 line-through mb-0.5">₹{product.price.toLocaleString("en-IN")}</span>
                      )}
                    </div>
                    {/* Compact card offers */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {shop.cardOffers.slice(0, 1).map((co, i) => <CardOffer key={i} {...co} compact />)}
                    </div>
                    <button
                      onClick={() => setLockProduct(product)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.98]"
                    >
                      <Lock className="w-3.5 h-3.5" /> Lock Offer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Customer Reviews */}
        <ReviewsSection shopName={shop.name} avgRating={shop.rating} totalReviews={shop.reviews} />

      </div>

      {lockProduct && (
        <OfferLockModal
          isOpen={!!lockProduct}
          onClose={() => setLockProduct(null)}
          product={{ title: lockProduct.title, shopName: shop.name, offerPrice: lockProduct.offerPrice, imageUrl: lockProduct.image, shopMapLink: shop.googleMapLink }}
        />
      )}
    </div>
  );
}

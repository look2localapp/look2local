"use client";

import Image from "next/image";
import { Lock, Tag, Store, Timer } from "lucide-react";
import { useState } from "react";
import OfferLockModal from "./OfferLockModal";

interface ProductCardProps {
  id: string;
  title: string;
  shopName: string;
  originalPrice: number;
  offerPrice: number;
  imageUrl: string;
  expiresIn?: string;
}

export default function ProductCard({
  id,
  title,
  shopName,
  originalPrice,
  offerPrice,
  imageUrl,
  expiresIn = "2h 00m",
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const discountPercent = Math.round(((originalPrice - offerPrice) / originalPrice) * 100);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 flex flex-col">
        {/* Image */}
        <div className="relative h-44 w-full bg-gray-50 overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            sizes="(max-width:768px) 50vw,25vw"
          />
          {discountPercent > 0 && (
            <div className="absolute top-2.5 left-2.5 bg-orange-500 text-white text-[11px] font-bold px-2 py-1 rounded-lg shadow-sm">
              {discountPercent}% OFF
            </div>
          )}
          {/* Timer Badge */}
          <div className="absolute bottom-2.5 right-2.5 bg-black/70 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
            <Timer className="w-3 h-3 text-orange-400" />
            {expiresIn}
          </div>
        </div>

        {/* Info */}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-1">{title}</h3>
          <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
            <Store className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{shopName}</span>
          </p>

          <div className="mt-auto">
            <div className="flex items-end gap-2 mb-3">
              <span className="text-xl font-extrabold text-gray-900">
                ₹{offerPrice.toLocaleString("en-IN")}
              </span>
              {originalPrice !== offerPrice && (
                <span className="text-sm text-gray-400 line-through mb-0.5">
                  ₹{originalPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-sm shadow-blue-100 active:scale-[0.98]"
            >
              <Lock className="w-3.5 h-3.5" /> Lock Offer
            </button>
          </div>
        </div>
      </div>

      <OfferLockModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={{ title, shopName, offerPrice, imageUrl }}
      />
    </>
  );
}

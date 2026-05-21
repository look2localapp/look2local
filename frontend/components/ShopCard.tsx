import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ShieldCheck, Clock } from "lucide-react";

interface ShopCardProps {
  id: string;
  name: string;
  category: string;
  rating: number;
  distance: string;
  imageUrl: string;
  verified?: boolean;
  isOpen?: boolean;
  deliveryTime?: string;
}

export default function ShopCard({
  id,
  name,
  category,
  rating,
  distance,
  imageUrl,
  verified = true,
  isOpen = true,
  deliveryTime = "30–45 min",
}: ShopCardProps) {
  return (
    <Link href={`/shops/${id}`} className="group block">
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width:768px) 100vw,(max-width:1200px) 50vw,33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {!isOpen && (
              <span className="bg-gray-900/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md backdrop-blur-sm">
                Closed
              </span>
            )}
            {verified && (
              <span className="bg-white/90 text-blue-600 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 backdrop-blur-sm">
                <ShieldCheck className="w-3 h-3" /> Verified
              </span>
            )}
          </div>

          <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[11px] font-semibold text-gray-700 flex items-center gap-1">
            <Clock className="w-3 h-3 text-orange-500" />
            {deliveryTime}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-1">
            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
              {name}
            </h3>
            <div className="flex items-center gap-0.5 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-sm font-bold flex-shrink-0 ml-2">
              <Star className="w-3 h-3 fill-current" />
              {rating}
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-3">{category}</p>
          <div className="flex items-center justify-between text-sm border-t border-gray-50 pt-3">
            <span className="flex items-center gap-1 text-gray-500">
              <MapPin className="w-3.5 h-3.5" /> {distance}
            </span>
            <span className="text-blue-600 font-semibold text-xs hover:underline">View Offers →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

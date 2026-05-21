"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { MapPin, ShieldCheck, Star, ArrowRight } from "lucide-react";

// Fix leaflet default marker icon (missing in webpack builds)
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:       "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface Shop {
  id: string;
  name: string;
  category: string;
  rating: number;
  verified: boolean;
  distance?: string;
  lat: number;
  lng: number;
}

interface NearbyShopsMapProps {
  shops: Shop[];
  center: [number, number];
}

export default function NearbyShopsMap({ shops, center }: NearbyShopsMapProps) {
  return (
    <div className="w-full h-[480px] rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      <MapContainer center={center} zoom={13} style={{ width: "100%", height: "100%" }} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {shops.map(shop => (
          <Marker key={shop.id} position={[shop.lat, shop.lng]}>
            <Popup>
              <div className="min-w-[180px]">
                <div className="flex items-center gap-1.5 mb-1">
                  {shop.verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />}
                  <p className="font-bold text-sm text-gray-900">{shop.name}</p>
                </div>
                <p className="text-xs text-gray-500 mb-1">{shop.category}</p>
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-3 h-3 text-amber-400 fill-current" />
                  <span className="text-xs font-semibold text-gray-700">{shop.rating}</span>
                  {shop.distance && <span className="text-xs text-gray-400 ml-1">· {shop.distance}</span>}
                </div>
                <Link href={`/shops/${shop.id}`}
                  className="flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline">
                  View Shop <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

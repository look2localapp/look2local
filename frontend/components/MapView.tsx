"use client";

import { MapPin, ExternalLink, Phone, MessageCircle, Navigation } from "lucide-react";

interface MapViewProps {
  lat: number;
  lng: number;
  shopName: string;
  address: string;
  googleMapLink: string;
  phone?: string;
  whatsapp?: string;
  height?: string;
}

// Uses OpenStreetMap iframe — FREE, no API key, no billing needed
export default function MapView({
  lat, lng, shopName, address, googleMapLink, phone, whatsapp, height = "320px"
}: MapViewProps) {
  const zoom = 16;
  const delta = 0.008;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`;

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Map iframe */}
      <div style={{ height }} className="relative">
        <iframe
          src={osmSrc}
          style={{ width: "100%", height: "100%", border: 0 }}
          loading="lazy"
          title={`Map showing location of ${shopName}`}
        />
      </div>

      {/* Shop info strip */}
      <div className="bg-white p-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900 truncate">{shopName}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3 text-orange-500 flex-shrink-0" />
              <span className="truncate">{address}</span>
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <a href={osmLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 py-2 rounded-xl text-xs transition-colors">
              <Navigation className="w-3.5 h-3.5" /> Directions
            </a>
            <a href={googleMapLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-2 rounded-xl text-xs transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Google Maps
            </a>
            {phone && (
              <a href={`tel:${phone}`}
                className="flex items-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 font-semibold px-3 py-2 rounded-xl text-xs transition-colors">
                <Phone className="w-3.5 h-3.5" /> Call
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

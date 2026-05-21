"use client";

import { GoogleMap, Marker, useLoadScript, InfoWindow } from "@react-google-maps/api";
import { useState, useCallback } from "react";
import { MapPin, ExternalLink, Phone, MessageCircle } from "lucide-react";

interface GoogleMapViewProps {
  lat: number;
  lng: number;
  shopName: string;
  address: string;
  googleMapLink: string;
  phone?: string;
  whatsapp?: string;
  zoom?: number;
  height?: string;
}

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  ],
};

export default function GoogleMapView({
  lat,
  lng,
  shopName,
  address,
  googleMapLink,
  phone,
  whatsapp,
  zoom = 15,
  height = "340px",
}: GoogleMapViewProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

  const [showInfo, setShowInfo] = useState(true);
  const center = { lat, lng };

  const onLoad = useCallback(() => {}, []);

  if (loadError) {
    return (
      <div className="w-full rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex flex-col items-center justify-center p-8 gap-4" style={{ height }}>
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
          <MapPin className="w-8 h-8 text-blue-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-gray-800 mb-1">{shopName}</p>
          <p className="text-xs text-gray-500 mb-3">{address}</p>
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg mb-3">
            ⚠️ Enable Google Maps billing at console.cloud.google.com to show embedded map
          </p>
        </div>
        <a href={googleMapLink} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-600 text-white font-semibold px-5 py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm shadow-sm">
          <MapPin className="w-4 h-4" /> Open in Google Maps <ExternalLink className="w-3.5 h-3.5 opacity-70" />
        </a>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center gap-3" style={{ height }}>
        <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading map…</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ height }}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={center}
        zoom={zoom}
        options={mapOptions}
        onLoad={onLoad}
      >
        <Marker
          position={center}
          onClick={() => setShowInfo(true)}
          title={shopName}
        />

        {showInfo && (
          <InfoWindow position={center} onCloseClick={() => setShowInfo(false)}>
            <div className="p-1 min-w-[180px]">
              <p className="font-bold text-gray-900 text-sm mb-1">{shopName}</p>
              <p className="text-xs text-gray-500 mb-2">{address}</p>
              <div className="flex gap-2">
                <a href={googleMapLink} target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center text-xs bg-blue-600 text-white font-semibold px-2 py-1.5 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3" /> Directions
                </a>
                {phone && (
                  <a href={`tel:${phone}`}
                    className="text-xs bg-gray-100 text-gray-700 font-semibold px-2 py-1.5 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                  </a>
                )}
                {whatsapp && (
                  <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer"
                    className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-1.5 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1">
                    <MessageCircle className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

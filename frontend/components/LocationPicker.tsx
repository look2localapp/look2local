"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, Search, X, ChevronDown, Check } from "lucide-react";

const AP_CITIES = [
  "Vijayawada, AP",
  "Visakhapatnam, AP",
  "Guntur, AP",
  "Tirupati, AP",
  "Nellore, AP",
  "Kurnool, AP",
  "Kakinada, AP",
  "Rajamahendravaram, AP",
  "Kadapa, AP",
  "Eluru, AP",
  "Ongole, AP",
  "Hyderabad, TS",
  "Warangal, TS",
  "Nizamabad, TS",
  "Chennai, TN",
  "Bengaluru, KA",
  "Mumbai, MH",
  "Delhi, DL",
  "Pune, MH",
  "Ahmedabad, GJ",
];

interface LocationPickerProps {
  onChange?: (location: string) => void;
}

export default function LocationPicker({ onChange }: LocationPickerProps) {
  const [location, setLocation] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [manualInput, setManualInput] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = typeof window !== "undefined" ? localStorage.getItem("l2l_location") : null;
    if (saved) setLocation(saved);
  }, []);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const save = (loc: string) => {
    localStorage.setItem("l2l_location", loc);
    setLocation(loc);
    setOpen(false);
    onChange?.(loc);
  };

  const detectGPS = () => {
    setDetecting(true);
    if (!navigator.geolocation) { save("Vijayawada, AP"); setDetecting(false); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        // Reverse geocode with free Nominatim API
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(r => r.json())
          .then(d => {
            const city = d.address?.city || d.address?.town || d.address?.village || "Vijayawada";
            const state = d.address?.state || "AP";
            const stateAbbr = STATE_ABBR[state] ?? state.slice(0, 2).toUpperCase();
            save(`${city}, ${stateAbbr}`);
          })
          .catch(() => save("Vijayawada, AP"))
          .finally(() => setDetecting(false));
      },
      () => { save("Vijayawada, AP"); setDetecting(false); }
    );
  };

  const submitManual = () => {
    const val = manualInput.trim();
    if (val.length >= 2) { save(val); setManualInput(""); }
  };

  const filtered = AP_CITIES.filter(c =>
    c.toLowerCase().includes(filterQuery.toLowerCase())
  );

  if (!mounted) return (
    <div className="h-5 w-40 bg-gray-100 animate-pulse rounded" />
  );

  return (
    <div className="relative" ref={dropRef}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-orange-600 transition-colors group max-w-xs"
      >
        <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0" />
        {location ? (
          <span className="truncate">
            Deliver to <span className="font-bold text-gray-900">{location}</span>
          </span>
        ) : (
          <span className="font-semibold text-orange-600">Set your location</span>
        )}
        <ChevronDown className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-9 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-bold text-gray-900 text-sm">Choose Delivery Location</h3>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* GPS option */}
            <button
              onClick={detectGPS}
              disabled={detecting}
              className="w-full flex items-center gap-3 bg-orange-50 hover:bg-orange-100 border border-orange-100 text-orange-700 font-bold px-4 py-3 rounded-xl text-sm transition-colors disabled:opacity-60 mb-3"
            >
              <Navigation className="w-4 h-4 flex-shrink-0" />
              {detecting ? "Detecting your location…" : "Use My Current Location"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-semibold">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Manual entry */}
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submitManual()}
                placeholder="Enter city name…"
                className="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 transition-colors"
              />
              <button
                onClick={submitManual}
                disabled={manualInput.trim().length < 2}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors"
              >
                Go
              </button>
            </div>
          </div>

          {/* City list */}
          <div className="p-3">
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                value={filterQuery}
                onChange={e => setFilterQuery(e.target.value)}
                placeholder="Search cities…"
                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs outline-none focus:border-orange-300"
              />
            </div>
            <p className="text-[10px] text-gray-400 font-semibold px-1 mb-1 uppercase tracking-wide">Popular Locations</p>
            <div className="max-h-48 overflow-y-auto space-y-0.5">
              {filtered.map(city => (
                <button key={city} onClick={() => save(city)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors text-left group">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-500 flex-shrink-0" />
                  <span className="text-sm text-gray-700 group-hover:text-orange-700">{city}</span>
                  {location === city && <Check className="w-3.5 h-3.5 text-green-500 ml-auto flex-shrink-0" />}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No cities found</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const STATE_ABBR: Record<string, string> = {
  "Andhra Pradesh": "AP",
  "Telangana": "TS",
  "Tamil Nadu": "TN",
  "Karnataka": "KA",
  "Maharashtra": "MH",
  "Delhi": "DL",
  "Gujarat": "GJ",
  "Rajasthan": "RJ",
  "Uttar Pradesh": "UP",
  "West Bengal": "WB",
  "Kerala": "KL",
  "Punjab": "PB",
  "Haryana": "HR",
  "Madhya Pradesh": "MP",
};

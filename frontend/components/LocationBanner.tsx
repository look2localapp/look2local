"use client";

import { useState, useEffect } from "react";
import { MapPin, X, Navigation } from "lucide-react";

export default function LocationBanner() {
  const [state, setState] = useState<"asking" | "granted" | "denied" | "hidden">("hidden");
  const [city, setCity] = useState("Hyderabad");

  useEffect(() => {
    const dismissed = localStorage.getItem("l2l_location_dismissed");
    const granted = localStorage.getItem("l2l_location_granted");
    if (granted) {
      setCity(localStorage.getItem("l2l_city") ?? "Hyderabad");
      setState("granted");
    } else if (!dismissed) {
      const timer = setTimeout(() => setState("asking"), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAllow = () => {
    setState("granted");
    localStorage.setItem("l2l_location_granted", "true");
    localStorage.setItem("l2l_city", "Vijayawada");
    setCity("Vijayawada");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {}, () => {});
    }
  };

  const handleDismiss = () => {
    setState("hidden");
    localStorage.setItem("l2l_location_dismissed", "true");
  };

  if (state === "hidden") return null;

  if (state === "asking") {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-0">
        <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={handleDismiss} />
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 mx-auto">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Navigation className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-extrabold text-gray-900 text-center mb-2">Allow Location Access</h3>
          <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
            Look2Local needs your location to show <strong>nearby shops</strong> and <strong>local deals</strong> in your area.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleAllow}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
            >
              <MapPin className="w-4 h-4" /> Allow Location Access
            </button>
            <button
              onClick={handleDismiss}
              className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 text-sm transition-colors"
            >
              Not Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state === "granted") {
    return (
      <div className="bg-blue-600 text-white px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <MapPin className="w-4 h-4 text-blue-200" />
            <span className="font-medium">
              Browsing nearby stores in <strong>{city}</strong>
            </span>
          </div>
          <button onClick={() => setState("hidden")} className="text-blue-200 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
}

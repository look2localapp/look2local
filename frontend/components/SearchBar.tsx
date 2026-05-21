"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, TrendingUp, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

const SUGGESTIONS = [
  "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16", "iPhone 15",
  "Samsung Galaxy S25 Ultra", "Samsung Galaxy S24",
  "MacBook Air M3", "MacBook Pro M4",
  "Sony PlayStation 5", "Sony 65\" 4K TV",
  "Apple AirPods Pro", "Samsung Buds 3 Pro",
  "OnePlus 13", "Realme GT 7 Pro",
  "Logitech MX Keys", "Dell XPS 15",
  "Nike Air Force 1", "Adidas Ultraboost",
  "LG OLED 55\"", "Dyson V15",
];

const TRENDING = ["iPhone 16", "PS5", "MacBook Air", "Samsung S25"];

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  large?: boolean;
}

export default function SearchBar({ placeholder = "Search mobiles, laptops, TVs…", className = "", large = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length >= 2) {
      const matches = SUGGESTIONS.filter(s => s.toLowerCase().includes(query.toLowerCase())).slice(0, 6);
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (term: string = query) => {
    if (!term.trim()) return;
    setFocused(false);
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
  };

  const showDropdown = focused && (query.length >= 2 ? suggestions.length > 0 : true);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div className={`relative flex items-center bg-white rounded-2xl shadow-lg border-2 transition-all duration-200 ${focused ? "border-blue-500 shadow-blue-100" : "border-transparent shadow-gray-200/80"}`}>
        <Search className={`absolute left-4 text-gray-400 flex-shrink-0 ${large ? "w-5 h-5" : "w-4 h-4"}`} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
          placeholder={placeholder}
          className={`w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400 ${large ? "pl-12 pr-24 py-4 text-base" : "pl-10 pr-20 py-3 text-sm"}`}
        />
        {query && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }} className="absolute right-20 text-gray-400 hover:text-gray-600 p-1">
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => handleSearch()}
          className={`absolute right-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors ${large ? "px-5 py-2.5 text-sm" : "px-4 py-2 text-xs"}`}
        >
          Search
        </button>
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {query.length < 2 && (
            <div className="px-4 pt-3 pb-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map((t) => (
                  <button key={t} onClick={() => { setQuery(t); handleSearch(t); }} className="text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors">
                    🔥 {t}
                  </button>
                ))}
              </div>
            </div>
          )}
          {suggestions.length > 0 && (
            <div className="py-2">
              {query.length >= 2 && <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-4 mb-1">Suggestions</p>}
              {suggestions.map((s) => (
                <button key={s} onClick={() => { setQuery(s); handleSearch(s); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-sm text-gray-800">
                    <span className="font-semibold">{s.slice(0, query.length)}</span>{s.slice(query.length)}
                  </span>
                  <Clock className="w-3.5 h-3.5 text-gray-300 ml-auto" />
                </button>
              ))}
            </div>
          )}
          <div className="border-t border-gray-50 px-4 py-2.5">
            <button onClick={() => handleSearch()} className="text-sm text-blue-600 font-semibold hover:underline flex items-center gap-1.5 w-full">
              <Search className="w-3.5 h-3.5" />
              Search for &ldquo;{query || "…"}&rdquo; →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

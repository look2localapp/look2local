"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, ChevronRight } from "lucide-react";

interface MasterProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  image?: string;
  description?: string;
  specifications?: Record<string, unknown>;
}

interface Props {
  onSelect: (product: MasterProduct) => void;
  placeholder?: string;
}

export default function MasterCatalogSearch({ onSelect, placeholder = "Search products (e.g. iPhone, Samsung TV)…" }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MasterProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/master-catalog/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products || []);
        setOpen(true);
      } catch { /* ignore */ }
      setLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSelect = (product: MasterProduct) => {
    onSelect(product);
    setQuery(product.name);
    setOpen(false);
  };

  const categoryColors: Record<string, string> = {
    Mobiles: "bg-blue-50 text-blue-600",
    Laptops: "bg-purple-50 text-purple-600",
    TVs: "bg-pink-50 text-pink-600",
    Cameras: "bg-amber-50 text-amber-600",
    SmartWatches: "bg-teal-50 text-teal-600",
    Gaming: "bg-indigo-50 text-indigo-600",
    HomeAppliances: "bg-green-50 text-green-600",
    Accessories: "bg-gray-50 text-gray-600",
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3.5 bg-white border-2 border-gray-200 rounded-2xl text-sm outline-none focus:border-blue-500 transition-all shadow-sm"
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {loading && (
        <div className="absolute right-10 top-1/2 -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {open && results.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto">
          <div className="p-2 bg-gray-50 border-b border-gray-100">
            <p className="text-xs text-gray-400 font-semibold px-2">{results.length} products found</p>
          </div>
          {results.map((product) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {product.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <Search className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm line-clamp-1">{product.name}</p>
                <p className="text-xs text-gray-400">{product.brand}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${categoryColors[product.category] || "bg-gray-50 text-gray-600"}`}>
                {product.category}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
            </button>
          ))}
        </div>
      )}

      {open && results.length === 0 && query.length >= 2 && !loading && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl p-4 text-center">
          <p className="text-sm text-gray-500">No products found for &ldquo;{query}&rdquo;</p>
          <p className="text-xs text-gray-400 mt-1">You can still enter product details manually below</p>
        </div>
      )}
    </div>
  );
}

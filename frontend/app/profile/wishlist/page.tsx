"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, ArrowLeft, ShoppingBag, Trash2, ExternalLink, Lock } from "lucide-react";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
    discount: number;
    images: string[];
    inStock: boolean;
    shop: { shop_name: string; id: string };
  };
}

export default function WishlistPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!isSignedIn) { router.push("/sign-in"); return; }
    fetch("/api/wishlist").then((r) => r.json()).then((d) => {
      setWishlist(d.wishlist || []);
      setLoading(false);
    });
  }, [isSignedIn, router]);

  const removeItem = async (productId: string) => {
    setRemoving(productId);
    await fetch("/api/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    setWishlist((prev) => prev.filter((i) => i.product.id !== productId));
    setRemoving(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F0F2F8] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-pink-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F0F2F8]">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] pt-8 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-300 hover:text-white mb-4 text-sm transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white fill-current" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white">Wishlist</h1>
              <p className="text-blue-300 text-sm">{wishlist.length} saved products</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-6 pb-10">
        {wishlist.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
            <div className="w-20 h-20 bg-pink-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-pink-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No saved products</h3>
            <p className="text-gray-500 text-sm mb-6">Save products you love and find them here later!</p>
            <button onClick={() => router.push("/search")}
              className="bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {wishlist.map(({ id, product }) => {
              const discountedPrice = product.price - (product.price * product.discount) / 100;
              return (
                <div key={id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="relative h-44 bg-gray-50">
                    {product.images?.[0] ? (
                      <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-gray-200" />
                      </div>
                    )}
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Out of Stock</span>
                      </div>
                    )}
                    {product.discount > 0 && (
                      <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-xs text-orange-600 font-semibold mb-1">{product.shop.shop_name}</p>
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2">{product.title}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg font-black text-gray-900">₹{discountedPrice.toLocaleString("en-IN")}</span>
                      {product.discount > 0 && (
                        <span className="text-xs text-gray-400 line-through">₹{product.price.toLocaleString("en-IN")}</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/shops/${product.shop.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors">
                        <Lock className="w-3.5 h-3.5" /> Lock Price
                      </Link>
                      <Link href={`/products/${product.id}`}
                        className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => removeItem(product.id)}
                        disabled={removing === product.id}
                        className="p-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

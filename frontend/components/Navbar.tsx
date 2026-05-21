"use client";

import Link from "next/link";
import { Store, Menu, X, Video, ShoppingBag, Search, User, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Show, UserButton } from "@clerk/nextjs";
import NotificationBell from "@/components/NotificationBell";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (searchVal.trim()) router.push(`/search?q=${encodeURIComponent(searchVal.trim())}`);
  };

  return (
    <nav suppressHydrationWarning className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 h-14">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg overflow-hidden relative border border-gray-100 flex items-center justify-center bg-white">
              <Image src="/logo.jpeg" alt="Look2Local" fill className="object-cover" />
            </div>
            <span className="font-heading font-extrabold text-lg text-gray-900 hidden sm:block">
              Look2<span className="text-orange-500">Local</span>
            </span>
          </Link>

          {/* Search — full center bar like Flipkart */}
          <div className="flex-1 hidden md:flex items-center max-w-2xl mx-auto">
            <div className="flex w-full border border-gray-200 rounded-lg overflow-hidden hover:border-orange-400 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="Search mobiles, laptops, TVs…"
                className="flex-1 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-white"
                suppressHydrationWarning
              />
              <button
                onClick={handleSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 text-sm font-bold transition-colors flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" /> Search
              </button>
            </div>
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-1 flex-shrink-0">
            <Link href="/shops"
              className="flex flex-col items-center px-3 py-1 text-gray-700 hover:text-orange-600 transition-colors group">
              <ShoppingBag className="w-4 h-4 mb-0.5 group-hover:text-orange-600" />
              <span className="text-[11px] font-semibold">Shops</span>
            </Link>
            <Link href="/reels"
              className="flex flex-col items-center px-3 py-1 text-gray-700 hover:text-orange-600 transition-colors group">
              <Video className="w-4 h-4 mb-0.5 group-hover:text-orange-600" />
              <span className="text-[11px] font-semibold">Reels</span>
            </Link>

            <div className="w-px h-6 bg-gray-200 mx-1" />

            <Link href="/shopkeeper/login"
              className="flex flex-col items-center px-3 py-1 text-gray-700 hover:text-orange-600 transition-colors group">
              <Store className="w-4 h-4 mb-0.5 group-hover:text-orange-600" />
              <span className="text-[11px] font-semibold">For Shops</span>
            </Link>

            {/* Auth — link to our custom pages */}
            <Show when="signed-out">
              <Link href="/sign-in"
                className="flex flex-col items-center px-3 py-1 text-gray-700 hover:text-orange-600 transition-colors group">
                <User className="w-4 h-4 mb-0.5 group-hover:text-orange-600" />
                <span className="text-[11px] font-semibold">Sign In</span>
              </Link>
              <Link href="/sign-up"
                className="flex flex-col items-center px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white transition-colors rounded-xl ml-1">
                <User className="w-4 h-4 mb-0.5" />
                <span className="text-[11px] font-semibold">Sign Up</span>
              </Link>
            </Show>

            <Show when="signed-in">
              <NotificationBell />
              <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} userProfileMode="modal" />
            </Show>
          </div>

          {/* Mobile right */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <button onClick={() => router.push("/search")}
              className="p-2 text-gray-600 hover:text-orange-600 rounded-lg transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Show when="signed-in">
              <NotificationBell />
              <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
            </Show>
            <Show when="signed-out">
              <Link href="/sign-in"
                className="p-2 text-gray-600 hover:text-orange-600 rounded-lg transition-colors">
                <User className="w-5 h-5" />
              </Link>
            </Show>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-600 hover:text-orange-600 rounded-lg transition-colors">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden absolute inset-x-0 top-14 bg-white border-b border-gray-100 shadow-lg z-40">
          {/* Mobile search */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { handleSearch(); setMenuOpen(false); }}}
                placeholder="Search products…"
                className="flex-1 px-3 py-2.5 text-sm outline-none"
                suppressHydrationWarning
              />
              <button onClick={() => { handleSearch(); setMenuOpen(false); }}
                className="bg-orange-500 text-white px-4 py-2.5 text-sm font-bold">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="px-4 pb-4 space-y-1">
            {[
              { href: "/shops", label: "Nearby Shops", icon: ShoppingBag },
              { href: "/reels", label: "Product Reels", icon: Video },
              { href: "/shopkeeper/login", label: "Shopkeeper Portal", icon: Store },
            ].map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 text-sm font-semibold text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors">
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-3 mt-2">
              <Show when="signed-out">
                <div className="flex gap-2">
                  <Link href="/sign-in" onClick={() => setMenuOpen(false)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl text-sm transition-colors text-center">
                    Sign In
                  </Link>
                  <Link href="/sign-up" onClick={() => setMenuOpen(false)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-sm transition-colors text-center">
                    Sign Up
                  </Link>
                </div>
              </Show>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

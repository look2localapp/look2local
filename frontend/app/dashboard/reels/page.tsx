"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  UploadCloud, Video, Play, CheckCircle2, Package,
  BarChart3, Settings, Store, ArrowLeft
} from "lucide-react";

const RECENT_REELS = [
  { id: "1", thumb: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=200&auto=format&fit=crop", caption: "Unboxing the new PS5! 🔥", views: "1.2K", time: "2 days ago" },
  { id: "2", thumb: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?q=80&w=200&auto=format&fit=crop", caption: "DualSense review — worth it? 🎮", views: "890", time: "5 days ago" },
];

const NAV = [
  { icon: BarChart3, label: "Overview", href: "/dashboard" },
  { icon: Package, label: "Products", href: "/dashboard/products" },
  { icon: Video, label: "Reels", href: "/dashboard/reels", active: true },
  { icon: Settings, label: "Settings", href: "/dashboard" },
];

export default function DashboardReelsPage() {
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);

  const handlePublish = () => {
    if (!caption.trim()) return;
    setUploading(true);
    setTimeout(() => { setUploading(false); setDone(true); setTimeout(() => setDone(false), 3000); }, 2000);
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-gray-100 hidden md:flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Tech Hub Electronics</p>
              <span className="text-[11px] font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded-md">✓ Verified</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV.map(({ icon: Icon, label, href, active }) => (
            <Link key={label} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? "bg-blue-50 text-blue-700" : "text-gray-600 hover:bg-gray-50"}`}>
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/dashboard" className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Upload Reels</h1>
            <p className="text-sm text-gray-500">Create short videos to engage nearby customers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Upload Form */}
          <div className="lg:col-span-2 space-y-5">
            {/* Upload Area */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-4">Video File</h2>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-12 flex flex-col items-center bg-gray-50 hover:bg-gray-100 hover:border-blue-300 transition-all cursor-pointer group">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform">
                  <UploadCloud className="w-7 h-7 text-blue-600" />
                </div>
                <p className="font-bold text-gray-800 mb-1">Click to upload video</p>
                <p className="text-sm text-gray-400 text-center">MP4 or WebM • Max 50MB • 9:16 ratio recommended</p>
              </div>
            </div>

            {/* Details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
              <h2 className="font-bold text-gray-900">Reel Details</h2>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Caption *</label>
                <textarea
                  rows={3}
                  placeholder="Describe your reel… #electronics #deals #hyderabad"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition-all"
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{caption.length}/200</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tag a Product</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all">
                  <option value="">Select from your inventory…</option>
                  <option>Sony PlayStation 5 Disc Edition (₹44,990)</option>
                  <option>DualSense Wireless Controller (₹5,200)</option>
                  <option>Apple AirPods Pro (₹21,500)</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">Tagged products show a "Lock Offer" button on the reel</p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handlePublish}
                  disabled={uploading || done}
                  className="flex items-center gap-2 px-7 py-3 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-70 rounded-xl transition-colors shadow-md shadow-blue-100 active:scale-[0.98]"
                >
                  {uploading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing…</>
                  ) : done ? (
                    <><CheckCircle2 className="w-4 h-4" /> Published!</>
                  ) : (
                    <><UploadCloud className="w-4 h-4" /> Publish Reel</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Recent Reels */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-600" /> Recent Reels
              </h2>
              <div className="space-y-4">
                {RECENT_REELS.map((reel) => (
                  <div key={reel.id} className="flex gap-3 group cursor-pointer">
                    <div className="w-16 h-24 bg-gray-900 rounded-xl overflow-hidden relative flex-shrink-0">
                      <Image src={reel.thumb} alt="" fill className="object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white/25 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1">{reel.caption}</p>
                      <p className="text-xs text-gray-400">{reel.views} views • {reel.time}</p>
                      <span className="mt-2 inline-block text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md w-max">
                        Product Tagged
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
              <h3 className="font-bold text-blue-900 text-sm mb-3">📱 Reel Tips</h3>
              <ul className="space-y-2">
                {["Keep videos under 60 seconds", "Film in vertical 9:16 format", "Show product clearly in first 3 seconds", "Add your price to the caption"].map((tip) => (
                  <li key={tip} className="text-xs text-blue-700 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

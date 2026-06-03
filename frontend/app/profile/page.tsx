"use client";

import { useEffect, useState, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  User, Phone, Mail, MapPin, Camera, Save, ArrowLeft,
  Navigation, Edit2, CheckCircle2, Ticket, Heart,
  ChevronRight, Bell
} from "lucide-react";

interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  profilePhoto?: string;
}

export default function CustomerProfilePage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!isSignedIn) { router.push("/sign-in"); return; }
    fetch("/api/customer/profile")
      .then((r) => r.json())
      .then((d) => {
        setProfile(d.profile);
        setForm(d.profile || {});
        setLoading(false);
      });
  }, [isSignedIn, router]);

  const handleGetLocation = () => {
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
          );
          const data = await res.json();
          const components = data.results?.[0]?.address_components || [];
          const city = components.find((c: { types: string[] }) => c.types.includes("locality"))?.long_name || "";
          const pincode = components.find((c: { types: string[] }) => c.types.includes("postal_code"))?.long_name || "";
          const address = data.results?.[0]?.formatted_address || "";
          setForm((f) => ({ ...f, latitude: lat, longitude: lng, address, city, pincode }));
        } catch {
          setForm((f) => ({ ...f, latitude: lat, longitude: lng }));
        }
        setGettingLocation(false);
      },
      () => setGettingLocation(false)
    );
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "profile");
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) setForm((f) => ({ ...f, profilePhoto: data.url }));
    } catch { /* ignore */ }
    setPhotoUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/customer/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, email: profile?.email || user?.emailAddresses?.[0]?.emailAddress }),
    });
    const data = await res.json();
    setProfile(data.profile);
    setForm(data.profile);
    setSaving(false);
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const displayPhoto = form.profilePhoto || user?.imageUrl;
  const displayName = form.name || user?.fullName || "Customer";

  return (
    <div className="min-h-screen bg-[#F0F2F8]">
      <div className="bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] pt-8 pb-24 px-4">
        <div className="max-w-2xl mx-auto">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-300 hover:text-white mb-4 transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl bg-white/10">
                {displayPhoto ? (
                  <Image src={displayPhoto} alt={displayName} width={96} height={96} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><User className="w-12 h-12 text-white/50" /></div>
                )}
              </div>
              {editMode && (
                <button onClick={() => fileRef.current?.click()} disabled={photoUploading}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-xl flex items-center justify-center shadow-lg transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </div>
            <h1 className="text-2xl font-extrabold text-white mb-1">{displayName}</h1>
            <p className="text-blue-300 text-sm">{profile?.email || user?.emailAddresses?.[0]?.emailAddress}</p>
            {!editMode && (
              <button onClick={() => setEditMode(true)}
                className="mt-4 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-4 py-2 rounded-xl text-sm mx-auto transition-all border border-white/20">
                <Edit2 className="w-3.5 h-3.5" /> Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-12 pb-10">
        {!editMode && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 mb-5 overflow-hidden">
            {[
              { icon: Ticket, label: "My Coupons", href: "/profile/coupons", color: "text-purple-600", bg: "bg-purple-50", desc: "View all coupons & savings" },
              { icon: Heart, label: "Wishlist", href: "/profile/wishlist", color: "text-pink-600", bg: "bg-pink-50", desc: "Saved products" },
              { icon: Bell, label: "Price Alerts", href: "/profile/alerts", color: "text-orange-600", bg: "bg-orange-50", desc: "Get notified on price drops" },
            ].map(({ icon: Icon, label, href, color, bg, desc }) => (
              <button key={label} onClick={() => router.push(href)}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bg}`}><Icon className={`w-5 h-5 ${color}`} /></div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-gray-900 text-sm">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            ))}
          </div>
        )}

        {editMode && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-5">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Edit Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={form.name || ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:bg-white transition-all" placeholder="Your full name" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" value={form.phone || ""} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:bg-white transition-all" placeholder="+91 9876543210" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                  <textarea value={form.address || ""} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} rows={2}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:bg-white transition-all resize-none" placeholder="Your full address" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">City</label>
                  <input type="text" value={form.city || ""} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:bg-white transition-all" placeholder="Vijayawada" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Pincode</label>
                  <input type="text" value={form.pincode || ""} onChange={(e) => setForm((f) => ({ ...f, pincode: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-orange-400 focus:bg-white transition-all" placeholder="520001" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">GPS Location</label>
                <button onClick={handleGetLocation} disabled={gettingLocation}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-sm font-semibold text-blue-700 transition-all">
                  <Navigation className={`w-4 h-4 ${gettingLocation ? "animate-spin" : ""}`} />
                  {gettingLocation ? "Getting location…" : form.latitude ? "Update My Location" : "Use My GPS Location"}
                </button>
                {form.latitude && (
                  <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Location set: {form.latitude.toFixed(4)}, {form.longitude?.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setEditMode(false); setForm(profile || {}); }}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-sm transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 text-white font-bold rounded-xl text-sm transition-all shadow-sm">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</>
                  : <><Save className="w-4 h-4" /> Save Profile</>}
              </button>
            </div>
          </div>
        )}

        {!editMode && profile && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="space-y-4">
              {[
                { icon: User, label: "Full Name", value: profile.name },
                { icon: Phone, label: "Phone", value: profile.phone || "Not set" },
                { icon: Mail, label: "Email", value: profile.email },
                { icon: MapPin, label: "Address", value: [profile.address, profile.city, profile.pincode].filter(Boolean).join(", ") || "Not set" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">{label}</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

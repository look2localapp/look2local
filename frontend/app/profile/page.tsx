"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { User, Phone, Mail, CheckCircle2, Edit3, Save, X, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [editing, setEditing] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  if (!isLoaded) return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center">
      <p className="text-gray-500">Please sign in to view your profile.</p>
    </div>
  );

  const savedPhone = user.unsafeMetadata?.phone as string | undefined;
  const displayPhone = savedPhone || "Not added yet";
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || "—";

  const startEdit = () => {
    setPhone(savedPhone?.replace("+91 ", "") || "");
    setName(fullName === "—" ? "" : fullName);
    setEditing(true);
    setSaved(false);
    setError("");
  };

  const handleSave = async () => {
    const cleaned = phone.replace(/\D/g, "").slice(0, 10);
    if (phone && cleaned.length < 10) { setError("Enter a valid 10-digit number."); return; }
    setSaving(true);
    setError("");
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          phone: cleaned ? `+91 ${cleaned}` : savedPhone,
          profileDismissed: true,
        },
        ...(name.trim() ? {
          firstName: name.trim().split(" ")[0],
          lastName: name.trim().split(" ").slice(1).join(" ") || undefined,
        } : {}),
      });
      setSaved(true);
      setEditing(false);
    } catch {
      setError("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-10 px-4">
      <div className="max-w-lg mx-auto space-y-4">

        {/* Header */}
        <div className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-2xl font-extrabold flex-shrink-0">
            {(user.firstName?.[0] ?? user.emailAddresses[0]?.emailAddress?.[0] ?? "?").toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-heading text-xl font-bold text-gray-900 truncate">{fullName}</h1>
            <p className="text-sm text-gray-500 truncate">{user.emailAddresses[0]?.emailAddress}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs text-blue-600 font-semibold">
                {user.emailAddresses[0]?.verification.status === "verified" ? "Email Verified" : "Email Unverified"}
              </span>
            </div>
          </div>
        </div>

        {/* Contact details */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-heading font-bold text-gray-900">Contact Details</h2>
            {!editing ? (
              <button onClick={startEdit}
                className="flex items-center gap-1.5 text-sm text-orange-600 font-semibold hover:text-orange-700 transition-colors">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            ) : (
              <button onClick={() => { setEditing(false); setError(""); }}
                className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="p-6 space-y-4">
            {/* Email — read-only */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 mb-0.5">Email</p>
                <p className="text-sm font-semibold text-gray-900">{user.emailAddresses[0]?.emailAddress}</p>
              </div>
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">Read-only</span>
            </div>

            {/* Name */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-4 h-4 text-orange-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 mb-0.5">Full Name</p>
                {editing ? (
                  <input type="text" value={name} onChange={e => setName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all" />
                ) : (
                  <p className="text-sm font-semibold text-gray-900">{fullName}</p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                <Phone className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-500 mb-0.5">
                  Phone Number
                  <span className="ml-1.5 text-gray-400 font-normal">(for deal contact only)</span>
                </p>
                {editing ? (
                  <div className="flex gap-2">
                    <span className="flex items-center px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 flex-shrink-0">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={e => { setError(""); setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); }}
                      placeholder="98765 43210"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    />
                  </div>
                ) : (
                  <p className={`text-sm font-semibold ${savedPhone ? "text-gray-900" : "text-gray-400 italic"}`}>
                    {displayPhone}
                  </p>
                )}
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2 rounded-xl flex items-center gap-1.5">
                <X className="w-3.5 h-3.5 flex-shrink-0" /> {error}
              </p>
            )}

            {/* Save button */}
            {editing && (
              <button onClick={handleSave} disabled={saving}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                {saving
                  ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><Save className="w-4 h-4" /> Save Changes</>}
              </button>
            )}

            {saved && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-4 py-3 rounded-xl text-sm text-green-700 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Changes saved!
              </div>
            )}
          </div>
        </div>

        {/* Info card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-700 leading-relaxed">
          <strong>🔒 Privacy note:</strong> Your phone number is only shared with shops when you lock a deal price. It is never used for SMS verification or authentication.
        </div>
      </div>
    </div>
  );
}

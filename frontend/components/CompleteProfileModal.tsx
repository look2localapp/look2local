"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { X, User, Phone, CheckCircle2, ArrowRight, Info } from "lucide-react";

export default function CompleteProfileModal() {
  const { isSignedIn, isLoaded, user } = useUser();
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  // Check if profile is incomplete once Clerk loads
  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    // Show only if phone hasn't been saved yet in user metadata
    const savedPhone = user.unsafeMetadata?.phone as string | undefined;
    const dismissed = user.unsafeMetadata?.profileDismissed as boolean | undefined;

    if (!savedPhone && !dismissed) {
      // Small delay so user sees the page first
      const t = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(t);
    }
  }, [isLoaded, isSignedIn, user]);

  if (!open || !user) return null;

  const dismiss = async () => {
    // Save "dismissed" so we don't show again
    await user.update({
      unsafeMetadata: {
        ...user.unsafeMetadata,
        profileDismissed: true,
      },
    }).catch(() => {});
    setOpen(false);
  };

  const handleSave = async () => {
    if (!phone.trim()) { setError("Please enter your phone number."); return; }

    // Basic Indian phone validation
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.length < 10) { setError("Enter a valid 10-digit phone number."); return; }

    setSaving(true);
    setError("");

    try {
      // Save to Clerk unsafeMetadata — purely for profile, NOT used for auth/OTP
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          phone: `+91 ${cleaned.slice(-10)}`,
          profileDismissed: true,
        },
        // Also update display name if provided
        ...(displayName.trim() ? { firstName: displayName.trim().split(" ")[0], lastName: displayName.trim().split(" ").slice(1).join(" ") || undefined } : {}),
      });
      setDone(true);
      setTimeout(() => setOpen(false), 1800);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
        onClick={dismiss}>
        <div
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 relative"
          onClick={e => e.stopPropagation()}
        >
          {/* Close */}
          <button onClick={dismiss}
            className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-4 h-4" />
          </button>

          {done ? (
            /* Success state */
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="font-heading text-xl font-bold text-gray-900 mb-1">Profile Complete!</h2>
              <p className="text-sm text-gray-500">You&apos;re all set to lock the best deals near you.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-orange-500" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-bold text-gray-900">Complete Your Profile</h2>
                  <p className="text-xs text-gray-500">Shops can contact you about your locked deals</p>
                </div>
              </div>

              {/* Info note */}
              <div className="flex gap-2 bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5 text-xs text-blue-700">
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>Your phone number is only shared with shops when you lock a deal. It&apos;s never used for login or OTP verification.</p>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="e.g. Deepika Kanulla"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Phone Number <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2">
                    {/* Country code prefix */}
                    <div className="flex items-center gap-1.5 px-3 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 flex-shrink-0">
                      🇮🇳 +91
                    </div>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={e => {
                        setError("");
                        // Allow only digits, max 10
                        const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                        setPhone(val);
                      }}
                      placeholder="98765 43210"
                      className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                    />
                  </div>
                  {error && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><X className="w-3 h-3" />{error}</p>}
                  <p className="text-xs text-gray-400 mt-1">Used only to contact you about locked deals</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Save Profile <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
                <button onClick={dismiss}
                  className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold rounded-xl text-sm transition-colors">
                  Skip
                </button>
              </div>

              <p className="text-center text-xs text-gray-400 mt-3">
                You can update this anytime from your profile
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

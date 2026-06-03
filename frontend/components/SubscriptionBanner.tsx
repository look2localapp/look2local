"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Clock, Crown, X } from "lucide-react";

interface Props {
  daysRemaining: number;
  isExpired: boolean;
  plan: string;
}

export default function SubscriptionBanner({ daysRemaining, isExpired, plan }: Props) {
  const router = useRouter();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || plan === "STANDARD") return null;

  const isUrgent = daysRemaining <= 5 || isExpired;

  if (!isExpired && daysRemaining > 10) return null; // Only show when < 10 days left

  return (
    <div className={`relative flex items-center gap-4 px-5 py-4 rounded-2xl mb-5 ${
      isExpired
        ? "bg-red-50 border border-red-200"
        : isUrgent
        ? "bg-orange-50 border border-orange-200"
        : "bg-blue-50 border border-blue-200"
    }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
        isExpired ? "bg-red-100" : isUrgent ? "bg-orange-100" : "bg-blue-100"
      }`}>
        {isExpired ? (
          <AlertTriangle className="w-5 h-5 text-red-600" />
        ) : (
          <Clock className={`w-5 h-5 ${isUrgent ? "text-orange-600" : "text-blue-600"}`} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`font-bold text-sm ${isExpired ? "text-red-900" : isUrgent ? "text-orange-900" : "text-blue-900"}`}>
          {isExpired ? "Your trial has expired!" : `Trial expires in ${daysRemaining} days`}
        </p>
        <p className={`text-xs mt-0.5 ${isExpired ? "text-red-700" : isUrgent ? "text-orange-700" : "text-blue-700"}`}>
          {isExpired
            ? "Your shop is now hidden from customers."
            : "Continue uninterrupted for only ₹150/month"}
        </p>
      </div>

      <button
        onClick={() => router.push("/shopkeeper/subscription")}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white flex-shrink-0 ${
          isExpired ? "bg-red-600 hover:bg-red-700" : isUrgent ? "bg-orange-500 hover:bg-orange-600" : "bg-blue-600 hover:bg-blue-700"
        } transition-colors`}
      >
        <Crown className="w-3.5 h-3.5" />
        {isExpired ? "Reactivate" : "Upgrade"}
      </button>

      <button
        onClick={() => setDismissed(true)}
        className="p-1 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

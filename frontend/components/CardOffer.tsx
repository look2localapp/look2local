"use client";

import { ShieldCheck } from "lucide-react";

const BANK_COLORS: Record<string, { bg: string; border: string; text: string; logo: string }> = {
  HDFC:  { bg: "bg-blue-50",   border: "border-blue-100",   text: "text-blue-800",   logo: "bg-blue-600" },
  SBI:   { bg: "bg-purple-50", border: "border-purple-100", text: "text-purple-800", logo: "bg-purple-600" },
  ICICI: { bg: "bg-orange-50", border: "border-orange-100", text: "text-orange-800", logo: "bg-orange-500" },
  AXIS:  { bg: "bg-rose-50",   border: "border-rose-100",   text: "text-rose-800",   logo: "bg-rose-600" },
  KOTAK: { bg: "bg-red-50",    border: "border-red-100",    text: "text-red-800",    logo: "bg-red-600" },
};

interface CardOfferProps {
  bankName: string;
  cardType: string;
  offerText: string;
  minAmount?: number;
  compact?: boolean;
}

export default function CardOffer({ bankName, cardType, offerText, minAmount, compact = false }: CardOfferProps) {
  const style = BANK_COLORS[bankName] ?? { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", logo: "bg-gray-500" };

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold border ${style.bg} ${style.border} ${style.text}`}>
        <span className={`w-4 h-4 rounded-sm ${style.logo} text-white flex items-center justify-center text-[9px] font-black flex-shrink-0`}>
          {bankName[0]}
        </span>
        {offerText}
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 p-3.5 rounded-xl border ${style.bg} ${style.border}`}>
      <div className={`w-10 h-10 rounded-xl ${style.logo} text-white flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm`}>
        {bankName.slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`text-xs font-bold uppercase tracking-wider ${style.text} opacity-70`}>{bankName}</span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500">{cardType}</span>
        </div>
        <p className={`text-sm font-semibold ${style.text}`}>{offerText}</p>
        {minAmount && (
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Min. purchase ₹{minAmount.toLocaleString("en-IN")}
          </p>
        )}
      </div>
    </div>
  );
}

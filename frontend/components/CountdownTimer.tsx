"use client";

import { useState, useEffect } from "react";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

interface CountdownTimerProps {
  expiresAt: Date | string;
  lockCode: string;
  compact?: boolean;
}

function pad(n: number) { return n.toString().padStart(2, "0"); }

export default function CountdownTimer({ expiresAt, lockCode, compact = false }: CountdownTimerProps) {
  const target = new Date(expiresAt).getTime();

  const calcRemaining = () => Math.max(0, target - Date.now());
  const [msLeft, setMsLeft] = useState(calcRemaining());

  useEffect(() => {
    const t = setInterval(() => setMsLeft(calcRemaining()), 1000);
    return () => clearInterval(t);
  }, [target]);

  const expired = msLeft === 0;
  const hours   = Math.floor(msLeft / 3_600_000);
  const mins    = Math.floor((msLeft % 3_600_000) / 60_000);
  const secs    = Math.floor((msLeft % 60_000) / 1000);

  const pct = Math.min(100, ((target - Date.now()) / (24 * 3_600_000)) * 100);
  const urgency = msLeft < 30 * 60_000; // under 30 min

  if (compact) {
    if (expired) return (
      <span className="text-xs font-semibold text-red-500 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" /> Expired
      </span>
    );
    return (
      <span className={`text-xs font-semibold flex items-center gap-1 ${urgency ? "text-orange-500" : "text-green-600"}`}>
        <Clock className="w-3 h-3" /> {pad(hours)}:{pad(mins)}:{pad(secs)}
      </span>
    );
  }

  if (expired) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
        <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
        <p className="font-bold text-red-700">Offer Expired</p>
        <p className="text-xs text-red-500 mt-1">Code <span className="font-mono font-bold">{lockCode}</span> is no longer valid</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-5 border ${urgency ? "bg-orange-50 border-orange-200" : "bg-green-50 border-green-100"}`}>
      <div className="flex items-center gap-2 mb-3">
        <Clock className={`w-4 h-4 ${urgency ? "text-orange-500" : "text-green-600"}`} />
        <p className="text-sm font-bold text-gray-800">
          {urgency ? "⚡ Offer expiring soon!" : "✅ Offer Active"}
        </p>
      </div>

      {/* Digit blocks */}
      <div className="flex items-center gap-2 mb-3">
        {[{ val: hours, label: "HRS" }, { val: mins, label: "MIN" }, { val: secs, label: "SEC" }].map(({ val, label }) => (
          <div key={label} className="flex flex-col items-center">
            <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-extrabold font-mono shadow-sm ${urgency ? "bg-orange-500 text-white" : "bg-white text-gray-900 border border-gray-100"}`}>
              {pad(val)}
            </div>
            <span className="text-[10px] text-gray-400 font-semibold mt-1">{label}</span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${urgency ? "bg-orange-500" : "bg-green-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1.5">
        Lock code: <span className="font-mono font-bold text-gray-700">{lockCode}</span>
      </p>
    </div>
  );
}

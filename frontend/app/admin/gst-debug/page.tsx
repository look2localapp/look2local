"use client";

import { useState } from "react";
import {
  ShieldCheck, Loader2, CheckCircle2, XCircle, AlertTriangle,
  AlertCircle, Building2, MapPin, Award, RefreshCw, Copy,
  ChevronDown, ChevronUp
} from "lucide-react";

interface RawResponse {
  [key: string]: unknown;
}

interface ParsedResult {
  success: boolean;
  gstNumber?: string;
  legalName?: string;
  tradeName?: string;
  taxType?: string;
  businessType?: string;
  gstStatus?: string;
  state?: string;
  district?: string;
  pincode?: string;
  principalAddress?: string;
  lastFilingStatus?: string;
  verificationDate?: string;
  gstVerified?: boolean;
  message?: string;
  invalidFormat?: boolean;
  apiUnavailable?: boolean;
}

export default function GSTDebugPage() {
  const [gstInput, setGstInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [parsed, setParsed] = useState<ParsedResult | null>(null);
  const [raw, setRaw] = useState<RawResponse | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<{ gst: string; status: string; ts: string }[]>([]);

  const verify = async () => {
    const gst = gstInput.trim().toUpperCase();
    if (!gst) return;

    setLoading(true);
    setParsed(null);
    setRaw(null);
    setShowRaw(false);

    try {
      const res = await fetch("/api/gst/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gstNumber: gst }),
      });
      const data = await res.json();
      setParsed(data as ParsedResult);
      setRaw(data as RawResponse);

      setHistory(prev => [
        { gst, status: data.success ? data.gstStatus || "OK" : "FAILED", ts: new Date().toLocaleTimeString() },
        ...prev.slice(0, 9),
      ]);
    } catch (err) {
      setParsed({ success: false, message: String(err) });
    } finally {
      setLoading(false);
    }
  };

  const copyRaw = () => {
    navigator.clipboard.writeText(JSON.stringify(raw, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">GST API Debug Console</h1>
              <p className="text-gray-400 text-sm">Inspect raw API responses from <code className="text-blue-400 bg-blue-500/10 px-1 py-0.5 rounded text-xs">gst-insights-api.p.rapidapi.com</code></p>
            </div>
          </div>
        </div>

        {/* Input */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 mb-6">
          <label className="block text-sm font-semibold text-gray-300 mb-2">GST Number</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={gstInput}
              onChange={e => setGstInput(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15))}
              onKeyDown={e => e.key === "Enter" && verify()}
              placeholder="e.g. 37ABCDE1234F1Z5"
              maxLength={15}
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm font-mono tracking-widest text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
            <button
              onClick={verify}
              disabled={loading || gstInput.length < 15}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-colors text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              {loading ? "Verifying…" : "Verify"}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2 font-mono">{gstInput.length}/15 characters</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Parsed Result */}
          <div className="lg:col-span-2 space-y-4">
            {parsed && (
              <div className={`rounded-2xl border p-6 ${
                parsed.success ? "bg-green-950/30 border-green-800/50" :
                parsed.apiUnavailable ? "bg-amber-950/30 border-amber-800/50" :
                "bg-red-950/30 border-red-800/50"
              }`}>
                <div className="flex items-center gap-3 mb-5">
                  {parsed.success
                    ? <CheckCircle2 className="w-5 h-5 text-green-400" />
                    : parsed.apiUnavailable
                    ? <AlertCircle className="w-5 h-5 text-amber-400" />
                    : parsed.invalidFormat
                    ? <AlertTriangle className="w-5 h-5 text-orange-400" />
                    : <XCircle className="w-5 h-5 text-red-400" />}
                  <h2 className="font-bold text-white">
                    {parsed.success
                      ? `✅ ${parsed.gstVerified ? "Verified & Active" : "Found but Not Active"}`
                      : `❌ ${parsed.message || "Verification Failed"}`}
                  </h2>
                </div>

                {parsed.success && (
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Legal / Business Name", value: parsed.legalName, full: true, icon: <Building2 className="w-3 h-3" /> },
                      { label: "Trade Name", value: parsed.tradeName },
                      { label: "GST Status", value: parsed.gstStatus, highlight: true },
                      { label: "Tax Type", value: parsed.taxType },
                      { label: "Business Type", value: parsed.businessType },
                      { label: "State", value: parsed.state },
                      { label: "District", value: parsed.district },
                      { label: "Pincode", value: parsed.pincode },
                      { label: "Last Filing Status", value: parsed.lastFilingStatus },
                      { label: "Verification Date", value: parsed.verificationDate ? new Date(parsed.verificationDate).toLocaleString() : undefined },
                      { label: "Principal Address", value: parsed.principalAddress, full: true, icon: <MapPin className="w-3 h-3" /> },
                    ].filter(f => f.value).map(({ label, value, full, icon, highlight }) => (
                      <div
                        key={label}
                        className={`bg-gray-900/60 rounded-xl p-3 border border-gray-700/50 ${full ? "col-span-2" : ""}`}
                      >
                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1 flex items-center gap-1">
                          {icon} {label}
                        </p>
                        <p className={`text-sm font-bold ${highlight && value?.toLowerCase() === "active" ? "text-green-400" : highlight ? "text-orange-400" : "text-white"}`}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Raw JSON */}
            {raw && (
              <div className="bg-gray-900 rounded-2xl border border-gray-800">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                  <button
                    onClick={() => setShowRaw(!showRaw)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-300 hover:text-white"
                  >
                    {showRaw ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    Raw API Response
                  </button>
                  <button
                    onClick={copyRaw}
                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? "Copied!" : "Copy JSON"}
                  </button>
                </div>
                {showRaw && (
                  <pre className="p-4 text-xs text-green-400 font-mono overflow-auto max-h-96 leading-relaxed">
                    {JSON.stringify(raw, null, 2)}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* History Panel */}
          <div className="space-y-4">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
              <h3 className="text-sm font-bold text-gray-300 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" /> Recent Lookups
              </h3>
              {history.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-4">No lookups yet</p>
              ) : (
                <div className="space-y-2">
                  {history.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-800/50 rounded-lg px-3 py-2 cursor-pointer hover:bg-gray-800"
                      onClick={() => { setGstInput(h.gst); }}
                    >
                      <div>
                        <p className="text-xs font-mono text-white">{h.gst}</p>
                        <p className="text-[10px] text-gray-500">{h.ts}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        h.status === "Active" ? "bg-green-500/10 text-green-400" :
                        h.status === "FAILED" ? "bg-red-500/10 text-red-400" :
                        "bg-orange-500/10 text-orange-400"
                      }`}>
                        {h.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* API Config */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
              <h3 className="text-sm font-bold text-gray-300 mb-3">API Configuration</h3>
              <div className="space-y-2 text-xs font-mono">
                <div className="bg-gray-800 rounded-lg p-2">
                  <p className="text-gray-500 mb-0.5">HOST</p>
                  <p className="text-blue-400 break-all">gst-insights-api.p.rapidapi.com</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-2">
                  <p className="text-gray-500 mb-0.5">ENDPOINT</p>
                  <p className="text-green-400">GET /getGSTDetailsUsingGST/:gstin</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-2">
                  <p className="text-gray-500 mb-0.5">RATE LIMIT</p>
                  <p className="text-amber-400">10 req/min per IP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

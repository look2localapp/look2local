"use client";

import { useState, useRef, useEffect } from "react";
import { Camera, Scan, X, Loader2, CheckCircle2, AlertTriangle, Keyboard } from "lucide-react";

interface ScannedProduct {
  name: string;
  brand: string;
  category: string;
  image?: string;
  barcode: string;
  description?: string;
}

interface Props {
  onScan: (product: ScannedProduct, barcode: string) => void;
  onClose: () => void;
}

export default function BarcodeScanner({ onScan, onClose }: Props) {
  const [mode, setMode] = useState<"camera" | "manual">("camera");
  const [manualBarcode, setManualBarcode] = useState("");
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (mode === "camera") {
      startCamera();
    }
    return () => { stopCamera(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      // Dynamically import @zxing/browser
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();

      if (videoRef.current) {
        reader.decodeFromVideoElement(videoRef.current, async (result) => {
          if (result) {
            const barcode = result.getText();
            stopCamera();
            await lookupBarcode(barcode);
          }
        }).catch(() => {});
      }
    } catch {
      setCameraError(true);
      setMode("manual");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const lookupBarcode = async (barcode: string) => {
    setScanning(true);
    setError(null);
    try {
      const res = await fetch(`/api/barcode/scan?barcode=${encodeURIComponent(barcode)}`);
      const data = await res.json();
      if (data.product) {
        onScan({ ...data.product, barcode }, barcode);
      } else {
        setError(`No product found for barcode: ${barcode}`);
      }
    } catch {
      setError("Failed to lookup barcode. Try manual entry.");
    }
    setScanning(false);
  };

  const handleManualSubmit = async () => {
    if (!manualBarcode.trim()) return;
    stopCamera();
    await lookupBarcode(manualBarcode.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
              <Scan className="w-4 h-4 text-blue-600" />
            </div>
            <span className="font-bold text-gray-900">Barcode Scanner</span>
          </div>
          <button onClick={() => { stopCamera(); onClose(); }}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode tabs */}
        <div className="flex gap-1 p-3 bg-gray-50 border-b border-gray-100">
          <button
            onClick={() => { setMode("camera"); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === "camera" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
          >
            <Camera className="w-4 h-4" /> Camera Scan
          </button>
          <button
            onClick={() => { setMode("manual"); stopCamera(); setError(null); }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${mode === "manual" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"}`}
          >
            <Keyboard className="w-4 h-4" /> Manual Entry
          </button>
        </div>

        <div className="p-5">
          {scanning && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-4">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
              <p className="text-blue-700 font-medium text-sm">Looking up product…</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-100 rounded-2xl p-4 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {mode === "camera" && !cameraError && !scanning && (
            <div className="text-center">
              <div className="relative bg-black rounded-2xl overflow-hidden mb-4 aspect-video">
                <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
                {/* Scanner overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-32 border-2 border-blue-400 rounded-xl relative">
                    <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-blue-400 rounded-tl" />
                    <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-blue-400 rounded-tr" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-blue-400 rounded-bl" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-blue-400 rounded-br" />
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-400/50 animate-pulse" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-500">Point the camera at a product barcode</p>
            </div>
          )}

          {(mode === "manual" || cameraError) && !scanning && (
            <div>
              {cameraError && (
                <div className="flex items-center gap-3 bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-4">
                  <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                  <p className="text-orange-700 text-sm">Camera not available. Please enter barcode manually.</p>
                </div>
              )}
              <label className="block text-sm font-semibold text-gray-700 mb-2">Enter Barcode Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleManualSubmit()}
                  placeholder="e.g. 8901234567890"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-mono outline-none focus:border-blue-400 transition-all"
                />
                <button
                  onClick={handleManualSubmit}
                  disabled={!manualBarcode.trim()}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Lookup
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Enter the barcode number printed on the product packaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

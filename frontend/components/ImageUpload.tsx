"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ImageUploadProps {
  type?: "shop_image" | "banner" | "product" | "reel";
  label?: string;
  hint?: string;
  aspectRatio?: "square" | "banner" | "product";
  onUpload?: (url: string, publicId: string) => void;
  existingUrl?: string;
}

type UploadState = "idle" | "uploading" | "success" | "error";

export default function ImageUpload({
  type = "product",
  label = "Upload Photo",
  hint = "JPG, PNG or WebP · Max 5MB",
  aspectRatio = "square",
  onUpload,
  existingUrl,
}: ImageUploadProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [previewUrl, setPreviewUrl] = useState<string>(existingUrl ?? "");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const heightClass =
    aspectRatio === "banner" ? "h-36" :
    aspectRatio === "product" ? "h-48" :
    "h-44";

  const upload = useCallback(async (file: File) => {
    setState("uploading");
    setProgress(0);
    setErrorMsg("");

    // Local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    // Fake progress (real progress not available in fetch)
    const progressInterval = setInterval(() => {
      setProgress((p) => (p < 85 ? p + 12 : p));
    }, 300);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      clearInterval(progressInterval);

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Upload failed");
      }

      setProgress(100);
      setPreviewUrl(data.url);
      setState("success");
      onUpload?.(data.url, data.publicId);
    } catch (err: unknown) {
      clearInterval(progressInterval);
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Upload failed");
      setPreviewUrl(existingUrl ?? "");
    }
  }, [type, onUpload, existingUrl]);

  const handleFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setState("error");
      setErrorMsg("Invalid file type. Use JPG, PNG, or WebP.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setState("error");
      setErrorMsg("File too large — max 5MB.");
      return;
    }
    upload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const borderColor =
    isDragging ? "border-blue-400 bg-blue-50" :
    state === "success" ? "border-green-400 bg-green-50/30" :
    state === "error" ? "border-red-300 bg-red-50/30" :
    "border-gray-200 hover:border-blue-300 hover:bg-gray-50";

  return (
    <div>
      {label && (
        <p className="text-sm font-semibold text-gray-700 mb-1.5">{label}</p>
      )}

      <div
        className={`relative w-full ${heightClass} rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden ${borderColor}`}
        onClick={() => state !== "uploading" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {/* Preview image */}
        {previewUrl && (
          <Image
            src={previewUrl}
            alt="Upload preview"
            fill
            className={`object-cover transition-opacity duration-300 ${state === "uploading" ? "opacity-50" : "opacity-100"}`}
          />
        )}

        {/* Uploading overlay */}
        {state === "uploading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <div className="w-32 bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 font-medium">Uploading…</p>
          </div>
        )}

        {/* Success overlay (brief) */}
        {state === "success" && (
          <div className="absolute top-2 right-2 bg-green-500 text-white p-1.5 rounded-full shadow-md">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        )}

        {/* Clear button */}
        {previewUrl && state !== "uploading" && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewUrl("");
              setState("idle");
              setProgress(0);
            }}
            className="absolute top-2 left-2 bg-gray-900/60 hover:bg-gray-900/80 text-white p-1.5 rounded-full transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Idle/Empty state */}
        {!previewUrl && state !== "uploading" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isDragging ? "bg-blue-100" : "bg-gray-100"}`}>
              <Upload className={`w-5 h-5 ${isDragging ? "text-blue-600" : "text-gray-400"}`} />
            </div>
            <p className="text-sm font-semibold text-gray-600 text-center">
              {isDragging ? "Drop to upload" : "Click or drag photo here"}
            </p>
            <p className="text-xs text-gray-400 text-center">{hint}</p>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>

      {/* Error message */}
      {state === "error" && errorMsg && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errorMsg}
        </p>
      )}

      {/* Success message */}
      {state === "success" && (
        <p className="mt-1.5 text-xs text-green-600 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" /> Photo uploaded to Cloudinary ✓
        </p>
      )}
    </div>
  );
}

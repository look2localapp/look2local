/**
 * POST /api/gst/verify
 * ─────────────────────────────────────────────────────────────────────────────
 * GST verification endpoint.
 * Calls gst-insights-api.p.rapidapi.com — server-side only (key never exposed).
 * Includes rate-limit logging for debug visibility.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { NextResponse } from "next/server";
import { verifyGSTNumber } from "@/lib/gstVerify";

// Simple in-memory rate limiter (per server restart, per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;         // max requests per window
const RATE_WINDOW_MS = 60_000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    console.warn(`[GST] Rate limit hit for IP: ${ip}`);
    return NextResponse.json(
      { success: false, message: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { gstNumber } = body as { gstNumber?: string };

    if (!gstNumber || typeof gstNumber !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid GST Number" },
        { status: 400 }
      );
    }

    if (gstNumber.length !== 15) {
      return NextResponse.json(
        { success: false, message: "Invalid GST Number" },
        { status: 400 }
      );
    }

    console.log(`[GST] Verifying: ${gstNumber} | IP: ${ip}`);

    const result = await verifyGSTNumber(gstNumber);

    if (!result.success) {
      const status = result.invalidFormat ? 400 : result.apiUnavailable ? 503 : 400;
      return NextResponse.json(result, { status });
    }

    console.log(`[GST] ✅ ${gstNumber} → ${result.gstStatus} | ${result.legalName}`);
    return NextResponse.json(result);

  } catch (err) {
    console.error("[/api/gst/verify] Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        apiUnavailable: true,
        message: "GST Verification Failed",
      },
      { status: 500 }
    );
  }
}

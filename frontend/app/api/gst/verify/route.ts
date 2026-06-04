/**
 * POST /api/gst/verify
 * ─────────────────────────────────────────────────────────────────────────────
 * Canonical GST verification endpoint (per spec).
 * Identical behaviour to /api/verify-gst — delegates to shared helper.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { NextResponse } from "next/server";
import { verifyGSTNumber } from "@/lib/gstVerify";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { gstNumber } = body as { gstNumber?: string };

    if (!gstNumber || typeof gstNumber !== "string") {
      return NextResponse.json(
        { success: false, message: "GST number is required." },
        { status: 400 }
      );
    }

    const result = await verifyGSTNumber(gstNumber);

    if (!result.success) {
      const status = result.invalidFormat ? 400 : result.apiUnavailable ? 503 : 400;
      return NextResponse.json(result, { status });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/gst/verify] Unexpected error:", err);
    return NextResponse.json(
      {
        success: false,
        apiUnavailable: true,
        message:
          "Unable to verify GST right now. Please upload GST Certificate for manual review.",
      },
      { status: 500 }
    );
  }
}

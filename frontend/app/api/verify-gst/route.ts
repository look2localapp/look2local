import axios from "axios";
import { NextResponse } from "next/server";

// Validate GST format: 15 chars e.g. 27AAPFU0939F1ZV
function isValidGSTFormat(gst: string) {
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(gst);
}

// Step 1 — Get Sandbox access token using api_key + api_secret
async function getSandboxToken(): Promise<string> {
  const res = await axios.post(
    "https://api.sandbox.co.in/authenticate",
    {},
    {
      headers: {
        "x-api-key": process.env.SANDBOX_API_KEY!,
        "x-api-secret": process.env.SANDBOX_SECRET_KEY!,
        "x-api-version": "1.0",
      },
      timeout: 8000,
    }
  );
  // Token is in res.data.data.access_token
  return res.data?.data?.access_token ?? res.data?.access_token;
}

// POST /api/verify-gst
// Body: { gstNumber: "27AAPFU0939F1ZV" }
export async function POST(req: Request) {
  try {
    const { gstNumber } = await req.json();

    if (!gstNumber || typeof gstNumber !== "string") {
      return NextResponse.json({ success: false, message: "GST number is required" }, { status: 400 });
    }

    const gst = gstNumber.trim().toUpperCase();

    if (!isValidGSTFormat(gst)) {
      return NextResponse.json({
        success: false,
        message: "Invalid GST format. Example: 37ABCDE1234F1Z5",
      }, { status: 400 });
    }

    // Step 1 — Authenticate and get token
    let token: string;
    try {
      token = await getSandboxToken();
    } catch (authErr) {
      console.error("Sandbox auth error:", authErr);
      return NextResponse.json({
        success: false,
        message: "Authentication with GST service failed. Check your API keys.",
      }, { status: 500 });
    }

    // Step 2 — Verify GST using token
    const response = await axios.get(
      `https://api.sandbox.co.in/gst/compliance/public/${gst}`,
      {
        headers: {
          authorization: token,          // No "Bearer" prefix
          "x-api-key": process.env.SANDBOX_API_KEY!,
          "x-api-version": "1.0",
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const d = response.data?.data ?? response.data;

    const businessName =
      d?.lgnm ||
      d?.business_name ||
      d?.tradeNam ||
      "Business Found";

    const gstStatus =
      d?.sts ||
      d?.status ||
      d?.gstin_status ||
      "Active";

    const stateCode = gst.slice(0, 2);
    const pan = gst.slice(2, 12);

    return NextResponse.json({
      success: true,
      gstNumber: gst,
      businessName,
      gstStatus,
      stateCode,
      pan,
    });

  } catch (error: unknown) {
    console.error("GST verify error:", error);

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const msg = error.response?.data?.message ?? error.message;

      if (status === 404) {
        return NextResponse.json({
          success: false,
          message: "GST number not found in government records",
        }, { status: 404 });
      }
      if (status === 401 || status === 403) {
        return NextResponse.json({
          success: false,
          message: "API key rejected — please rotate your Sandbox keys",
        }, { status: 500 });
      }
      return NextResponse.json({
        success: false,
        message: msg ?? "GST verification failed",
      }, { status: 500 });
    }

    return NextResponse.json({
      success: false,
      message: "GST verification failed. Please try again.",
    }, { status: 500 });
  }
}

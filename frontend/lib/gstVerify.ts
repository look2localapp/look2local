/**
 * lib/gstVerify.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Server-side only GST verification helper.
 * Uses RapidAPI "GST Verification API - Get Profile & Returns Data".
 * NEVER import this in client components — API key stays on the server.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Regex for valid GST format: 15 chars, e.g. 27AAPFU0939F1ZV */
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

export interface GSTVerifyResult {
  success: true;
  gstNumber: string;
  businessName: string;
  tradeName: string;
  legalName: string;
  gstStatus: string;           // "Active" | "Cancelled" | "Suspended" | …
  state: string;               // Derived from state code
  principalAddress: string;
  lastFilingStatus: string;    // Last return filing status
  gstVerified: boolean;        // true only if gstStatus === "Active"
  stateCode: string;
  pan: string;
}

export interface GSTVerifyError {
  success: false;
  message: string;
  invalidFormat?: boolean;
  apiUnavailable?: boolean;
}

export type GSTVerifyResponse = GSTVerifyResult | GSTVerifyError;

/** Map of 2-digit GST state codes to state names */
const STATE_CODE_MAP: Record<string, string> = {
  "01": "Jammu & Kashmir", "02": "Himachal Pradesh", "03": "Punjab",
  "04": "Chandigarh", "05": "Uttarakhand", "06": "Haryana",
  "07": "Delhi", "08": "Rajasthan", "09": "Uttar Pradesh",
  "10": "Bihar", "11": "Sikkim", "12": "Arunachal Pradesh",
  "13": "Nagaland", "14": "Manipur", "15": "Mizoram",
  "16": "Tripura", "17": "Meghalaya", "18": "Assam",
  "19": "West Bengal", "20": "Jharkhand", "21": "Odisha",
  "22": "Chhattisgarh", "23": "Madhya Pradesh", "24": "Gujarat",
  "25": "Daman & Diu", "26": "Dadra & Nagar Haveli", "27": "Maharashtra",
  "28": "Andhra Pradesh (Old)", "29": "Karnataka", "30": "Goa",
  "31": "Lakshadweep", "32": "Kerala", "33": "Tamil Nadu",
  "34": "Puducherry", "35": "Andaman & Nicobar Islands", "36": "Telangana",
  "37": "Andhra Pradesh", "38": "Ladakh", "97": "Other Territory",
  "99": "Centre Jurisdiction",
};

/** Extract state name from GST number prefix */
function getStateFromGST(gst: string): string {
  const code = gst.slice(0, 2);
  return STATE_CODE_MAP[code] || `State Code ${code}`;
}

/**
 * Extract last filing status from the API's filing records.
 * Returns the most recent non-null status or "Unknown".
 */
function extractLastFilingStatus(data: Record<string, unknown>): string {
  // RapidAPI may return filingStatus or returns[] array
  if (typeof data.lastFiling === "string") return data.lastFiling;
  if (typeof data.filing_status === "string") return data.filing_status;

  const returns = data.returns as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(returns) && returns.length > 0) {
    // Pick the most recent filing
    const sorted = [...returns].sort((a, b) => {
      const dateA = String(a.dof || a.returnPeriod || "");
      const dateB = String(b.dof || b.returnPeriod || "");
      return dateB.localeCompare(dateA);
    });
    const latest = sorted[0];
    return String(latest.status || latest.sts || "Unknown");
  }

  return "Unknown";
}

/**
 * Verify a GST number using RapidAPI.
 * This is a server-side-only function.
 */
export async function verifyGSTNumber(rawGST: string): Promise<GSTVerifyResponse> {
  const gst = rawGST.trim().toUpperCase();

  // ── 1. Format validation ─────────────────────────────────────────────────
  if (!gst || gst.length !== 15) {
    return {
      success: false,
      invalidFormat: true,
      message: "❌ Invalid GST Format — GST must be exactly 15 characters.",
    };
  }
  if (!GST_REGEX.test(gst)) {
    return {
      success: false,
      invalidFormat: true,
      message: "❌ Invalid GST Format — Example: 37ABCDE1234F1Z5",
    };
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.RAPIDAPI_HOST;

  if (!apiKey || !apiHost) {
    console.error("[GST] RAPIDAPI_KEY or RAPIDAPI_HOST env var is missing");
    return {
      success: false,
      apiUnavailable: true,
      message:
        "Unable to verify GST right now. Please upload GST Certificate for manual review.",
    };
  }

  // ── 2. Call RapidAPI ──────────────────────────────────────────────────────
  try {
    const url = `https://${apiHost}/gstin/${gst}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
      },
      // 8 second timeout
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error(`[GST] RapidAPI returned HTTP ${response.status} for ${gst}`);
      return {
        success: false,
        apiUnavailable: true,
        message:
          "Unable to verify GST right now. Please upload GST Certificate for manual review.",
      };
    }

    const raw = (await response.json()) as Record<string, unknown>;

    // ── 3. Extract only the required fields ──────────────────────────────────
    // RapidAPI field names may vary; handle common variants
    const businessName =
      String(raw.lgnm || raw.legal_name || raw.businessName || raw.tradeNam || "");
    const tradeName =
      String(raw.tradeNam || raw.trade_name || raw.tradeName || businessName);
    const legalName =
      String(raw.lgnm || raw.legal_name || raw.legalName || businessName);
    const gstStatus =
      String(raw.sts || raw.status || raw.gstStatus || raw.gstin_status || "");
    const principalAddress = extractPrincipalAddress(raw);
    const lastFilingStatus = extractLastFilingStatus(raw);
    const state = getStateFromGST(gst);
    const gstVerified = gstStatus.toLowerCase() === "active";

    return {
      success: true,
      gstNumber: gst,
      businessName,
      tradeName,
      legalName,
      gstStatus: gstStatus || "Unknown",
      state,
      principalAddress,
      lastFilingStatus,
      gstVerified,
      stateCode: gst.slice(0, 2),
      pan: gst.slice(2, 12),
    };
  } catch (err) {
    console.error("[GST] RapidAPI call failed:", err);
    return {
      success: false,
      apiUnavailable: true,
      message:
        "Unable to verify GST right now. Please upload GST Certificate for manual review.",
    };
  }
}

/** Extract principal address from various possible API response shapes */
function extractPrincipalAddress(data: Record<string, unknown>): string {
  // Try nested address objects first
  const pradr = data.pradr as Record<string, unknown> | undefined;
  if (pradr) {
    const addr = pradr.addr as Record<string, unknown> | undefined;
    if (addr) {
      const parts = [
        addr.bno, addr.flno, addr.bnm, addr.st, addr.loc,
        addr.dst, addr.stcd, addr.pncd,
      ].filter(Boolean);
      if (parts.length > 0) return parts.join(", ");
    }
    if (typeof pradr.adr === "string") return pradr.adr;
  }

  // Flat field fallbacks
  if (typeof data.principal_place_of_business === "string")
    return data.principal_place_of_business;
  if (typeof data.principalAddress === "string") return data.principalAddress;
  if (typeof data.address === "string") return data.address;

  return "";
}

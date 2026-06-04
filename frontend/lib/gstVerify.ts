/**
 * lib/gstVerify.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Server-side only GST verification helper.
 * API: GET https://gst-insights-api.p.rapidapi.com/getGSTDetailsUsingGST/:gstin
 *
 * ACTUAL API response shape (confirmed):
 * {
 *   success: true,
 *   data: [                        ← data is an ARRAY
 *     {
 *       legalName: "VARUN MOTORS PRIVATE LIMITED",
 *       taxType: "Regular",
 *       additionalAddress: [
 *         {
 *           address: {
 *             nature: "Retail Business, Service Provision, Office / Sale Office",
 *             stateCode: "Andhra Pradesh",   ← full state name (not a 2-digit code)
 *             dst: "VISAKHAPATNAM",
 *             pncd: "530003",
 *             ...
 *           }
 *         }
 *       ]
 *     }
 *   ]
 * }
 *
 * KEY RULE: success === true  →  gstVerified = true
 * There is NO status / sts / gstStatus field — do NOT check for "Active".
 * NEVER import this in client components — API key stays on the server.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Valid GST format: 15 chars, e.g. 37ABCDE1234F1Z5 */
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

/** Fallback: derive state from first 2 digits of GST when API doesn't provide it */
const STATE_PREFIX_MAP: Record<string, string> = {
  "01": "Jammu & Kashmir",   "02": "Himachal Pradesh", "03": "Punjab",
  "04": "Chandigarh",        "05": "Uttarakhand",      "06": "Haryana",
  "07": "Delhi",             "08": "Rajasthan",        "09": "Uttar Pradesh",
  "10": "Bihar",             "11": "Sikkim",           "12": "Arunachal Pradesh",
  "13": "Nagaland",          "14": "Manipur",          "15": "Mizoram",
  "16": "Tripura",           "17": "Meghalaya",        "18": "Assam",
  "19": "West Bengal",       "20": "Jharkhand",        "21": "Odisha",
  "22": "Chhattisgarh",      "23": "Madhya Pradesh",   "24": "Gujarat",
  "25": "Daman & Diu",       "26": "Dadra & Nagar Haveli", "27": "Maharashtra",
  "28": "Andhra Pradesh",    "29": "Karnataka",        "30": "Goa",
  "31": "Lakshadweep",       "32": "Kerala",           "33": "Tamil Nadu",
  "34": "Puducherry",        "35": "Andaman & Nicobar Islands", "36": "Telangana",
  "37": "Andhra Pradesh",    "38": "Ladakh",           "97": "Other Territory",
  "99": "Centre Jurisdiction",
};

// ── Public types ─────────────────────────────────────────────────────────────
export interface GSTVerifyResult {
  success: true;
  gstNumber: string;
  legalName: string;        // Legal / Business Name
  tradeName: string;        // Trade Name (may equal legalName)
  businessName: string;     // Alias for legalName (backward compat)
  taxType: string;          // Registration type e.g. "Regular"
  nature: string;           // Nature of business e.g. "Retail Business, Service Provision"
  businessType: string;     // Nature e.g. "Retail Business, Service Provision" (compat)
  gstStatus: string;        // Always "Active" when success=true
  gstVerified: boolean;     // Always true when success=true
  state: string;            // Full state name
  stateCode: string;        // State name (e.g. "Andhra Pradesh")
  district: string;         // dst from address
  pincode: string;          // pncd from address
  principalAddress: string; // Assembled from address parts
  lastFilingStatus: string; // If available, else ""
  pan: string;              // PAN embedded in GSTIN (chars 3–12)
  verificationDate: string; // ISO timestamp of verification
}

export interface GSTVerifyError {
  success: false;
  message: string;
  invalidFormat?: boolean;
  apiUnavailable?: boolean;
}

export type GSTVerifyResponse = GSTVerifyResult | GSTVerifyError;

// ── Address block type (gst-insights-api shape) ───────────────────────────────
interface APIAddress {
  nature?: string;    // business nature string
  stateCode?: string; // FULL state name (e.g. "Andhra Pradesh") — misleading field name
  dst?: string;       // district
  pncd?: string;      // pincode
  bno?: string;       // building/door number
  flno?: string;      // floor number
  bnm?: string;       // building name
  st?: string;        // street
  loc?: string;       // locality
  adr?: string;       // flat address string fallback
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildAddressString(addr: APIAddress): string {
  const parts = [addr.bno, addr.flno, addr.bnm, addr.st, addr.loc, addr.dst, addr.pncd]
    .filter(Boolean);
  if (parts.length > 0) return parts.join(", ");
  return addr.adr || "";
}

function fallbackStateFromGST(gst: string): string {
  return STATE_PREFIX_MAP[gst.slice(0, 2)] || `State (${gst.slice(0, 2)})`;
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function verifyGSTNumber(rawGST: string): Promise<GSTVerifyResponse> {
  const gst = rawGST.trim().toUpperCase();

  // 1. Format validation (client-safe: no API call yet)
  if (!gst || gst.length !== 15) {
    return {
      success: false,
      invalidFormat: true,
      message: "❌ Invalid GST Format — must be exactly 15 characters.",
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
  const apiHost = process.env.RAPIDAPI_HOST || "gst-insights-api.p.rapidapi.com";

  if (!apiKey) {
    console.error("[GST] RAPIDAPI_KEY is missing from environment");
    return {
      success: false,
      apiUnavailable: true,
      message: "Unable to verify GST right now. Please upload your GST Certificate for manual verification.",
    };
  }

  // 2. Call API
  try {
    const url = `https://${apiHost}/getGSTDetailsUsingGST/${gst}`;
    console.log(`[GST] → ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });

    console.log(`[GST] HTTP ${response.status} for GSTIN: ${gst}`);

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error(`[GST] Non-OK response (${response.status}): ${errText.slice(0, 300)}`);
      return {
        success: false,
        apiUnavailable: true,
        message: "Unable to verify GST right now. Please upload your GST Certificate for manual verification.",
      };
    }

    const raw = (await response.json()) as Record<string, unknown>;
    console.log(`[GST] Raw top-level keys: ${Object.keys(raw).join(", ")}`);

    // ── 3. Parse the actual response structure ─────────────────────────────
    //
    // The API returns:  { success: true, data: [ {...} ] }
    //   data is an ARRAY — we need data[0]
    //
    // ─── RULE: if raw.success === true  →  gstVerified = true ─────────────
    // There is NO sts / status / gstStatus field in this API.

    if (raw.success !== true) {
      // API returned success:false — GST not found or invalid
      console.warn(`[GST] API returned success=false for ${gst}`);
      return {
        success: false,
        message: "GST number not found in government records. Please check and try again.",
      };
    }

    // data can be an array or object — handle both
    const dataArr = Array.isArray(raw.data)
      ? (raw.data as Record<string, unknown>[])
      : raw.data
      ? [raw.data as Record<string, unknown>]
      : [raw]; // last resort: top-level fields

    const d = dataArr[0] ?? {};
    console.log(`[GST] data[0] keys: ${Object.keys(d).join(", ")}`);

    // ── Extract legalName ─────────────────────────────────────────────────
    const legalName = String(
      d.legalName || d.lgnm || d.legal_name || d.LegalName || ""
    ).trim();

    // ── Extract tradeName ─────────────────────────────────────────────────
    const tradeName = String(
      d.tradeName || d.tradeNam || d.trade_name || d.TradeName || legalName
    ).trim();

    // ── Extract taxType (registration type) ───────────────────────────────
    const taxType = String(
      d.taxType || d.taxPayerType || d.taxpayerType || d.dty || ""
    ).trim();

    // ── Extract principalAddress / additionalAddress ──────────────────────
    //    nature     → business type
    //    stateCode  → full state name (API uses this misleading name)
    //    dst        → district
    //    pncd       → pincode
    const additionalArr = Array.isArray(d.additionalAddress)
      ? (d.additionalAddress as Array<{ address?: APIAddress; nature?: string }>)
      : [];

    const principalAddrBlock = (d.principalAddress as { address?: APIAddress; nature?: string }) ?? {};
    const firstAddr: APIAddress = principalAddrBlock.address || additionalArr[0]?.address || {};

    // nature = business type string
    const businessType = String(
      principalAddrBlock.nature ||
      additionalArr[0]?.nature ||
      (Array.isArray(d.natureOfBusinessActivity) ? d.natureOfBusinessActivity.join(", ") : "") ||
      firstAddr.nature ||
      d.nature ||
      d.businessType ||
      ""
    ).trim();

    // stateCode field actually holds the full state name (e.g. "Andhra Pradesh")
    const stateFromAPI = String(firstAddr.stateCode || d.stateCode || "").trim();
    const state = stateFromAPI || fallbackStateFromGST(gst);

    const district = String(firstAddr.dst || d.district || "").trim();
    const pincode  = String(firstAddr.pncd || d.pincode || "").trim();
    const principalAddress = buildAddressString(firstAddr);

    // ── gstVerified: TRUE whenever success === true ───────────────────────
    // This API does NOT return an inactive/cancelled status.
    // If success=true, the GSTIN is valid and verified.
    const gstVerified = true;
    const gstStatus = "Active"; // inferred from success=true

    console.log(
      `[GST] ✅ Verified: ${gst} | ${legalName} | ${taxType} | ${businessType} | ${state}`
    );

    return {
      success: true,
      gstNumber: gst,
      legalName,
      tradeName,
      businessName: legalName, // compat alias
      taxType,
      nature: businessType,
      businessType,
      gstStatus,
      gstVerified,
      state,
      stateCode: state,
      district,
      pincode,
      principalAddress,
      lastFilingStatus: "",    // not returned by this API
      pan: gst.slice(2, 12),
      verificationDate: new Date().toISOString(),
    };

  } catch (err) {
    console.error("[GST] API call threw:", err);
    return {
      success: false,
      apiUnavailable: true,
      message: "Unable to verify GST right now. Please upload your GST Certificate for manual verification.",
    };
  }
}

/**
 * lib/gstVerify.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Server-side only GST verification helper.
 * API: GET https://gst-insights-api.p.rapidapi.com/getGSTDetailsUsingGST/:gst
 *
 * NEVER import this in client components — API key stays on the server.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Valid GST format: 15 chars e.g. 37ABCDE1234F1Z5 */
const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

// ── State code → Name map ────────────────────────────────────────────────────
const STATE_CODE_MAP: Record<string, string> = {
  "01": "Jammu & Kashmir",   "02": "Himachal Pradesh", "03": "Punjab",
  "04": "Chandigarh",        "05": "Uttarakhand",      "06": "Haryana",
  "07": "Delhi",             "08": "Rajasthan",        "09": "Uttar Pradesh",
  "10": "Bihar",             "11": "Sikkim",           "12": "Arunachal Pradesh",
  "13": "Nagaland",          "14": "Manipur",          "15": "Mizoram",
  "16": "Tripura",           "17": "Meghalaya",        "18": "Assam",
  "19": "West Bengal",       "20": "Jharkhand",        "21": "Odisha",
  "22": "Chhattisgarh",      "23": "Madhya Pradesh",   "24": "Gujarat",
  "25": "Daman & Diu",       "26": "Dadra & Nagar Haveli", "27": "Maharashtra",
  "28": "Andhra Pradesh (Old)", "29": "Karnataka",     "30": "Goa",
  "31": "Lakshadweep",       "32": "Kerala",           "33": "Tamil Nadu",
  "34": "Puducherry",        "35": "Andaman & Nicobar Islands", "36": "Telangana",
  "37": "Andhra Pradesh",    "38": "Ladakh",           "97": "Other Territory",
  "99": "Centre Jurisdiction",
};

function getStateFromCode(code: string): string {
  return STATE_CODE_MAP[code] || `State (${code})`;
}
function getStateFromGST(gst: string): string {
  return getStateFromCode(gst.slice(0, 2));
}

// ── Public types ─────────────────────────────────────────────────────────────
export interface GSTVerifyResult {
  success: true;
  gstNumber: string;
  legalName: string;       // legalName from API
  tradeName: string;       // tradeName / tradeNam
  businessName: string;    // same as legalName (for compat)
  taxType: string;         // taxPayerType  e.g. "Regular"
  businessType: string;    // natureOfBusiness e.g. "Retail Business"
  gstStatus: string;       // "Active" | "Cancelled" | "Suspended"
  gstVerified: boolean;    // true only if status === "Active"
  state: string;           // decoded state name
  stateCode: string;       // 2-digit code from GST prefix
  district: string;        // from additionalAddress[0].address.dst
  pincode: string;         // from additionalAddress[0].address.pncd
  principalAddress: string;// built from address parts
  lastFilingStatus: string;
  pan: string;
  verificationDate: string; // ISO date string
}

export interface GSTVerifyError {
  success: false;
  message: string;
  invalidFormat?: boolean;
  apiUnavailable?: boolean;
}

export type GSTVerifyResponse = GSTVerifyResult | GSTVerifyError;

// ── Address helpers ───────────────────────────────────────────────────────────

interface AddressBlock {
  bno?: string; flno?: string; bnm?: string;
  st?: string; loc?: string; dst?: string;
  stcd?: string; pncd?: string; adr?: string;
}

function buildAddressString(addr: AddressBlock): string {
  const parts = [addr.bno, addr.flno, addr.bnm, addr.st, addr.loc, addr.dst]
    .filter(Boolean);
  if (addr.stcd) parts.push(addr.stcd);
  if (addr.pncd) parts.push(addr.pncd);
  if (parts.length > 0) return parts.join(", ");
  return addr.adr || "";
}

function extractFromAdditionalAddress(
  additional: Array<{ address?: AddressBlock }> | undefined
): { district: string; pincode: string; principalAddress: string } {
  const first = additional?.[0]?.address;
  if (!first) return { district: "", pincode: "", principalAddress: "" };
  return {
    district: first.dst || "",
    pincode: first.pncd || "",
    principalAddress: buildAddressString(first),
  };
}

function extractLastFilingStatus(data: Record<string, unknown>): string {
  if (typeof data.lastFiling === "string") return data.lastFiling;
  if (typeof data.filing_status === "string") return data.filing_status;
  const returns = data.returns as Array<Record<string, unknown>> | undefined;
  if (Array.isArray(returns) && returns.length > 0) {
    const sorted = [...returns].sort((a, b) =>
      String(b.dof || b.returnPeriod || "").localeCompare(String(a.dof || a.returnPeriod || ""))
    );
    return String(sorted[0].status || sorted[0].sts || "Unknown");
  }
  return "Unknown";
}

// ── Main export ───────────────────────────────────────────────────────────────
export async function verifyGSTNumber(rawGST: string): Promise<GSTVerifyResponse> {
  const gst = rawGST.trim().toUpperCase();

  // 1. Format validation
  if (!gst || gst.length !== 15) {
    return { success: false, invalidFormat: true, message: "❌ Invalid GST Format — must be exactly 15 characters." };
  }
  if (!GST_REGEX.test(gst)) {
    return { success: false, invalidFormat: true, message: "❌ Invalid GST Format — Example: 37ABCDE1234F1Z5" };
  }

  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.RAPIDAPI_HOST || "gst-insights-api.p.rapidapi.com";

  if (!apiKey) {
    console.error("[GST] RAPIDAPI_KEY is missing from environment");
    return { success: false, apiUnavailable: true, message: "Unable to verify GST right now. Upload GST Certificate for manual verification." };
  }

  // 2. Call gst-insights-api (/getGSTDetailsUsingGST/:gst — GET request)
  try {
    const url = `https://${apiHost}/getGSTDetailsUsingGST/${gst}`;
    console.log(`[GST] Calling: ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(10000),
    });

    console.log(`[GST] HTTP ${response.status} for ${gst}`);

    if (!response.ok) {
      const text = await response.text().catch(() => "");
      console.error(`[GST] API error body: ${text.slice(0, 300)}`);
      return { success: false, apiUnavailable: true, message: "Unable to verify GST right now. Upload GST Certificate for manual verification." };
    }

    const raw = (await response.json()) as Record<string, unknown>;
    console.log(`[GST] Raw response keys: ${Object.keys(raw).join(", ")}`);

    // 3. Map gst-insights-api response fields
    //    The API returns: { success, data: { legalName, tradeNam, sts, taxPayerType,
    //    natureOfBusiness, additionalAddress: [{address:{dst,pncd,...}}], pradr, ... } }
    const dataObj = (raw.data ?? raw) as Record<string, unknown>;

    const legalName   = String(dataObj.legalName  || dataObj.lgnm        || dataObj.legal_name  || "");
    const tradeName   = String(dataObj.tradeNam   || dataObj.tradeName    || dataObj.trade_name  || legalName);
    const gstStatus   = String(dataObj.sts        || dataObj.status       || dataObj.gstStatus   || "");
    const taxType     = String(dataObj.taxPayerType || dataObj.taxType    || dataObj.taxpayerType || "");
    const businessType = String(
      (dataObj.natureOfBusiness as string[])?.join(", ") ||
      dataObj.businessType || dataObj.business_type || ""
    );

    // Address: prefer additionalAddress[0].address, fall back to pradr
    const additional = dataObj.additionalAddress as Array<{ address?: AddressBlock }> | undefined;
    const pradr = dataObj.pradr as { addr?: AddressBlock; adr?: string } | undefined;

    let district = "";
    let pincode = "";
    let principalAddress = "";

    if (additional?.[0]?.address) {
      const r = extractFromAdditionalAddress(additional);
      district = r.district;
      pincode = r.pincode;
      principalAddress = r.principalAddress;
    } else if (pradr?.addr) {
      district = pradr.addr.dst || "";
      pincode = pradr.addr.pncd || "";
      principalAddress = buildAddressString(pradr.addr);
    } else if (typeof pradr?.adr === "string") {
      principalAddress = pradr.adr;
    }

    // State: try additionalAddress[0].address.stcd, then GST prefix
    const stateCodeFromAPI =
      (additional?.[0]?.address as AddressBlock)?.stcd ||
      (pradr?.addr as AddressBlock)?.stcd || "";
    const stateCode = gst.slice(0, 2);
    const state = stateCodeFromAPI
      ? getStateFromCode(stateCodeFromAPI)
      : getStateFromGST(gst);

    const lastFilingStatus = extractLastFilingStatus(dataObj);
    const gstVerified = gstStatus.toLowerCase() === "active";

    return {
      success: true,
      gstNumber: gst,
      legalName,
      tradeName,
      businessName: legalName,
      taxType,
      businessType,
      gstStatus: gstStatus || "Unknown",
      gstVerified,
      state,
      stateCode,
      district,
      pincode,
      principalAddress,
      lastFilingStatus,
      pan: gst.slice(2, 12),
      verificationDate: new Date().toISOString(),
    };
  } catch (err) {
    console.error("[GST] API call failed:", err);
    return { success: false, apiUnavailable: true, message: "Unable to verify GST right now. Upload GST Certificate for manual verification." };
  }
}

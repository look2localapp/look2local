import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.mobileapi.dev/devices/search?name=${encodeURIComponent(query)}&key=${process.env.MOBILE_API_KEY}`);
    
    if (!res.ok) {
      throw new Error("Failed to fetch from MobileAPI.dev");
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Product Search Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 });
  }
}

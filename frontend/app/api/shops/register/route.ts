import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import crypto from "crypto";

// POST /api/shops/register — create a shop and shopkeeper
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      shop_name, owner_name, phone, whatsapp, email, password,
      category, address, landmark, google_map_link, city, pin,
      opening_time, closing_time, delivery_available,
      shop_image, banner_image,
      gst_number, gst_verified, business_name, gst_status,
      legal_name, trade_name, tax_type, business_type, aadhaar_verified,
      principal_address, state, district, pincode, last_filing_status, verification_date
    } = body;

    // Validate required fields
    if (!shop_name || !owner_name || !phone || !email || !password || !address || !google_map_link || !category) {
      return NextResponse.json(
        { success: false, message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Check if this email already exists
    let shopkeeper = await prisma.shopkeeper.findUnique({
      where: { email },
    });

    if (shopkeeper) {
      return NextResponse.json(
        { success: false, message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Create a unique ID for the shopkeeper
    const shopkeeperId = crypto.randomUUID();

    // Create the Shopkeeper record
    shopkeeper = await prisma.shopkeeper.create({
      data: {
        id: shopkeeperId,
        email: email,
        passwordHash: password, // In production, hash this with bcrypt!
      },
    });

    const opening_hours = `${opening_time ?? "10:00"} AM - ${closing_time ?? "9:00"} PM`;

    // Create the shop
    const shop = await prisma.shop.create({
      data: {
        shop_name,
        owner_name,
        phone,
        whatsapp: whatsapp ?? null,
        address: `${address}${landmark ? ", " + landmark : ""}${city ? ", " + city : ""}${pin ? " - " + pin : ""}`,
        landmark: landmark ?? null,
        google_map_link,
        shop_image: shop_image ?? "",
        banner_image: banner_image ?? "",
        category,
        opening_hours,
        delivery_available: delivery_available ?? false,
        verified: gst_verified ?? false,
        gst_number: gst_number ?? null,
        gst_verified: gst_verified ?? false,
        business_name: business_name ?? null,
        gst_status: gst_status ?? null,
        legal_name: legal_name ?? null,
        trade_name: trade_name ?? null,
        business_type: business_type ?? null,
        aadhaar_verified: aadhaar_verified ?? false,
        principal_address: principal_address ?? null,
        state: state ?? null,
        district: district ?? null,
        pincode: pincode ?? null,
        tax_type: tax_type ?? null,
        last_filing_status: last_filing_status ?? null,
        verification_date: verification_date ? new Date(verification_date) : null,
        shopkeeperId: shopkeeperId,
      },
    });

    // Set a simple cookie session
    const cookieStore = await cookies();
    cookieStore.set("shopkeeper_session", shopkeeperId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({ success: true, shopId: shop.id });
  } catch (error) {
    console.error("Shop registration error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create shop. Please try again." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST /api/seed — populate the database with demo data
// Only runs in development. Call once from browser or curl.
export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Seeding not allowed in production" }, { status: 403 });
  }

  try {
    // Clear existing data
    await prisma.lockedOffer.deleteMany();
    await prisma.reel.deleteMany();
    await prisma.cardOffer.deleteMany();
    await prisma.product.deleteMany();
    await prisma.shop.deleteMany();
    await prisma.shopkeeper.deleteMany();
    await prisma.user.deleteMany();

    // Create shopkeeper 1
    const sk1 = await prisma.shopkeeper.create({
      data: { email: "techhub@look2local.in", passwordHash: "hashed_demo_password" },
    });

    // Create shopkeeper 2
    const sk2 = await prisma.shopkeeper.create({
      data: { email: "sneakerdrop@look2local.in", passwordHash: "hashed_demo_password" },
    });

    // Create shopkeeper 3
    const sk3 = await prisma.shopkeeper.create({
      data: { email: "iworld@look2local.in", passwordHash: "hashed_demo_password" },
    });

    // Create Shop 1
    const shop1 = await prisma.shop.create({
      data: {
        shop_name: "Tech Hub Electronics",
        owner_name: "Rajesh Kumar",
        phone: "+91 98765 43210",
        address: "Shop No. 42, Panjagutta Complex, Banjara Hills",
        landmark: "Near GVK Mall, opposite HDFC Bank",
        google_map_link: "https://maps.google.com/?q=Banjara+Hills+Hyderabad",
        shop_image: "https://images.unsplash.com/photo-1550009158-9effb619a6c4?q=80&w=800",
        banner_image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200",
        category: "Electronics & Gadgets",
        opening_hours: "10:00 AM – 9:00 PM",
        verified: true,
        delivery_available: true,
        shopkeeperId: sk1.id,
      },
    });

    // Products for Shop 1
    const p1 = await prisma.product.create({
      data: {
        title: "Sony PlayStation 5 Disc Edition",
        description: "Next-gen gaming console with 4K gaming and ultra-fast SSD",
        price: 49990,
        discount: 10,
        images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=600"],
        inStock: true,
        stock: 12,
        shopId: shop1.id,
      },
    });

    await prisma.cardOffer.createMany({
      data: [
        { bank_name: "HDFC", card_type: "Credit Card", offer_text: "10% instant discount up to ₹5,000", min_amount: 20000, productId: p1.id },
        { bank_name: "SBI", card_type: "Debit Card", offer_text: "₹2,000 cashback on orders above ₹20,000", min_amount: 20000, productId: p1.id },
        { bank_name: "ICICI", card_type: "EMI", offer_text: "No Cost EMI from ₹1,499/month", min_amount: 0, productId: p1.id },
      ],
    });

    const p2 = await prisma.product.create({
      data: {
        title: "Apple AirPods Pro (2nd Gen)",
        description: "Active noise cancellation, Adaptive Transparency, Personalized Spatial Audio",
        price: 24900,
        discount: 14,
        images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?q=80&w=600"],
        inStock: true,
        stock: 8,
        shopId: shop1.id,
      },
    });

    await prisma.cardOffer.createMany({
      data: [
        { bank_name: "HDFC", card_type: "Credit Card", offer_text: "10% off up to ₹3,000", min_amount: 10000, productId: p2.id },
        { bank_name: "AXIS", card_type: "Credit Card", offer_text: "5% cashback up to ₹2,000", min_amount: 5000, productId: p2.id },
      ],
    });

    const p3 = await prisma.product.create({
      data: {
        title: "iPhone 16 Pro Max 256GB Natural Titanium",
        description: "A18 Pro chip, 48MP Fusion camera, 5x Optical Zoom, Action button",
        price: 134900,
        discount: 4,
        images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600"],
        inStock: true,
        stock: 5,
        shopId: shop1.id,
      },
    });

    await prisma.cardOffer.createMany({
      data: [
        { bank_name: "HDFC", card_type: "Credit Card", offer_text: "10% off up to ₹5,000", min_amount: 50000, productId: p3.id },
        { bank_name: "SBI", card_type: "Debit Card", offer_text: "₹3,000 cashback", min_amount: 100000, productId: p3.id },
        { bank_name: "ICICI", card_type: "EMI", offer_text: "No Cost EMI from ₹10,825/month", min_amount: 0, productId: p3.id },
      ],
    });

    // Create Shop 2
    const shop2 = await prisma.shop.create({
      data: {
        shop_name: "The Sneaker Drop",
        owner_name: "Karan Singh",
        phone: "+91 90123 45678",
        address: "2nd Floor, Inorbit Mall, Madhapur, HITEC City",
        landmark: "Next to Food Court",
        google_map_link: "https://maps.google.com/?q=Inorbit+Mall+Hyderabad",
        shop_image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?q=80&w=800",
        banner_image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200",
        category: "Footwear & Fashion",
        opening_hours: "11:00 AM – 10:00 PM",
        verified: false,
        delivery_available: false,
        shopkeeperId: sk2.id,
      },
    });

    const p4 = await prisma.product.create({
      data: {
        title: "Nike Air Force 1 '07 White",
        description: "Classic all-white leather sneaker with Air cushioning",
        price: 8495,
        discount: 15,
        images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600"],
        inStock: true,
        stock: 20,
        shopId: shop2.id,
      },
    });

    await prisma.cardOffer.create({
      data: { bank_name: "HDFC", card_type: "Debit Card", offer_text: "5% off up to ₹500", min_amount: 5000, productId: p4.id },
    });

    // Create Shop 3
    const shop3 = await prisma.shop.create({
      data: {
        shop_name: "iWorld Premium",
        owner_name: "Priya Menon",
        phone: "+91 87654 32109",
        address: "Ground Floor, Jubilee Hills Check Post",
        landmark: "Next to Domino's",
        google_map_link: "https://maps.google.com/?q=Jubilee+Hills+Hyderabad",
        shop_image: "https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=800",
        banner_image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200",
        category: "Apple Products",
        opening_hours: "10:00 AM – 8:30 PM",
        verified: true,
        delivery_available: true,
        shopkeeperId: sk3.id,
      },
    });

    const p5 = await prisma.product.create({
      data: {
        title: "iPhone 16 Pro Max 256GB Black Titanium",
        description: "A18 Pro chip, 48MP camera system, Titanium design, iOS 18",
        price: 134900,
        discount: 2,
        images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600"],
        inStock: true,
        stock: 3,
        shopId: shop3.id,
      },
    });

    await prisma.cardOffer.createMany({
      data: [
        { bank_name: "AXIS", card_type: "Credit Card", offer_text: "5% cashback up to ₹3,500", min_amount: 50000, productId: p5.id },
        { bank_name: "ICICI", card_type: "EMI", offer_text: "No Cost EMI from ₹11,000/month", min_amount: 0, productId: p5.id },
      ],
    });

    // Create demo users
    await prisma.user.createMany({
      data: [
        { name: "Vijay Kumar", email: "vijay@demo.com", phone: "+91 98765 00001", role: "customer" },
        { name: "Priya Sharma", email: "priya@demo.com", phone: "+91 98765 00002", role: "customer" },
      ],
    });

    // Create a demo locked offer
    await prisma.lockedOffer.create({
      data: {
        lock_code: "L2L-DEMO1",
        customer_name: "Vijay Kumar",
        customer_phone: "+91 98765 00001",
        customer_address: "Flat 4B, Sunshine Apts, Madhapur, Hyderabad",
        customer_map_link: "https://maps.google.com/?q=Madhapur+Hyderabad",
        status: "LOCKED",
        expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
        productId: p1.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "✅ Database seeded successfully!",
      created: {
        shops: 3,
        products: 5,
        cardOffers: 12,
        users: 2,
        lockedOffers: 1,
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

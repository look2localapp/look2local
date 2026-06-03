// prisma/seed.ts
import { PrismaClient, Prisma } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import "dotenv/config";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const CATALOG: Array<{
  name: string;
  brand: string;
  category: string;
  image?: string;
  description?: string;
  specifications?: Prisma.InputJsonObject;
}> = [
  // ─── MOBILES ───
  { name: "iPhone 16 Pro Max", brand: "Apple", category: "Mobiles", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", description: "Apple iPhone 16 Pro Max with A18 Pro chip", specifications: { storage: ["256GB", "512GB", "1TB"], colors: ["Black", "White", "Desert Titanium", "Natural Titanium"] } },
  { name: "iPhone 16 Pro", brand: "Apple", category: "Mobiles", image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", description: "Apple iPhone 16 Pro with A18 Pro chip", specifications: { storage: ["128GB", "256GB", "512GB", "1TB"], colors: ["Black", "White", "Desert Titanium"] } },
  { name: "iPhone 16", brand: "Apple", category: "Mobiles", description: "Apple iPhone 16 with A18 chip", specifications: { storage: ["128GB", "256GB", "512GB"], colors: ["Black", "White", "Pink", "Teal", "Ultramarine"] } },
  { name: "iPhone 15 Pro Max", brand: "Apple", category: "Mobiles", description: "Apple iPhone 15 Pro Max", specifications: { storage: ["256GB", "512GB", "1TB"], colors: ["Black Titanium", "White Titanium", "Blue Titanium", "Natural Titanium"] } },
  { name: "iPhone 15 Pro", brand: "Apple", category: "Mobiles", description: "Apple iPhone 15 Pro", specifications: { storage: ["128GB", "256GB", "512GB", "1TB"] } },
  { name: "iPhone 15", brand: "Apple", category: "Mobiles", description: "Apple iPhone 15", specifications: { storage: ["128GB", "256GB", "512GB"] } },
  { name: "Samsung Galaxy S25 Ultra", brand: "Samsung", category: "Mobiles", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400", description: "Samsung Galaxy S25 Ultra with S Pen", specifications: { storage: ["256GB", "512GB", "1TB"], colors: ["Titanium Black", "Titanium Gray", "Titanium Whitesilver"] } },
  { name: "Samsung Galaxy S25+", brand: "Samsung", category: "Mobiles", description: "Samsung Galaxy S25+", specifications: { storage: ["256GB", "512GB"] } },
  { name: "OnePlus 13", brand: "OnePlus", category: "Mobiles", description: "OnePlus 13 flagship", specifications: { storage: ["256GB", "512GB"], ram: ["12GB", "16GB"] } },
  { name: "Google Pixel 9 Pro", brand: "Google", category: "Mobiles", description: "Google Pixel 9 Pro with AI features", specifications: { storage: ["128GB", "256GB", "512GB", "1TB"] } },

  // ─── LAPTOPS ───
  { name: "MacBook Pro 16 M4", brand: "Apple", category: "Laptops", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", description: "MacBook Pro 16 with M4 Pro/Max chip", specifications: { ram: ["24GB", "48GB", "128GB"], storage: ["512GB", "1TB", "2TB", "4TB"], colors: ["Space Black", "Silver"] } },
  { name: "MacBook Pro 14 M4", brand: "Apple", category: "Laptops", description: "MacBook Pro 14 with M4/M4 Pro chip", specifications: { ram: ["16GB", "24GB", "48GB"], storage: ["512GB", "1TB", "2TB"] } },
  { name: "MacBook Air 15 M3", brand: "Apple", category: "Laptops", description: "MacBook Air 15 with M3 chip", specifications: { ram: ["8GB", "16GB", "24GB"], storage: ["256GB", "512GB", "1TB"] } },
  { name: "Dell XPS 15", brand: "Dell", category: "Laptops", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400", description: "Dell XPS 15 OLED laptop", specifications: { ram: ["16GB", "32GB", "64GB"], storage: ["512GB", "1TB", "2TB"] } },

  // ─── TVs ───
  { name: "Samsung 65\" Neo QLED 8K", brand: "Samsung", category: "TVs", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400", description: "Samsung 65 inch Neo QLED 8K Smart TV", specifications: { sizes: ["55\"", "65\"", "75\"", "85\""] } },
  { name: "LG 65\" OLED C4", brand: "LG", category: "TVs", description: "LG OLED evo C4 Smart TV 4K", specifications: { sizes: ["42\"", "48\"", "55\"", "65\"", "77\"", "83\""] } },
  { name: "Sony Bravia 65\" XR A95L OLED", brand: "Sony", category: "TVs", description: "Sony Bravia XR A95L QD-OLED 4K", specifications: { sizes: ["55\"", "65\"", "77\""] } },

  // ─── CAMERAS ───
  { name: "Sony Alpha 7 IV", brand: "Sony", category: "Cameras", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400", description: "Sony Alpha 7 IV Full Frame Mirrorless", specifications: { type: "Mirrorless", sensor: "Full Frame", megapixels: "33MP" } },

  // ─── SMART WATCHES ───
  { name: "Apple Watch Ultra 2", brand: "Apple", category: "SmartWatches", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400", description: "Apple Watch Ultra 2 with titanium case", specifications: { sizes: ["49mm"], connectivity: "GPS + Cellular" } },
  { name: "Samsung Galaxy Watch Ultra", brand: "Samsung", category: "SmartWatches", description: "Samsung Galaxy Watch Ultra", specifications: { sizes: ["47mm"] } },

  // ─── GAMING ───
  { name: "Sony PlayStation 5", brand: "Sony", category: "Gaming", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400", description: "Sony PlayStation 5 console", specifications: { storage: "825GB SSD", variants: ["Disc Edition", "Digital Edition"] } },
  { name: "Nintendo Switch OLED", brand: "Nintendo", category: "Gaming", description: "Nintendo Switch OLED model", specifications: { storage: "64GB", screen: "7 inch OLED" } },

  // ─── ACCESSORIES ───
  { name: "AirPods Pro (2nd Generation)", brand: "Apple", category: "Accessories", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400", description: "Apple AirPods Pro 2nd Gen with H2 chip", specifications: { connectivity: "Bluetooth 5.3", anc: true } },
  { name: "Sony WH-1000XM5", brand: "Sony", category: "Accessories", description: "Sony WH-1000XM5 wireless headphones", specifications: { battery: "30 hours", anc: true } }
];

async function main() {
  console.log("🌱 Cleaning up database...");
  await prisma.review.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.cardOffer.deleteMany();
  await prisma.product.deleteMany();
  await prisma.shop.deleteMany();
  await prisma.shopkeeper.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.masterProduct.deleteMany();

  console.log("🌱 Seeding master product catalog...");
  const masterProducts: Record<string, any> = {};
  for (const item of CATALOG) {
    const mp = await prisma.masterProduct.create({ data: item });
    masterProducts[item.name] = mp;
  }
  console.log(`✅ Seeded ${Object.keys(masterProducts).length} master products.`);

  console.log("🌱 Seeding shopkeepers & shops...");
  // Shop 1: Bajaj Electronics
  const sk1 = await prisma.shopkeeper.create({
    data: {
      id: "sk_bajaj",
      email: "bajaj@look2local.com",
      passwordHash: "password123",
    }
  });

  const shopBajaj = await prisma.shop.create({
    data: {
      id: "shop_bajaj",
      shop_name: "Bajaj Electronics",
      owner_name: "Arjun Bajaj",
      phone: "+91 98480 22334",
      address: "Gachibowli Road, Beside IKEA, Hyderabad - 500081",
      google_map_link: "https://maps.google.com/?q=17.4483,78.3915",
      shop_image: "https://images.unsplash.com/photo-1550009158-9effb619a6c4?q=80&w=600&auto=format&fit=crop",
      banner_image: "https://images.unsplash.com/photo-1550009158-9effb619a6c4?q=80&w=1200&auto=format&fit=crop",
      gst_number: "37AAFCE1683D1ZR",
      gst_verified: true,
      business_name: "Bajaj Electronics and Kitchen stories, IQ",
      trade_name: "Bajaj Electronics",
      gst_status: "Active",
      legal_name: "Bajaj Electronics and Kitchen stories, IQ",
      business_type: "Retailer",
      aadhaar_verified: true,
      category: "Electronics & Gadgets",
      opening_hours: "10:00 AM - 10:00 PM",
      verified: true,
      featured: true,
      delivery_available: true,
      shopkeeperId: sk1.id,
    }
  });

  // Shop 2: Reliance Digital
  const sk2 = await prisma.shopkeeper.create({
    data: {
      id: "sk_reliance",
      email: "reliance@look2local.com",
      passwordHash: "password123",
    }
  });

  const shopReliance = await prisma.shop.create({
    data: {
      id: "shop_reliance",
      shop_name: "Reliance Digital",
      owner_name: "Kiran Shah",
      phone: "+91 98490 55667",
      address: "Mindspace Road, Madhapur, Hyderabad - 500081",
      google_map_link: "https://maps.google.com/?q=17.4401,78.3489",
      shop_image: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?q=80&w=600&auto=format&fit=crop",
      banner_image: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?q=80&w=1200&auto=format&fit=crop",
      gst_number: "27AAAAA0000A1Z5",
      gst_verified: true,
      business_name: "RELIANCE DIGITAL RETAIL LIMITED",
      trade_name: "Reliance Digital",
      gst_status: "Active",
      legal_name: "RELIANCE DIGITAL RETAIL LIMITED",
      business_type: "Retailer",
      aadhaar_verified: true,
      category: "Electronics & Gadgets",
      opening_hours: "10:30 AM - 9:30 PM",
      verified: true,
      featured: true,
      delivery_available: true,
      shopkeeperId: sk2.id,
    }
  });

  // Shop 3: Poorvika Mobiles
  const sk3 = await prisma.shopkeeper.create({
    data: {
      id: "sk_poorvika",
      email: "poorvika@look2local.com",
      passwordHash: "password123",
    }
  });

  const shopPoorvika = await prisma.shop.create({
    data: {
      id: "shop_poorvika",
      shop_name: "Poorvika Mobiles",
      owner_name: "Ramanathan P.",
      phone: "+91 98480 99887",
      address: "Kondapur X Roads, Kondapur, Hyderabad - 500084",
      google_map_link: "https://maps.google.com/?q=17.4622,78.3568",
      shop_image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop",
      banner_image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200&auto=format&fit=crop",
      gst_number: "33AAACP2290B1ZX",
      gst_verified: true,
      business_name: "POORVIKA MOBILES PRIVATE LIMITED",
      trade_name: "Poorvika Mobiles",
      gst_status: "Active",
      legal_name: "POORVIKA MOBILES PRIVATE LIMITED",
      business_type: "Retailer",
      aadhaar_verified: false,
      category: "Electronics & Gadgets",
      opening_hours: "09:30 AM - 09:30 PM",
      verified: true,
      featured: false,
      delivery_available: false,
      shopkeeperId: sk3.id,
    }
  });

  console.log("✅ Seeded 3 mock shops.");

  console.log("🌱 Seeding products linked to master catalog...");
  // Let's seed products for iPhone 16 Pro Max
  const ip16pm = masterProducts["iPhone 16 Pro Max"];
  const ps5 = masterProducts["Sony PlayStation 5"];
  const airpods = masterProducts["AirPods Pro (2nd Generation)"];

  // Products at Bajaj
  const p1_bajaj = await prisma.product.create({
    data: {
      id: "p_ip16pm_bajaj",
      title: "iPhone 16 Pro Max 256GB - Desert Titanium",
      description: "Get the latest Apple iPhone 16 Pro Max at Bajaj. Instant discount with brand warranty.",
      price: 144900,
      discount: 5000, // Offer price: 139900
      images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600"],
      inStock: true,
      stock: 12,
      brand: "Apple",
      category: "Mobiles",
      masterProductId: ip16pm.id,
      shopId: shopBajaj.id,
    }
  });

  const p2_bajaj = await prisma.product.create({
    data: {
      id: "p_ps5_bajaj",
      title: "Sony PlayStation 5 Console (Disc Edition)",
      description: "Next-gen gaming at the best local price. Original Sony India warranty.",
      price: 54990,
      discount: 5000, // Offer price: 49990
      images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600"],
      inStock: true,
      stock: 8,
      brand: "Sony",
      category: "Gaming",
      masterProductId: ps5.id,
      shopId: shopBajaj.id,
    }
  });

  // Products at Reliance
  const p1_reliance = await prisma.product.create({
    data: {
      id: "p_ip16pm_reliance",
      title: "Apple iPhone 16 Pro Max 256GB",
      description: "Buy iPhone 16 Pro Max at Reliance Digital. Best exchange offers available.",
      price: 144900,
      discount: 4400, // Offer price: 140500
      images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600"],
      inStock: true,
      stock: 15,
      brand: "Apple",
      category: "Mobiles",
      masterProductId: ip16pm.id,
      shopId: shopReliance.id,
    }
  });

  const p2_reliance = await prisma.product.create({
    data: {
      id: "p_ps5_reliance",
      title: "Sony PlayStation 5 Slim Disc Edition",
      description: "Play Has No Limits. Reliance Digital special bundle offers.",
      price: 54990,
      discount: 4000, // Offer price: 50990
      images: ["https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600"],
      inStock: true,
      stock: 5,
      brand: "Sony",
      category: "Gaming",
      masterProductId: ps5.id,
      shopId: shopReliance.id,
    }
  });

  // Products at Poorvika
  const p1_poorvika = await prisma.product.create({
    data: {
      id: "p_ip16pm_poorvika",
      title: "Apple iPhone 16 Pro Max (Desert Titanium, 256 GB)",
      description: "Poorvika Special Offer on iPhone 16 Pro Max. Same day pickup available.",
      price: 144900,
      discount: 5400, // Offer price: 139500 (cheapest!)
      images: ["https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600"],
      inStock: true,
      stock: 6,
      brand: "Apple",
      category: "Mobiles",
      masterProductId: ip16pm.id,
      shopId: shopPoorvika.id,
    }
  });

  const p3_poorvika = await prisma.product.create({
    data: {
      id: "p_airpods_poorvika",
      title: "Apple AirPods Pro (2nd Generation)",
      description: "Active Noise Cancellation, adaptive transparency, spatial audio.",
      price: 24900,
      discount: 3400, // Offer price: 21500
      images: ["https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600"],
      inStock: true,
      stock: 10,
      brand: "Apple",
      category: "Accessories",
      masterProductId: airpods.id,
      shopId: shopPoorvika.id,
    }
  });

  console.log("✅ Seeded shop products.");

  console.log("🌱 Seeding card offers...");
  // Card Offers for iPhone at Bajaj
  await prisma.cardOffer.createMany({
    data: [
      { bank_name: "HDFC", card_type: "Credit Card", offer_text: "Flat ₹5,000 Instant Discount on HDFC Credit Cards", min_amount: 100000, productId: p1_bajaj.id },
      { bank_name: "ICICI", card_type: "Credit Card", offer_text: "Flat ₹4,000 Instant Discount on ICICI Credit Cards", min_amount: 100000, productId: p1_bajaj.id },
      { bank_name: "SBI", card_type: "Credit Card", offer_text: "Flat ₹3,000 Instant Discount on SBI Credit Cards", min_amount: 100000, productId: p1_bajaj.id },
    ]
  });

  // Card Offers for iPhone at Reliance
  await prisma.cardOffer.createMany({
    data: [
      { bank_name: "HDFC", card_type: "Credit Card", offer_text: "Flat ₹5,500 Instant Discount on HDFC Credit Cards", min_amount: 100000, productId: p1_reliance.id },
      { bank_name: "ICICI", card_type: "Credit Card", offer_text: "Flat ₹4,000 Instant Discount on ICICI Credit Cards", min_amount: 100000, productId: p1_reliance.id },
      { bank_name: "SBI", card_type: "Credit Card", offer_text: "Flat ₹3,000 Instant Discount on SBI Credit Cards", min_amount: 100000, productId: p1_reliance.id },
    ]
  });

  // Card Offers for iPhone at Poorvika
  await prisma.cardOffer.createMany({
    data: [
      { bank_name: "HDFC", card_type: "Credit Card", offer_text: "Flat ₹5,000 Instant Discount on HDFC Credit Cards", min_amount: 100000, productId: p1_poorvika.id },
      { bank_name: "ICICI", card_type: "Credit Card", offer_text: "Flat ₹4,500 Instant Discount on ICICI Credit Cards", min_amount: 100000, productId: p1_poorvika.id },
      { bank_name: "SBI", card_type: "Credit Card", offer_text: "Flat ₹3,000 Instant Discount on SBI Credit Cards", min_amount: 100000, productId: p1_poorvika.id },
    ]
  });

  console.log("✅ Seeded bank card offers.");

  console.log("🌱 Seeding customer profiles & reviews...");
  const cust1 = await prisma.customerProfile.create({
    data: {
      id: "cust_rahul",
      clerkId: "user_2hY8K6zL0xW3aPqR9sT5uV",
      name: "Rahul Sharma",
      email: "rahul.sharma@gmail.com",
      phone: "+91 99887 76655",
      referralCode: "RAHU-1298",
      referralBalance: 25.0,
      profilePhoto: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop",
    }
  });

  const cust2 = await prisma.customerProfile.create({
    data: {
      id: "cust_priya",
      clerkId: "user_2hY8K6zL0xW3aPqR9sT5uX",
      name: "Priya Patel",
      email: "priya.patel@gmail.com",
      phone: "+91 99887 76666",
      referralCode: "PRIY-4482",
      referralBalance: 0,
      profilePhoto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    }
  });

  // Seed reviews for Bajaj
  await prisma.review.createMany({
    data: [
      { rating: 5, comment: "Excellent customer service! Got the cheapest price for iPhone 16 Pro Max.", customerId: cust1.id, shopId: shopBajaj.id },
      { rating: 4.5, comment: "Genuine brand warranty, verified shop. Fast verification.", customerId: cust2.id, shopId: shopBajaj.id },
    ]
  });

  // Seed reviews for Reliance
  await prisma.review.createMany({
    data: [
      { rating: 4, comment: "Nice shop, very spacious. Prices are reasonable.", customerId: cust1.id, shopId: shopReliance.id },
      { rating: 4.8, comment: "Great discount using HDFC bank card. Verified seller.", customerId: cust2.id, shopId: shopReliance.id },
    ]
  });

  // Seed reviews for Poorvika
  await prisma.review.createMany({
    data: [
      { rating: 5, comment: "Superb customer care. Price comparison worked perfectly and I locked it instantly.", customerId: cust2.id, shopId: shopPoorvika.id },
    ]
  });

  console.log("✅ Seeded customer reviews.");

  console.log("🌱 Seeding redeemed coupons & order counts...");
  // Create 50 redeemed coupons for Bajaj to represent 50 successful orders
  for (let i = 0; i < 50; i++) {
    await prisma.coupon.create({
      data: {
        code: `L2L-BAJ${1000 + i}`,
        qrData: `{"code":"L2L-BAJ${1000 + i}","productId":"p_ip16pm_bajaj","shopId":"shop_bajaj","discount":750}`,
        couponCost: 100,
        discountAmount: 750,
        status: "REDEEMED",
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
        redeemedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        productId: p1_bajaj.id,
        customerId: cust1.id,
        shopId: shopBajaj.id,
      }
    });
  }

  // Create 35 redeemed coupons for Reliance Digital
  for (let i = 0; i < 35; i++) {
    await prisma.coupon.create({
      data: {
        code: `L2L-REL${1000 + i}`,
        qrData: `{"code":"L2L-REL${1000 + i}","productId":"p_ip16pm_reliance","shopId":"shop_reliance","discount":750}`,
        couponCost: 100,
        discountAmount: 750,
        status: "REDEEMED",
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        redeemedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        productId: p1_reliance.id,
        customerId: cust2.id,
        shopId: shopReliance.id,
      }
    });
  }

  // Create 15 redeemed coupons for Poorvika Mobiles
  for (let i = 0; i < 15; i++) {
    await prisma.coupon.create({
      data: {
        code: `L2L-POO${1000 + i}`,
        qrData: `{"code":"L2L-POO${1000 + i}","productId":"p_ip16pm_poorvika","shopId":"shop_poorvika","discount":750}`,
        couponCost: 100,
        discountAmount: 750,
        status: "REDEEMED",
        expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        redeemedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        productId: p1_poorvika.id,
        customerId: cust1.id,
        shopId: shopPoorvika.id,
      }
    });
  }

  console.log("✅ Seeded successful order history (Redeemed coupons).");
  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

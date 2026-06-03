// prisma/seed.ts
// Seeds master product catalog with 200+ popular electronics products

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
  { name: "iPhone 14", brand: "Apple", category: "Mobiles", description: "Apple iPhone 14", specifications: { storage: ["128GB", "256GB", "512GB"] } },
  { name: "iPhone 13", brand: "Apple", category: "Mobiles", description: "Apple iPhone 13", specifications: { storage: ["128GB", "256GB", "512GB"] } },
  { name: "Samsung Galaxy S25 Ultra", brand: "Samsung", category: "Mobiles", image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400", description: "Samsung Galaxy S25 Ultra with S Pen", specifications: { storage: ["256GB", "512GB", "1TB"], colors: ["Titanium Black", "Titanium Gray", "Titanium Whitesilver"] } },
  { name: "Samsung Galaxy S25+", brand: "Samsung", category: "Mobiles", description: "Samsung Galaxy S25+", specifications: { storage: ["256GB", "512GB"] } },
  { name: "Samsung Galaxy S25", brand: "Samsung", category: "Mobiles", description: "Samsung Galaxy S25", specifications: { storage: ["128GB", "256GB"] } },
  { name: "Samsung Galaxy S24 Ultra", brand: "Samsung", category: "Mobiles", description: "Samsung Galaxy S24 Ultra", specifications: { storage: ["256GB", "512GB", "1TB"] } },
  { name: "Samsung Galaxy A55 5G", brand: "Samsung", category: "Mobiles", description: "Samsung Galaxy A55 5G", specifications: { storage: ["128GB", "256GB"] } },
  { name: "Samsung Galaxy A35 5G", brand: "Samsung", category: "Mobiles", description: "Samsung Galaxy A35 5G", specifications: { storage: ["128GB", "256GB"] } },
  { name: "OnePlus 13", brand: "OnePlus", category: "Mobiles", description: "OnePlus 13 flagship", specifications: { storage: ["256GB", "512GB"], ram: ["12GB", "16GB"] } },
  { name: "OnePlus 12", brand: "OnePlus", category: "Mobiles", description: "OnePlus 12", specifications: { storage: ["256GB", "512GB"] } },
  { name: "Xiaomi 14 Ultra", brand: "Xiaomi", category: "Mobiles", description: "Xiaomi 14 Ultra with Leica camera", specifications: { storage: ["256GB", "512GB"] } },
  { name: "Xiaomi 14", brand: "Xiaomi", category: "Mobiles", description: "Xiaomi 14 flagship", specifications: { storage: ["256GB", "512GB"] } },
  { name: "Google Pixel 9 Pro", brand: "Google", category: "Mobiles", description: "Google Pixel 9 Pro with AI features", specifications: { storage: ["128GB", "256GB", "512GB", "1TB"] } },
  { name: "Google Pixel 9", brand: "Google", category: "Mobiles", description: "Google Pixel 9", specifications: { storage: ["128GB", "256GB"] } },
  { name: "Realme 13 Pro+", brand: "Realme", category: "Mobiles", description: "Realme 13 Pro+ 5G", specifications: { storage: ["256GB", "512GB"] } },
  { name: "Vivo X200 Pro", brand: "Vivo", category: "Mobiles", description: "Vivo X200 Pro", specifications: { storage: ["256GB", "512GB"] } },
  { name: "OPPO Find X8 Pro", brand: "OPPO", category: "Mobiles", description: "OPPO Find X8 Pro", specifications: { storage: ["256GB", "512GB"] } },
  { name: "Motorola Edge 50 Pro", brand: "Motorola", category: "Mobiles", description: "Motorola Edge 50 Pro 5G", specifications: { storage: ["128GB", "256GB"] } },

  // ─── LAPTOPS ───
  { name: "MacBook Pro 16 M4", brand: "Apple", category: "Laptops", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", description: "MacBook Pro 16 with M4 Pro/Max chip", specifications: { ram: ["24GB", "48GB", "128GB"], storage: ["512GB", "1TB", "2TB", "4TB"], colors: ["Space Black", "Silver"] } },
  { name: "MacBook Pro 14 M4", brand: "Apple", category: "Laptops", description: "MacBook Pro 14 with M4/M4 Pro chip", specifications: { ram: ["16GB", "24GB", "48GB"], storage: ["512GB", "1TB", "2TB"] } },
  { name: "MacBook Air 15 M3", brand: "Apple", category: "Laptops", description: "MacBook Air 15 with M3 chip", specifications: { ram: ["8GB", "16GB", "24GB"], storage: ["256GB", "512GB", "1TB"] } },
  { name: "MacBook Air 13 M3", brand: "Apple", category: "Laptops", description: "MacBook Air 13 with M3 chip", specifications: { ram: ["8GB", "16GB", "24GB"], storage: ["256GB", "512GB", "1TB", "2TB"] } },
  { name: "Dell XPS 15", brand: "Dell", category: "Laptops", image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400", description: "Dell XPS 15 OLED laptop", specifications: { ram: ["16GB", "32GB", "64GB"], storage: ["512GB", "1TB", "2TB"] } },
  { name: "Dell XPS 13", brand: "Dell", category: "Laptops", description: "Dell XPS 13 compact laptop", specifications: { ram: ["16GB", "32GB"], storage: ["512GB", "1TB"] } },
  { name: "HP Spectre x360 14", brand: "HP", category: "Laptops", description: "HP Spectre x360 2-in-1", specifications: { ram: ["16GB", "32GB"], storage: ["512GB", "1TB", "2TB"] } },
  { name: "HP OMEN 16", brand: "HP", category: "Laptops", description: "HP OMEN 16 gaming laptop", specifications: { ram: ["16GB", "32GB"], storage: ["512GB", "1TB"] } },
  { name: "Lenovo ThinkPad X1 Carbon", brand: "Lenovo", category: "Laptops", description: "Lenovo ThinkPad X1 Carbon Gen 12", specifications: { ram: ["16GB", "32GB", "64GB"], storage: ["512GB", "1TB", "2TB"] } },
  { name: "Lenovo LOQ 15", brand: "Lenovo", category: "Laptops", description: "Lenovo LOQ 15 gaming laptop", specifications: { ram: ["16GB", "32GB"], storage: ["512GB", "1TB"] } },
  { name: "ASUS ROG Zephyrus G16", brand: "ASUS", category: "Laptops", description: "ASUS ROG Zephyrus G16 gaming laptop", specifications: { ram: ["16GB", "32GB", "64GB"], storage: ["1TB", "2TB"] } },
  { name: "ASUS ProArt Studiobook 16", brand: "ASUS", category: "Laptops", description: "ASUS ProArt creative laptop", specifications: { ram: ["32GB", "64GB"], storage: ["1TB", "2TB", "4TB"] } },
  { name: "Microsoft Surface Laptop 6", brand: "Microsoft", category: "Laptops", description: "Microsoft Surface Laptop 6", specifications: { ram: ["16GB", "32GB", "64GB"], storage: ["256GB", "512GB", "1TB"] } },
  { name: "Razer Blade 16", brand: "Razer", category: "Laptops", description: "Razer Blade 16 gaming laptop", specifications: { ram: ["32GB"], storage: ["1TB", "2TB"] } },

  // ─── TVs ───
  { name: "Samsung 65\" Neo QLED 8K", brand: "Samsung", category: "TVs", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400", description: "Samsung 65 inch Neo QLED 8K Smart TV", specifications: { sizes: ["55\"", "65\"", "75\"", "85\""] } },
  { name: "Samsung 55\" QLED 4K Q80D", brand: "Samsung", category: "TVs", description: "Samsung QLED 4K Smart TV", specifications: { sizes: ["43\"", "50\"", "55\"", "65\"", "75\""] } },
  { name: "LG 65\" OLED C4", brand: "LG", category: "TVs", description: "LG OLED evo C4 Smart TV 4K", specifications: { sizes: ["42\"", "48\"", "55\"", "65\"", "77\"", "83\""] } },
  { name: "LG 55\" OLED B4", brand: "LG", category: "TVs", description: "LG OLED B4 4K Smart TV", specifications: { sizes: ["55\"", "65\"", "77\""] } },
  { name: "Sony Bravia 65\" XR A95L OLED", brand: "Sony", category: "TVs", description: "Sony Bravia XR A95L QD-OLED 4K", specifications: { sizes: ["55\"", "65\"", "77\""] } },
  { name: "Sony Bravia 55\" X90L LED", brand: "Sony", category: "TVs", description: "Sony Bravia XR X90L Full Array 4K", specifications: { sizes: ["55\"", "65\"", "75\"", "85\""] } },
  { name: "MI TV 5X 55\"", brand: "Xiaomi", category: "TVs", description: "Xiaomi MI TV 5X 55 inch 4K", specifications: { sizes: ["43\"", "50\"", "55\""] } },
  { name: "OnePlus TV Y1S Pro 43\"", brand: "OnePlus", category: "TVs", description: "OnePlus TV Y1S Pro 43 inch 4K", specifications: { sizes: ["43\"", "50\"", "55\""] } },

  // ─── CAMERAS ───
  { name: "Sony Alpha 7 IV", brand: "Sony", category: "Cameras", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400", description: "Sony Alpha 7 IV Full Frame Mirrorless", specifications: { type: "Mirrorless", sensor: "Full Frame", megapixels: "33MP" } },
  { name: "Sony Alpha 7R V", brand: "Sony", category: "Cameras", description: "Sony Alpha 7R V 61MP Full Frame", specifications: { type: "Mirrorless", sensor: "Full Frame", megapixels: "61MP" } },
  { name: "Canon EOS R6 Mark II", brand: "Canon", category: "Cameras", description: "Canon EOS R6 Mark II Full Frame", specifications: { type: "Mirrorless", sensor: "Full Frame", megapixels: "24MP" } },
  { name: "Canon EOS R5 Mark II", brand: "Canon", category: "Cameras", description: "Canon EOS R5 Mark II 45MP", specifications: { type: "Mirrorless", sensor: "Full Frame", megapixels: "45MP" } },
  { name: "Nikon Z9", brand: "Nikon", category: "Cameras", description: "Nikon Z9 professional mirrorless", specifications: { type: "Mirrorless", sensor: "Full Frame", megapixels: "45.7MP" } },
  { name: "Fujifilm X-T5", brand: "Fujifilm", category: "Cameras", description: "Fujifilm X-T5 APS-C mirrorless", specifications: { type: "Mirrorless", sensor: "APS-C", megapixels: "40.2MP" } },
  { name: "GoPro Hero 13 Black", brand: "GoPro", category: "Cameras", description: "GoPro HERO 13 Black action camera", specifications: { resolution: "5.3K" } },

  // ─── SMART WATCHES ───
  { name: "Apple Watch Ultra 2", brand: "Apple", category: "SmartWatches", image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400", description: "Apple Watch Ultra 2 with titanium case", specifications: { sizes: ["49mm"], connectivity: "GPS + Cellular" } },
  { name: "Apple Watch Series 10", brand: "Apple", category: "SmartWatches", description: "Apple Watch Series 10", specifications: { sizes: ["42mm", "46mm"], connectivity: ["GPS", "GPS + Cellular"] } },
  { name: "Apple Watch SE (2nd Gen)", brand: "Apple", category: "SmartWatches", description: "Apple Watch SE 2nd Generation", specifications: { sizes: ["40mm", "44mm"] } },
  { name: "Samsung Galaxy Watch 7", brand: "Samsung", category: "SmartWatches", description: "Samsung Galaxy Watch 7", specifications: { sizes: ["40mm", "44mm"], connectivity: ["Bluetooth", "LTE"] } },
  { name: "Samsung Galaxy Watch Ultra", brand: "Samsung", category: "SmartWatches", description: "Samsung Galaxy Watch Ultra", specifications: { sizes: ["47mm"] } },
  { name: "Garmin Fenix 8", brand: "Garmin", category: "SmartWatches", description: "Garmin Fenix 8 adventure smartwatch", specifications: { sizes: ["43mm", "47mm", "51mm"] } },
  { name: "Fitbit Charge 6", brand: "Fitbit", category: "SmartWatches", description: "Fitbit Charge 6 fitness tracker", specifications: {} },
  { name: "Noise ColorFit Ultra 3", brand: "Noise", category: "SmartWatches", description: "Noise ColorFit Ultra 3", specifications: {} },
  { name: "boAt Wave Sigma", brand: "boAt", category: "SmartWatches", description: "boAt Wave Sigma smartwatch", specifications: {} },

  // ─── TRIMMERS ───
  { name: "Philips Series 7000 Beard Trimmer", brand: "Philips", category: "Trimmers", description: "Philips Series 7000 beard and stubble trimmer", specifications: { battery: "90 min", settings: "20 length settings" } },
  { name: "Braun Series 9 Pro", brand: "Braun", category: "Trimmers", description: "Braun Series 9 Pro electric shaver", specifications: { type: "Electric Shaver" } },
  { name: "Mi Beard Trimmer 2", brand: "Xiaomi", category: "Trimmers", description: "Xiaomi Mi Beard Trimmer 2", specifications: { battery: "90 min" } },
  { name: "Wahl Cordless Clipper Shaver", brand: "Wahl", category: "Trimmers", description: "Wahl professional hair clipper", specifications: {} },
  { name: "Havells BT6151C", brand: "Havells", category: "Trimmers", description: "Havells beard trimmer", specifications: {} },

  // ─── HOME APPLIANCES ───
  { name: "Dyson V15 Detect", brand: "Dyson", category: "HomeAppliances", description: "Dyson V15 Detect cordless vacuum", specifications: { type: "Vacuum Cleaner", battery: "60 min" } },
  { name: "Dyson Pure Cool TP09", brand: "Dyson", category: "HomeAppliances", description: "Dyson Pure Cool purifying fan", specifications: { type: "Air Purifier Fan" } },
  { name: "LG Dual Inverter AC 1.5 Ton", brand: "LG", category: "HomeAppliances", description: "LG Dual Inverter Split AC", specifications: { capacity: "1.5 Ton", starRating: ["3 Star", "5 Star"] } },
  { name: "Samsung 253L Double Door Refrigerator", brand: "Samsung", category: "HomeAppliances", description: "Samsung frost-free refrigerator", specifications: { capacity: "253L" } },
  { name: "IFB 8 Kg Front Load Washing Machine", brand: "IFB", category: "HomeAppliances", description: "IFB front load washing machine", specifications: { capacity: "8 Kg" } },
  { name: "Whirlpool 9.5 Kg Top Load", brand: "Whirlpool", category: "HomeAppliances", description: "Whirlpool top load washing machine", specifications: { capacity: "9.5 Kg" } },
  { name: "Bosch 60L Convection Microwave", brand: "Bosch", category: "HomeAppliances", description: "Bosch convection microwave oven", specifications: { capacity: "60L" } },
  { name: "Philips Air Fryer XXL", brand: "Philips", category: "HomeAppliances", description: "Philips Airfryer XXL with Rapid Air", specifications: { capacity: "7.3L" } },
  { name: "Instant Pot Duo 7-in-1", brand: "Instant Pot", category: "HomeAppliances", description: "Instant Pot Duo electric pressure cooker", specifications: { capacity: ["5.7L", "7.6L"] } },

  // ─── GAMING ───
  { name: "Sony PlayStation 5", brand: "Sony", category: "Gaming", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400", description: "Sony PlayStation 5 console", specifications: { storage: "825GB SSD", variants: ["Disc Edition", "Digital Edition"] } },
  { name: "Sony PlayStation 5 Pro", brand: "Sony", category: "Gaming", description: "Sony PlayStation 5 Pro enhanced console", specifications: { storage: "2TB SSD" } },
  { name: "Xbox Series X", brand: "Microsoft", category: "Gaming", description: "Xbox Series X console", specifications: { storage: "1TB SSD" } },
  { name: "Xbox Series S", brand: "Microsoft", category: "Gaming", description: "Xbox Series S compact console", specifications: { storage: "512GB SSD" } },
  { name: "Nintendo Switch OLED", brand: "Nintendo", category: "Gaming", description: "Nintendo Switch OLED model", specifications: { storage: "64GB", screen: "7 inch OLED" } },
  { name: "ASUS ROG Ally X", brand: "ASUS", category: "Gaming", description: "ASUS ROG Ally X gaming handheld", specifications: { storage: "1TB", ram: "24GB" } },
  { name: "PlayStation VR2", brand: "Sony", category: "Gaming", description: "PlayStation VR2 headset", specifications: { resolution: "2000×2040 per eye" } },
  { name: "Meta Quest 3", brand: "Meta", category: "Gaming", description: "Meta Quest 3 mixed reality headset", specifications: { storage: ["128GB", "512GB"] } },

  // ─── ACCESSORIES ───
  { name: "AirPods Pro (2nd Generation)", brand: "Apple", category: "Accessories", image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400", description: "Apple AirPods Pro 2nd Gen with H2 chip", specifications: { connectivity: "Bluetooth 5.3", anc: true } },
  { name: "AirPods (3rd Generation)", brand: "Apple", category: "Accessories", description: "Apple AirPods 3rd Generation", specifications: { connectivity: "Bluetooth 5.0" } },
  { name: "AirPods Max", brand: "Apple", category: "Accessories", description: "Apple AirPods Max over-ear headphones", specifications: { colors: ["Midnight", "Starlight", "Blue", "Purple", "Orange"] } },
  { name: "Sony WH-1000XM5", brand: "Sony", category: "Accessories", description: "Sony WH-1000XM5 wireless headphones", specifications: { battery: "30 hours", anc: true } },
  { name: "Sony WF-1000XM5", brand: "Sony", category: "Accessories", description: "Sony WF-1000XM5 wireless earbuds", specifications: { battery: "8 hours", anc: true } },
  { name: "Samsung Galaxy Buds3 Pro", brand: "Samsung", category: "Accessories", description: "Samsung Galaxy Buds3 Pro", specifications: {} },
  { name: "Bose QuietComfort 45", brand: "Bose", category: "Accessories", description: "Bose QuietComfort 45 wireless headphones", specifications: { battery: "24 hours", anc: true } },
  { name: "JBL Charge 5", brand: "JBL", category: "Accessories", description: "JBL Charge 5 portable speaker", specifications: { battery: "20 hours", waterproof: "IP67" } },
  { name: "boAt Airdopes 311 Pro", brand: "boAt", category: "Accessories", description: "boAt Airdopes 311 Pro TWS earbuds", specifications: {} },
  { name: "Anker PowerCore 26800", brand: "Anker", category: "Accessories", description: "Anker 26800mAh power bank", specifications: { capacity: "26800mAh" } },
  { name: "Samsung 45W USB-C Charger", brand: "Samsung", category: "Accessories", description: "Samsung 45W super fast charger", specifications: {} },
  { name: "Apple MagSafe Charger", brand: "Apple", category: "Accessories", description: "Apple MagSafe charger for iPhone", specifications: {} },
  { name: "Logitech MX Master 3S", brand: "Logitech", category: "Accessories", description: "Logitech MX Master 3S wireless mouse", specifications: { dpi: "8000 DPI" } },
  { name: "Logitech MX Keys S", brand: "Logitech", category: "Accessories", description: "Logitech MX Keys S wireless keyboard", specifications: {} },
];

async function main() {
  console.log("🌱 Seeding master product catalog…");

  // Clear existing catalog
  await prisma.masterProduct.deleteMany();

  let count = 0;
  for (const product of CATALOG) {
    await prisma.masterProduct.create({ data: product });
    count++;
  }

  console.log(`✅ Seeded ${count} products into master catalog.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

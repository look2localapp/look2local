# Look2Local — India's Hyperlocal Marketplace 🛒

Look2Local is a hyperlocal e-commerce platform designed to connect customers with local neighborhood shops. It allows users to discover local deals, lock prices before visiting a store, purchase discount coupons, and ensures all businesses are verified. 

## 🚀 Key Features Implemented

### 👥 For Customers
- **Customer Coupon System:** Dynamic pricing for coupons where users can pay a small amount (e.g., ₹50) to get a high discount (e.g., ₹300) when visiting a shop. Integrated with Razorpay.
- **My Coupons & Savings Dashboard:** Track purchased coupons, view QR codes for redemption, and see total money saved this month.
- **Shop & Card Comparison (Homepage Hero Feature):** Search products on the homepage hero and instantly compare prices and real-time GPS distances across local stores. Includes HDFC, ICICI, and SBI bank card effective pricing calculations.
- **Referral Rewards Program:** Share invite codes (e.g., `RAHU-8832`) with friends. The inviter receives ₹25 credit on signup, which can be applied for direct discounts or free coupon redemptions.
- **Wishlist & Price Alerts:** Save favorite products, track their prices, and lock prices directly from the wishlist.
- **Comprehensive Profile Management:** Customers can manage their profile, upload a photo, and set their exact location via device GPS for better local discovery.
- **Dual Location Picker:** Use device GPS (with Nominatim reverse geocoding to city name) or manually search and select from a list of Indian cities.
- **Free Map Integration:** Map features migrated from paid Google Maps to free **OpenStreetMap (OSM)** and **react-leaflet**.

### 🏪 For Shopkeepers
- **One-Time Coupon Redemption Scanner:** Secure QR Code scanner (using `@zxing/browser`) and manual input validation inside the Shopkeeper Portal. Enforces one-time redemption status updates in the database to prevent abuse or screenshot sharing.
- **Shop Trust Score & Verification Badges:** Show calculated star ratings, Aadhaar Verified badges, GST Verified badges, and historical successful order counts (e.g., "50 successful orders") to build credibility.
- **Shopkeeper Subscription System:** 10-day free trial followed by a ₹150/month Standard Plan, handled securely via Razorpay checkout.
- **Master Product Catalog & Barcode Scanner:** Instead of manual entry, shopkeepers can add products instantly by scanning a barcode (via camera using `@zxing/browser`) or searching the pre-seeded master catalog of popular electronics.
- **Inventory Management:** Full stock tracking dashboard with quick `+`/`-` controls and automatic out-of-stock badges.
- **Analytics & Earnings Dashboard:** Track shop views, reel performance, and coupon redemptions.

### 🛡️ For Platform Admins
- **Dark-Themed Admin Panel:** Comprehensive dashboard to oversee the marketplace.
- **Shop Approvals & GST Verification:** Review newly registered shops and verify their GST credentials.
- **Revenue Tracking:** Monitor platform earnings from subscriptions and coupon sales.
- **Customer Management:** View active customer metrics and activity.

### ⚙️ Core Technical Features
- **Modern E-commerce UI:** Fully responsive, Flipkart/Blinkit style interface built with a cohesive design system (Orange/Blue palette).
- **Custom Authentication Flow (Clerk):** Secure authentication separating customers and shopkeepers. No forced phone numbers at signup.
- **Database & ORM:** Powered by Prisma ORM and Neon Serverless PostgreSQL.
- **Image Uploads:** Cloudinary integration for shop, product, and profile images.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS + Custom Design System
- **Database:** Neon PostgreSQL
- **ORM:** Prisma v7
- **Authentication:** Clerk
- **Payments:** Razorpay
- **Maps:** Leaflet & OpenStreetMap (OSM)
- **Image Hosting:** Cloudinary
- **Barcode Scanning:** ZXing (`@zxing/browser`)
- **Icons:** Lucide React

---

## 📂 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx         # Global layout (Fonts, ClerkProvider)
│   ├── page.tsx           # Homepage (Hero, Categories, Location Picker, Live Offers)
│   ├── globals.css        # Design system tokens and Tailwind styles
│   ├── sign-in/           # Custom Clerk Sign-In Page
│   ├── sign-up/           # Custom Clerk Sign-Up Page
│   ├── profile/           # User Profile Management, Coupons, & Wishlist
│   ├── shops/             # Shop listings and individual shop details
│   ├── shopkeeper/        # Shopkeeper portal (Dashboard, Inventory, Subscription)
│   └── admin/             # Admin Panel (Stats, Shops, Customers, Payments)
├── components/
│   ├── Navbar.tsx         # Global navigation with search and profile links
│   ├── MasterCatalogSearch# Autocomplete product search
│   ├── BarcodeScanner.tsx # Camera-based barcode scanner
│   ├── CouponPurchaseModal# Razorpay coupon checkout
│   └── SubscriptionBanner # Expiry warnings for shopkeepers
├── lib/
│   ├── prisma.ts          # Singleton Prisma Client
│   ├── razorpay.ts        # Payment gateway utility
│   └── couponCalculator.ts# Dynamic ROI and coupon pricing logic
├── prisma/
│   ├── schema.prisma      # Database models
│   └── seed.ts            # Script to seed the master catalog (~100 products)
├── public/                # Static assets
└── .env                   # Environment variables
```

---

## 🔑 Environment Variables (.env)

To run this project, you will need to set up the following environment variables in a `.env` file at the root of the `frontend` directory. 

```env
# ─── DATABASE (Neon PostgreSQL) ────────────────────────────
DATABASE_URL="postgresql://<user>:<password>@<host>/neondb?sslmode=require"

# ─── CLERK AUTH ─────────────────────────────────────────────
# Get from: https://dashboard.clerk.com → Your App → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# ─── CLOUDINARY (For Image Uploads) ───────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ─── SANDBOX.CO.IN (For GST Verification) ─────────────────
SANDBOX_API_KEY=key_live_...
SANDBOX_SECRET_KEY=secret_live_...

# ─── RAZORPAY PAYMENT GATEWAY ──────────────────────────────
# Get from: https://dashboard.razorpay.com → Settings → API Keys
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE

# ─── ADMIN ACCESS ───────────────────────────────────────────
# Comma-separated Clerk user IDs who have admin access
# Get your Clerk user ID from: https://dashboard.clerk.com → Users
ADMIN_CLERK_IDS=user_YOUR_CLERK_ID_HERE
```

---

## 🏃‍♂️ Running the Project locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Generate Prisma Client & Push Schema:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Seed the Database (Master Catalog):**
   ```bash
   npm run seed
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Visit [http://localhost:3000](http://localhost:3000)

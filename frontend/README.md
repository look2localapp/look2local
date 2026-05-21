# Look2Local — India's Hyperlocal Marketplace 🛒

Look2Local is a hyperlocal e-commerce platform designed to connect customers with local neighborhood shops. It allows users to discover local deals, lock prices before visiting a store, and ensures all businesses are GST-verified. 

## 🚀 Key Features Implemented

- **Modern E-commerce UI:** Fully responsive, Flipkart/Blinkit style interface built with a cohesive design system (Orange/Blue palette, Rubik & Nunito Sans fonts).
- **Free Map Integration:** Fully migrated from paid Google Maps to free **OpenStreetMap (OSM)** and **react-leaflet**. Zero billing requirements for map visualization and directions.
- **Dual Location Picker:** Users can use their device's GPS (with Nominatim reverse geocoding to city name) or manually search and select from a list of Indian cities.
- **Custom Authentication Flow (Clerk):**
  - **Sign Up:** Email & Password only → OTP Verification → Done. No phone number or username forced at sign-up.
  - **Sign In:** Email & Password only.
  - **Post-Login Profile Completion:** Users are prompted to add their phone number and name *after* signing in. The phone number is stored purely as profile metadata for deal-related contact, not for authentication.
- **Database & ORM:** Powered by Prisma ORM and Neon Serverless PostgreSQL.
- **Image Uploads:** Cloudinary integration for shop and product images.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + Custom Design System
- **Database:** Neon PostgreSQL
- **ORM:** Prisma
- **Authentication:** Clerk
- **Maps:** Leaflet & OpenStreetMap (OSM)
- **Image Hosting:** Cloudinary
- **Icons:** Lucide React

## 📂 Project Structure

```
frontend/
├── app/
│   ├── layout.tsx         # Global layout (Fonts, ClerkProvider, ProfileModalWrapper)
│   ├── page.tsx           # Homepage (Hero, Categories, Location Picker, Live Offers)
│   ├── globals.css        # Design system tokens and Tailwind styles
│   ├── sign-in/           # Custom Clerk Sign-In Page
│   ├── sign-up/           # Custom Clerk Sign-Up Page
│   ├── profile/           # User Profile Management Page
│   ├── shops/             # Shop listings and individual shop details (MapView)
│   └── shopkeeper/        # Shopkeeper portal (Register, Dashboard, Products)
├── components/
│   ├── CompleteProfileModal.tsx # Post-login modal for collecting Phone/Name
│   ├── Navbar.tsx         # Global navigation with search and auth links
│   ├── MapView.tsx        # Single shop OSM iframe map component
│   ├── NearbyShopsMap.tsx # Leaflet map for visualizing multiple shops
│   └── ImageUpload.tsx    # Cloudinary image upload component
├── prisma/
│   └── schema.prisma      # Database models (User, Shop, Product, Order)
├── public/                # Static assets
└── .env                   # Environment variables (see below)
```

## 🔑 Environment Variables (.env)

To run this project, you will need to set up the following environment variables in a `.env` file at the root of the `frontend` directory. 

```env
# ─── DATABASE (Neon PostgreSQL) ────────────────────────────
DATABASE_URL="postgresql://<user>:<password>@<host>/neondb?sslmode=require"
DIRECT_URL="postgresql://<user>:<password>@<host>/neondb?sslmode=require"

# ─── CLERK AUTH ─────────────────────────────────────────────
# Get from: https://dashboard.clerk.com → Your App → API Keys
# Make sure to set Email/Password to ON, and Username/Phone to OFF in the Clerk Dashboard.
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

# ─── MAPS ──────────────────────────────────────────────────
# Note: Google Maps is no longer required as the app uses OpenStreetMap.
# You can leave this blank or remove it.
NEXT_PUBLIC_GOOGLE_MAPS_KEY=
```

## 🏃‍♂️ Running the Project locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Run Prisma Migrations (if database schema changed):**
   ```bash
   npx prisma db push
   # or
   npx prisma migrate dev
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```

4. **Open in Browser:**
   Visit [http://localhost:3000](http://localhost:3000)

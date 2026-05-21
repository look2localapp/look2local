import type { Metadata } from "next";
import { Rubik, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import ProfileModalWrapper from "@/components/ProfileModalWrapper";

const rubik = Rubik({
  subsets: ["latin"],
  variable: "--font-rubik",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Look2Local — Hyperlocal Marketplace",
  description: "Discover nearby shops, lock exclusive deals, and support local businesses. India's hyperlocal marketplace.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          suppressHydrationWarning
          className={`${rubik.variable} ${nunitoSans.variable} font-body bg-[#F8F9FA] text-gray-900 min-h-screen flex flex-col antialiased`}
        >
          <Navbar />
          <ProfileModalWrapper />
          <main className="flex-grow">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}

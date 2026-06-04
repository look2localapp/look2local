/**
 * GET /api/admin/gst-stats
 * ─────────────────────────────────────────────────────────────────────────────
 * Returns GST verification summary stats for the admin dashboard.
 * Admin-only — protected by Clerk auth + ADMIN_CLERK_IDS env var.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

async function isAdmin(userId: string): Promise<boolean> {
  const adminIds = process.env.ADMIN_CLERK_IDS?.split(",").map((id) => id.trim()) || [];
  return adminIds.includes(userId);
}

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [totalVerifiedShops, pendingGstReviews, rejectedGstNumbers] =
      await Promise.all([
        // Shops where GST was verified Active
        prisma.shop.count({ where: { gst_verified: true } }),

        // Shops with a GST number entered but NOT yet verified Active
        prisma.shop.count({
          where: {
            gst_number: { not: null },
            gst_verified: false,
          },
        }),

        // Shops where GST status is set but not "Active" (Cancelled, Suspended, etc.)
        prisma.shop.count({
          where: {
            gst_status: { not: null },
            NOT: { gst_status: "Active" },
          },
        }),
      ]);

    return NextResponse.json({
      totalVerifiedShops,
      pendingGstReviews,
      rejectedGstNumbers,
    });
  } catch (err) {
    console.error("[/api/admin/gst-stats]", err);
    return NextResponse.json({ error: "Failed to fetch GST stats" }, { status: 500 });
  }
}

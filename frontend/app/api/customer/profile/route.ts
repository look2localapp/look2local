// app/api/customer/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let profile = await prisma.customerProfile.findUnique({
      where: { clerkId: userId },
    });

    // Auto-create profile from Clerk data if not exists
    if (!profile) {
      const clerkUser = await currentUser();
      if (clerkUser) {
        const nameVal = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "Customer";
        const prefix = nameVal.replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase() || "L2L";
        const random = Math.floor(1000 + Math.random() * 9000);
        const code = `${prefix}-${random}`;

        profile = await prisma.customerProfile.create({
          data: {
            clerkId: userId,
            name: nameVal,
            email: clerkUser.emailAddresses[0]?.emailAddress ?? "",
            phone: clerkUser.phoneNumbers[0]?.phoneNumber ?? null,
            profilePhoto: clerkUser.imageUrl ?? null,
            referralCode: code,
          },
        });
      }
    } else if (!profile.referralCode) {
      const prefix = profile.name.replace(/[^A-Za-z0-9]/g, "").slice(0, 4).toUpperCase() || "L2L";
      const random = Math.floor(1000 + Math.random() * 9000);
      const code = `${prefix}-${random}`;
      profile = await prisma.customerProfile.update({
        where: { id: profile.id },
        data: { referralCode: code },
      });
    }

    return NextResponse.json({ profile });
  } catch (err) {
    console.error("Get profile error:", err);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const {
      name,
      phone,
      address,
      city,
      pincode,
      latitude,
      longitude,
      profilePhoto,
    } = data;

    const profile = await prisma.customerProfile.upsert({
      where: { clerkId: userId },
      update: {
        name,
        phone,
        address,
        city,
        pincode,
        latitude,
        longitude,
        profilePhoto,
      },
      create: {
        clerkId: userId,
        name: name || "Customer",
        email: data.email || "",
        phone,
        address,
        city,
        pincode,
        latitude,
        longitude,
        profilePhoto,
      },
    });

    return NextResponse.json({ profile });
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}

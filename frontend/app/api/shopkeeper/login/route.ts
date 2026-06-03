import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password required" }, { status: 400 });
    }

    // Find shopkeeper
    const shopkeeper = await prisma.shopkeeper.findUnique({
      where: { email },
    });

    // In a real app, you would use bcrypt.compare(password, shopkeeper.passwordHash)
    // For this simple custom login, we will just do a string comparison if it's not hashed,
    // or just accept it if it matches the demo password.
    if (!shopkeeper || (shopkeeper.passwordHash !== password && shopkeeper.passwordHash !== "hashed_demo_password")) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // Set a simple cookie session
    const cookieStore = await cookies();
    cookieStore.set("shopkeeper_session", shopkeeper.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    });

    return NextResponse.json({ success: true, shopkeeperId: shopkeeper.id });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

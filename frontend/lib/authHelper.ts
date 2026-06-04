import { cookies } from "next/headers";
import prisma from "./prisma";
import { Shop } from "@prisma/client";

export async function getShopkeeperId(): Promise<string | null> {
  // Try custom cookie session only
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("shopkeeper_session");
    if (session?.value) {
      return session.value;
    }
  } catch (e) {
    // Ignore
  }

  return null;
}

export async function getShopkeeperShop(): Promise<Shop | null> {
  const shopkeeperId = await getShopkeeperId();
  if (!shopkeeperId) return null;

  try {
    return await prisma.shop.findUnique({
      where: { shopkeeperId },
    });
  } catch (error) {
    console.error("Error fetching shopkeeper shop:", error);
    return null;
  }
}

"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

export async function getVaultPageData() {
  const user = await currentUser(); // ✅ Reliable way to get the logged-in user

  console.log("🔐 Clerk currentUser:", user?.id);

  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const dbUser = await db.user.findUnique({
    where: { clerkUserId: user.id },
    select: { vaultPassword: true },
  });

  return {
    isPasswordSet: !!dbUser?.vaultPassword,
  };
}

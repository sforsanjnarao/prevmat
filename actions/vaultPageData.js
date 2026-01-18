"use server";

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getVaultPageData() {
  const user = await currentUser(); // ✅ Reliable way to get the logged-in user

  console.log("🔐 Clerk currentUser:", user?.id);

  if (!user?.id) {
    throw new Error("Unauthorized");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: user.id },
    select: { vaultPassword: true },
  });

  return {
    isPasswordSet: !!dbUser?.vaultPassword, //making string boolean
  };
}

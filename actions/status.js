"use server";

import { db } from "@/lib/prisma";

export async function getVaultPasswordStatus(userId) {
    console.log("Checking Vault password status for userId:", userId);
  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
      select: {
        vaultPassword: true,
      },
    });

    return {
      isPasswordSet: !!user?.vaultPassword,
    };
  } catch (error) {
    console.error("Error checking Vault password status:", error);
    throw new Error("Failed to check vault password status");
  }
}

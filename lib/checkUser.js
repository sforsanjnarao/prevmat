import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) return null;

  const email = user.emailAddresses[0]?.emailAddress ?? "";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const clerkUserId = user.id;

  try {
    // Try upserting based on email to avoid P2002 errors
    const upsertedUser = await db.user.upsert({
      where: { email },
      update: {
        // update Clerk ID if missing or changed (optional but recommended)
        clerkUserId,
        name,
        // Add other fields you want to sync from Clerk
      },
      create: {
        email,
        name,
        clerkUserId,
        // Optionally initialize other fields like vaultPassword, etc.
      },
    });

    console.log("✅ Found or created user in DB:", upsertedUser.id);
    return upsertedUser;
  } catch (error) {
    console.error("❌ Failed to upsert user:", error);
    return null;
  }
};

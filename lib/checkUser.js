import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "./prisma";


console.log('in api:',process.env.DATABASE_URL)
// console.log('with prisma',prisma)
export const checkUser = async () => {
  const user = await currentUser();
  if (!user) return null;

  const email = user.emailAddresses[0]?.emailAddress ?? "";
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const clerkUserId = user.id;
  console.log('email:',email)
  console.log('name:',name)
  console.log('clerkUserId:',clerkUserId)


  try {
    const upsertedUser = await prisma.user.upsert({
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
    console.log(upsertedUser)
    console.log("✅ Found or created user in prisma:", upsertedUser.id);
    return upsertedUser;
  } catch (error) {
    console.error("❌ Failed to upsert user:", error);
    return null;
  }
};

// app/api/vault-password/route.ts

import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/generated/prisma";
import argon2 from "argon2";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    console.log("User ID from Clerk:", userId);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { newPassword } = await req.json();

    const hashedVaultPassword = await argon2.hash(newPassword);

    await prisma.user.update({
      where: { clerkUserId: userId },
      data: { vaultPassword: hashedVaultPassword },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

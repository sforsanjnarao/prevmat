// app/api/vault/route.js
import { NextResponse } from 'next/server';
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma"; // Adjust path if needed
import { verify } from "argon2"; // Ensure argon2 is installed
import { vaultEncrypt } from "@/lib/vault-crypto"; // Use the updated encryption wrapper

const prisma = new PrismaClient();

// GET /api/vault - List vault items (non-sensitive data)
export async function GET(req) {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const dbUser = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const vaultItems = await prisma.vaultItem.findMany({
      where: { userId: dbUser.id },
      select: { // Only select data safe for listing
        id: true,
        website: true, // Unencrypted website name/URL for display
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
          website: 'asc' // Or createdAt, etc.
      }
    });

    return NextResponse.json(vaultItems, { status: 200 });

  } catch (error) {
    console.error("Error fetching vault items:", error);
    return NextResponse.json({ error: "Failed to fetch vault items" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/vault - Create a new vault item
export async function POST(req) {
  try {
    const { userId: clerkUserId } = getAuth(req);

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const dbUser = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!dbUser || !dbUser.vaultPassword) { // Check if vault setup is complete
      return NextResponse.json({ error: "User or vault setup not found" }, { status: 404 });
    }

    // Expecting { vaultPassword: "...", data: { website: "...", username: "...", ... } }
    const { vaultPassword, data } = await req.json();

    if (!vaultPassword || !data || !data.website || !data.username || !data.password) {
        return NextResponse.json({ error: "Missing required fields (vaultPassword, website, username, password)" }, { status: 400 });
    }

    // 1. Verify the provided vault password against the user's stored hash
    const isPasswordCorrect = await verify(dbUser.vaultPassword, vaultPassword);
    if (!isPasswordCorrect) {
      return NextResponse.json({ error: "Invalid vault password" }, { status: 403 }); // Forbidden
    }

    // 2. Encrypt the data using the verified vault password
    // vaultEncrypt now handles generating salt/iv and encrypting the 'data' object
    const { encryptedData, salt, iv } = await vaultEncrypt(vaultPassword, data);

    // 3. Store the encrypted data, salt, iv, and unencrypted website name
    const newVaultItem = await prisma.vaultItem.create({
      data: {
        userId: dbUser.id,
        website: data.website, // Store website unencrypted for listing/display
        encryptedData: encryptedData, // Store the single encrypted blob (Base64 string)
        salt: salt,             // Store the Base64 encoded salt string
        iv: iv,                 // Store the Base64 encoded IV string
        // Removed: username, encryptedPassword, notes (now inside encryptedData)
      },
    });

    // Return only a success message, not the created item data
    return NextResponse.json({ message: "Vault item created successfully", id: newVaultItem.id }, { status: 201 });

  } catch (error) {
    console.error("Error creating vault item:", error);
     // Handle potential Argon2 errors or other issues
     if (error.message.includes('verify')) {
        return NextResponse.json({ error: "Vault password verification failed" }, { status: 500 });
     }
    return NextResponse.json({ error: "Failed to create vault item" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
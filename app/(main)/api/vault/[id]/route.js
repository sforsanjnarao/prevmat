// app/api/vault/[id]/route.js
import { NextResponse } from 'next/server';
import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma"; // Adjust path
import { verify } from 'argon2';
import { vaultEncrypt } from '@/lib/vault-crypto';

const prisma = new PrismaClient();

// GET /api/vault/[id] - Fetch a single vault item (including encrypted data for client decryption)
export async function GET(req, { params }) {
  try {
    const { userId: clerkUserId } = getAuth(req);
    const { id: vaultId } = await params; // Get ID from route parameters

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!vaultId) {
      return NextResponse.json({ error: "Vault item ID missing" }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({ where: { clerkUserId } });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const vaultItem = await prisma.vaultItem.findUnique({
      where: {
        id: vaultId,
        userId: dbUser.id, // Ensure the item belongs to the authenticated user
      },
      select: { // Select fields needed for display and client-side decryption
        id: true,
        website: true,
        encryptedData: true,
        salt: true,
        iv: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!vaultItem) {
      return NextResponse.json({ error: "Vault item not found or access denied" }, { status: 404 });
    }

    return NextResponse.json(vaultItem, { status: 200 });

  } catch (error) {
    console.error(`Error fetching vault item ${params.id}:`, error);
    return NextResponse.json({ error: "Failed to fetch vault item" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}


// PUT/PATCH /api/vault/[id] - Update an existing vault item
export async function PUT(req, { params }) {
  try {
      const { userId: clerkUserId } = getAuth(req);
      const { id: vaultId } = await params;

      if (!clerkUserId) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (!vaultId) {
          return NextResponse.json({ error: "Vault item ID missing" }, { status: 400 });
      }

      const dbUser = await prisma.user.findUnique({ where: { clerkUserId } });
      if (!dbUser || !dbUser.vaultPassword) {
          return NextResponse.json({ error: "User or vault setup not found" }, { status: 404 });
      }

      const { vaultPassword, data } = await req.json();

      if (!vaultPassword || !data || !data.website || !data.username || !data.password) {
          return NextResponse.json({ error: "Missing required fields (vaultPassword, website, username, password)" }, { status: 400 });
      }

      // 1. Verify the provided vault password
      const isPasswordCorrect = await verify(dbUser.vaultPassword, vaultPassword);
      if (!isPasswordCorrect) {
          return NextResponse.json({ error: "Invalid vault password" }, { status: 403 });
      }

      // 2. Encrypt the updated data
      const { encryptedData, salt, iv } = await vaultEncrypt(vaultPassword, data);

      // 3. Update the vault item in the database
      const updatedVaultItem = await prisma.vaultItem.update({
          where: {
              id: vaultId,
              userId: dbUser.id,
          },
          data: {
              website: data.website, // Update unencrypted website
              encryptedData: encryptedData,
              salt: salt,
              iv: iv,
          },
      });

      if (!updatedVaultItem) {
          return NextResponse.json({ error: "Vault item not found or access denied" }, { status: 404 });
      }

      return NextResponse.json({ message: "Vault item updated successfully", id: updatedVaultItem.id }, { status: 200 });

  } catch (error) {
      console.error(`Error updating vault item ${params.id}:`, error);
      if (error.message.includes('verify')) {
          return NextResponse.json({ error: "Vault password verification failed" }, { status: 500 });
      }
      return NextResponse.json({ error: "Failed to update vault item" }, { status: 500 });
  } finally {
      await prisma.$disconnect();
  }
}

// DELETE /api/vault/[id] - Delete a vault item
export async function DELETE(req, { params }) {
  try {
      const { userId: clerkUserId } = getAuth(req);
      const { id: vaultId } = await params;

      if (!clerkUserId) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      if (!vaultId) {
          return NextResponse.json({ error: "Vault item ID missing" }, { status: 400 });
      }

      const dbUser = await prisma.user.findUnique({ where: { clerkUserId } });
      if (!dbUser || !dbUser.vaultPassword) {
          return NextResponse.json({ error: "User or vault setup not found" }, { status: 404 });
      }

      const { vaultPassword } = await req.json();
      if (!vaultPassword) {
          return NextResponse.json({ error: "Vault password is required" }, { status: 400 });
      }

      // 1. Verify the provided vault password
      const isPasswordCorrect = await verify(dbUser.vaultPassword, vaultPassword);
      if (!isPasswordCorrect) {
          return NextResponse.json({ error: "Invalid vault password" }, { status: 403 });
      }

      // 2. Delete the vault item
      const deletedVaultItem = await prisma.vaultItem.delete({
          where: {
              id: vaultId,
              userId: dbUser.id,
          },
      });

      if (!deletedVaultItem) {
          return NextResponse.json({ error: "Vault item not found or access denied" }, { status: 404 });
      }

      return NextResponse.json({ message: "Vault item deleted successfully", id: vaultId }, { status: 200 });

  } catch (error) {
      console.error(`Error deleting vault item ${params.id}:`, error);
      if (error.message.includes('verify')) {
          return NextResponse.json({ error: "Vault password verification failed" }, { status: 500 });
      }
      return NextResponse.json({ error: "Failed to delete vault item" }, { status: 500 });
  } finally {
      await prisma.$disconnect();
  }
}
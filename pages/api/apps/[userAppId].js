// pages/api/apps/[userAppId].js

import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { calculateAppRiskScore } from '@/lib/riskCalculator'; // Import calculator


const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { userAppId } = req.query; // Get the ID from the URL path

  if (!userAppId || typeof userAppId !== 'string') {
    return res.status(400).json({ error: "Invalid UserApp ID provided." });
  }

  let dbUserId = null;

  try {
    // --- 1. Authenticate and Ensure User Exists in DB ---
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: clerkUserId },
    });

    if (!dbUser) {
        return res.status(404).json({ error: "User synchronization failed" });
    }
    if (!dbUser?.id) {
      console.error(`API /api/apps/${userAppId}: Failed to find user in DB for Clerk ID:`, clerkUserId);
      return res.status(500).json({ error: "User synchronization failed" });
    }
    dbUserId = dbUser.id;

    // --- Find the specific UserApp entry to ensure it exists and belongs to the user ---
    const userAppEntry = await prisma.userApp.findUnique({
      where: {
        id: userAppId,
        // IMPORTANT: Also check userId to prevent users editing/deleting others' entries
        userId: dbUserId,
      },
    });

    if (!userAppEntry) {
      return res.status(404).json({ error: "Tracked app entry not found or you don't have permission." });
    }

    // --- Handle PUT Request (Update) ---
    if (req.method === 'PUT') {
      const { emailUsed, phoneUsed, locationAccess, notes } = req.body;

      // Prepare data for update (only include fields that are actually changing)
      const updateData = {};
      if (emailUsed !== undefined) updateData.emailUsed = emailUsed || null; // Allow clearing
      if (phoneUsed !== undefined) updateData.phoneUsed = phoneUsed || null; // Allow clearing
      if (locationAccess !== undefined) updateData.locationAccess = locationAccess;
      if (notes !== undefined) updateData.notes = notes || null; // Allow clearing

      if (Object.keys(updateData).length === 0) {
          return res.status(400).json({ error: "No fields provided for update." });
      }

      const updatedUserApp = await prisma.userApp.update({
        where: {
          id: userAppId,
          // Redundant check, but good practice
          userId: dbUserId,
        },
        data: updateData,
        include: { app: true } // Return the updated data with app details
      });
      
      // --- Calculate Risk Score ---
      const riskScore = calculateAppRiskScore(updatedUserApp);

      return res.status(200).json({
        ...updatedUserApp,
        riskScore: riskScore, // Include the calculated risk score
      });

    // --- Handle DELETE Request ---
    } else if (req.method === 'DELETE') {
      await prisma.userApp.delete({
        where: {
          id: userAppId,
          // Redundant check, but good practice
          userId: dbUserId,
        },
      });

      return res.status(200).json({ message: "Tracked app removed successfully." }); // Or 204 No Content

    } else {
      // Handle other methods
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']); // Note: GET on this specific ID isn't implemented here
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }

  } catch (error) {
    console.error(`API /api/apps/${userAppId} Error:`, error);
    res.status(500).json({ error: "Failed to process request" });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}
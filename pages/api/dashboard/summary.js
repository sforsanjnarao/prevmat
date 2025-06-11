// pages/api/dashboard/summary.js

import { getAuth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { calculateAppRiskScore, calculateOverallRisk } from '@/lib/riskCalculator'; // Your risk calculator

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let dbUserId = null;

    try {
      // --- 1. Authenticate and Ensure User Exists in DB ---
      const { userId: clerkUserId } = getAuth(req);
      if (!clerkUserId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

       // ✅ Convert Clerk ID to DB userId
       const dbUser = await prisma.user.findUnique({
        where: { clerkUserId: clerkUserId },
    });

      if (!dbUser?.id) {
        console.error("GET /api/dashboard/summary: User sync failed for Clerk ID:", clerkUserId);
        return res.status(500).json({ error: "User synchronization failed" });
      }
      dbUserId = dbUser.id;

      // --- 2. Perform Database Queries in Parallel ---
      const [
        trackedAppsCount,
        vaultItemsCount,
        userBreachesCount,
        trackedAppsData // Fetch full data needed for risk calculation
      ] = await prisma.$transaction([
        prisma.userApp.count({ where: { userId: dbUserId } }),
        prisma.vaultItem.count({ where: { userId: dbUserId } }),
        prisma.userBreach.count({ where: { userId: dbUserId } }),
        prisma.userApp.findMany({
          where: { userId: dbUserId },
          include: { app: true } // Include app data for risk calculation
        })
      ]);

      // --- 3. Calculate Overall Risk Score ---
      // Calculate individual scores first if not already done
      const appsWithScores = trackedAppsData.map(ua => ({
        ...ua,
        riskScore: calculateAppRiskScore(ua), // Pass the full userApp object
      }));
      const overallRisk = calculateOverallRisk(appsWithScores);

      // --- 4. Construct the Summary Response ---
      const summaryData = {
        trackedAppsCount,
        vaultItemsCount,
        userBreachesCount,
        overallRisk, // Includes score and level
        // You could add more here, like recent breaches, highest risk app name etc.
      };

      res.status(200).json(summaryData);

    } catch (error) {
      console.error("GET /api/dashboard/summary Error:", error);
      res.status(500).json({ error: "Failed to fetch dashboard summary" });
    } finally {
      if (prisma) {
        await prisma.$disconnect();
      }
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
// app/api/breaches/user-history/route.js

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { NextResponse } from "next/server";
import { checkUser } from "@/lib/checkUser"; // Import the checkUser function

const prisma = new PrismaClient();

export async function GET(req) {
    let dbUserId = null;
    try {
        // --- 1. Authenticate and Ensure User Exists in DB ---
        const user = await checkUser();
        if (!user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }


        // --- 2. Fetch stored UserBreach records for the user ---
        const userBreaches = await prisma.userBreach.findMany({
            where: { userId: user.id },
            orderBy: { dataBreach: { breachDate: 'desc' } }, // Order by breach date
            include: {
                dataBreach: true, // Include the details of each linked breach
            },
        });

        // --- 3. Format the response ---
        const formattedBreaches = userBreaches.map(ub => ({
            id: ub.dataBreach.id, // Breach ID
            name: ub.dataBreach.name,
            date: ub.dataBreach.breachDate.toISOString().split('T')[0],
            description: ub.dataBreach.description,
            compromisedData: ub.dataBreach.dataTypesLeaked?.split(';') || [],
            emailChecked: ub.emailCompromised, // Which email was checked for this record
            addedToHistoryAt: ub.createdAt, // When was this link created
        }));

        return NextResponse.json({ breaches: formattedBreaches });

    } catch (error) {
        console.error("GET /api/breaches/user-history Error:", error);
        return NextResponse.json({ error: "Failed to fetch user breach history" }, { status: 500 });
    } finally {
        if (prisma) await prisma.$disconnect();
    }
}
// app/api/breaches/check-my-email/route.js

import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@/lib/generated/prisma"; // Assuming default generation path
import { NextResponse } from "next/server";
import axios from "axios";
import { checkUser } from "@/lib/checkUser"; // Import the checkUser function

const prisma = new PrismaClient();

// Using POST as it triggers an action (check & potentially update DB)
export async function POST(req) {
    let dbUserId = null;
    let userEmail = null;

    try {
        // --- 1. Authenticate and Get User from DB ---
        const user = await checkUser();
        if (!user) {
          return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        
        dbUserId = user.id;
        userEmail = user.email; // Use the email stored in your database

        console.log(`check-my-email: Checking email "${userEmail}" for user ID "${dbUserId}"`);

        if (!userEmail || !/\S+@\S+\.\S+/.test(userEmail)) {
            console.error(`check-my-email: Invalid email format found for user ${dbUserId}: ${userEmail}`);
            return NextResponse.json({ error: "Invalid email format associated with user" }, { status: 400 });
        }

        // --- 2. Call XposedOrNot Breach Analytics API ---
        const apiUrl = `https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(userEmail)}`;
        const xposedResponse = await axios.get(apiUrl, {
            validateStatus: (status) => (status >= 200 && status < 300) || status === 404,
        });

        // --- 3. Process the response ---
        if (xposedResponse.status === 404 || xposedResponse.data.Error === "Not found") {
            console.log(`check-my-email: No breaches found for ${userEmail}`);
            // Optionally: Update user record to indicate a successful check with no results?
            return NextResponse.json({ message: "No breaches found for your email.", breaches: [] });
        }

        const responseData = xposedResponse.data;
        let breachesFoundInThisCheck = []; // Track breaches found in *this* specific API call

        if (responseData.ExposedBreaches?.breaches_details) {
            console.log(`check-my-email: Found ${responseData.ExposedBreaches.breaches_details.length} potential breaches for ${userEmail}`);

            for (const breachDetail of responseData.ExposedBreaches.breaches_details) {
                const normalizedName = breachDetail.breach.trim().toLowerCase();

                // 1. Find or Create DataBreach record
                // Use upsert for atomicity and simplicity if name is unique
                let breachDate = new Date(); // Default
                 try {
                     if (breachDetail.xposed_date && /^\d{4}$/.test(breachDetail.xposed_date)) {
                         breachDate = new Date(parseInt(breachDetail.xposed_date, 10), 0, 1);
                     }
                 } catch (dateError) { console.error(`Error parsing date: ${breachDetail.xposed_date}`); }

                const dbBreach = await prisma.dataBreach.upsert({
                    where: { name: normalizedName },
                    update: { // Optional: Update details if they change in the API
                        description: breachDetail.details || null,
                        dataTypesLeaked: breachDetail.xposed_data || null,
                        pwnedCount: breachDetail.xposed_records || null,
                        breachDate: breachDate, // Update date too
                    },
                    create: {
                        name: normalizedName,
                        breachDate: breachDate,
                        description: breachDetail.details || null,
                        dataTypesLeaked: breachDetail.xposed_data || null,
                        pwnedCount: breachDetail.xposed_records || null,
                    },
                });

                // 2. Create or Update UserBreach link
                await prisma.userBreach.upsert({
                    where: {
                        userId_dataBreachId: {
                            userId: dbUserId,
                            dataBreachId: dbBreach.id,
                        }
                    },
                    update: { // Update the emailCompromised if needed (e.g., if case changed)
                        emailCompromised: userEmail,
                        updatedAt: new Date(), // Explicitly update timestamp
                     },
                    create: {
                        userId: dbUserId,
                        dataBreachId: dbBreach.id,
                        emailCompromised: userEmail,
                    }
                });
                console.log(`check-my-email: Upserted UserBreach link for user ${dbUserId} and breach ${dbBreach.id}`);

                // 3. Prepare data for frontend response (only for this specific check)
                breachesFoundInThisCheck.push({
                    id: dbBreach.id,
                    name: breachDetail.breach, // Use original casing for display
                    date: dbBreach.breachDate.toISOString().split('T')[0],
                    description: dbBreach.description,
                    compromisedData: dbBreach.dataTypesLeaked?.split(';') || [],
                });
            }
        }

        console.log(`check-my-email: Completed check for ${userEmail}. Found ${breachesFoundInThisCheck.length} breaches in this check.`);
        return NextResponse.json({
            message: `Breach check complete for ${userEmail}.`,
            breaches: breachesFoundInThisCheck
        });

    } catch (error) {
        console.error("check-my-email API error:", error.response?.data || error.message, error.stack);
        return NextResponse.json({ error: "Failed to check for breaches" }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

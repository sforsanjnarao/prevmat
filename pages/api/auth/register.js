// pages/api/auth/register.js

import { getAuth } from "@clerk/nextjs/server";

import { prisma } from "@/lib/prisma";


export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { userId } = getAuth(req);

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { name, email } = req.body; // Assuming you're sending name and email

      // Create a new user record in your database
      const user = await prisma.user.create({
        data: {
          id: userId, // Use the Clerk userId as the primary key in your User table
          name: name,
          email: email,
        },
      });

      res.status(201).json({ message: "User registered successfully" ,user});
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Failed to create user" });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
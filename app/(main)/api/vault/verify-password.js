// pages/api/vault/verify-password.js

import { getAuth } from '@clerk/nextjs/server';
import argon2 from 'argon2';
import { db } from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the body (req.body is already parsed by default in Next.js Pages API)
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Get the authenticated user
    const { userId: clerkUserId } = getAuth(req);
    if (!clerkUserId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const user = await db.user.findUnique({
      where: { clerkUserId },
    });

    if (!user || !user.vaultPassword) {
      return res.status(400).json({ error: 'Vault password not set' });
    }

    const isValid = await argon2.verify(user.vaultPassword, password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

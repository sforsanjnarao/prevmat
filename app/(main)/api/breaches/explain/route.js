// app/(main)/api/breaches/explain/route.js
// POST a single breach record -> returns an AI-generated, plain-English
// explanation + recommended actions. Auth-gated so it can't be used as a
// free, unauthenticated proxy to our OpenAI key.

import { NextResponse } from 'next/server';
import { checkUser } from '@/lib/checkUser';
import { explainBreach } from '@/lib/ai/breachExplainer';

export async function POST(req) {
  try {
    // --- Auth: only logged-in users may spend tokens ---
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    if (!body || !body.name) {
      return NextResponse.json(
        { error: 'A breach object with at least a "name" is required.' },
        { status: 400 }
      );
    }

    const explanation = await explainBreach({
      name: body.name,
      date: body.date,
      pwnedCount: body.pwnedCount,
      compromisedData: body.compromisedData,
      description: body.description,
    });

    return NextResponse.json({ explanation });
  } catch (error) {
    // Surface config errors (missing key) distinctly from model errors.
    const isConfig = /OPENAI_API_KEY/.test(error?.message || '');
    console.error('POST /api/breaches/explain error:', error?.message, error?.stack);
    return NextResponse.json(
      { error: isConfig ? 'AI is not configured on the server.' : 'Failed to generate explanation.' },
      { status: isConfig ? 503 : 500 }
    );
  }
}

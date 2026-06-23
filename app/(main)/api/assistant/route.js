// app/(main)/api/assistant/route.js
// Privacy chatbot endpoint. POST { message, history } -> { reply }.
// Auth-gated: the agent is scoped to the signed-in user's DB id, so tools only
// ever read that user's data.

import { NextResponse } from 'next/server';
import { checkUser } from '@/lib/checkUser';
import { runPrivacyAgent } from '@/lib/ai/privacyAgent';

// Cap history so a crafted client can't blow up token usage.
const MAX_HISTORY = 10;

export async function POST(req) {
  try {
    const user = await checkUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const message = body?.message;
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'A non-empty "message" is required.' }, { status: 400 });
    }

    const history = Array.isArray(body?.history) ? body.history.slice(-MAX_HISTORY) : [];

    const reply = await runPrivacyAgent({
      userId: user.id,
      userEmail: user.email,
      message,
      history,
    });

    return NextResponse.json({ reply });
  } catch (error) {
    const isConfig = /OPENAI_API_KEY/.test(error?.message || '');
    console.error('POST /api/assistant error:', error?.message, error?.stack);
    return NextResponse.json(
      { error: isConfig ? 'AI is not configured on the server.' : 'The assistant failed to respond.' },
      { status: isConfig ? 503 : 500 }
    );
  }
}

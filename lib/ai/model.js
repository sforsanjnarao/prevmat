// lib/ai/model.js
// Single place that constructs the LangChain chat model used across Privmat's
// AI features (breach/risk explainer today, chatbot next). Reading the key here
// means every consumer fails loud in one spot if it's missing.

import { ChatOpenAI } from '@langchain/openai';

let cachedModel = null;

/**
 * Returns a shared ChatOpenAI instance.
 * Throws if OPENAI_API_KEY is not configured so callers get a clear,
 * server-side failure instead of a cryptic LangChain error mid-request.
 */
export function getChatModel() {
  if (cachedModel) return cachedModel;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'OPENAI_API_KEY is not set. Add it to your .env to enable AI features.'
    );
  }

  cachedModel = new ChatOpenAI({
    apiKey,
    // Cheap + fast, plenty for short plain-English explanations.
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: 0.2,
    maxRetries: 2,
  });

  return cachedModel;
}

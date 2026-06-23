// lib/ai/privacyAgent.js
// LangChain v1 tool-calling agent that answers a user's privacy questions by
// calling the read-only, user-scoped tools in privacyTools.js.

import { createAgent } from 'langchain';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { getChatModel } from './model.js';
import { buildPrivacyTools } from './privacyTools.js';

const SYSTEM_PROMPT = [
  'You are Privmat\'s privacy assistant. You help the signed-in user understand',
  'their own digital footprint: which apps hold their data, what breaches affect',
  'them, and how exposed they are.',
  '',
  'Rules:',
  '- Answer ONLY from the tools. Never invent app names, breaches, or numbers.',
  '- Always call a tool before answering a data question; do not guess from memory.',
  '- For ANY question about whether an email has been breached, use check_email_breaches_live',
  '  (a fresh scan). Only use list_my_breaches if the user explicitly asks about their saved',
  '  history. Never claim an email is breach-free based on stored history alone.',
  '- If the tools return nothing, say so plainly (e.g. "You have no apps that store your phone number").',
  '- Be concise and concrete. Prefer short lists over long paragraphs.',
  '- You can only see THIS user\'s data; never claim to access anyone else\'s.',
  '- For risk questions, explain briefly why something is risky (e.g. location + a known breach).',
].join('\n');

/**
 * Run one turn of the privacy chatbot.
 * @param {Object} params
 * @param {string} params.userId - Privmat DB user id.
 * @param {string} [params.userEmail] - The user's registered email (for live breach checks).
 * @param {string} params.message - The user's new message.
 * @param {Array<{role:'user'|'assistant', content:string}>} [params.history] - Prior turns.
 * @returns {Promise<string>} The assistant's reply text.
 */
export async function runPrivacyAgent({ userId, userEmail, message, history = [] }) {
  if (!userId) throw new Error('runPrivacyAgent: userId is required');
  if (!message || !message.trim()) throw new Error('runPrivacyAgent: message is required');

  const agent = createAgent({
    model: getChatModel(),
    tools: buildPrivacyTools({ userId, userEmail }),
    systemPrompt: SYSTEM_PROMPT,
  });

  // Map prior turns + new message into LangChain messages.
  const priorMessages = history
    .filter((m) => m && m.content)
    .map((m) =>
      m.role === 'assistant'
        ? new AIMessage(m.content)
        : new HumanMessage(m.content)
    );

  const result = await agent.invoke({
    messages: [...priorMessages, new HumanMessage(message)],
  });

  // The agent returns the full message list; the last one is the answer.
  const messages = result?.messages || [];
  const last = messages[messages.length - 1];
  const content = last?.content;

  if (typeof content === 'string') return content;
  // Anthropic/OpenAI can return content as an array of parts.
  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part === 'string' ? part : part?.text || ''))
      .join('')
      .trim();
  }
  return 'Sorry, I could not generate a response.';
}

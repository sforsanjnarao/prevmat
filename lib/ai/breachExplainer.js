// lib/ai/breachExplainer.js
// LangChain chain that turns a raw breach record (from XposedOrNot / our DB)
// into a short, plain-English explanation a non-technical user can act on.
//
// Uses model.withStructuredOutput() with a JSON schema so the model is forced
// to return well-shaped JSON — no brittle string parsing. We use a JSON schema
// (not zod) to avoid pulling in an extra dependency.

import { ChatPromptTemplate } from '@langchain/core/prompts';
import { getChatModel } from './model.js';

// JSON schema the model must conform to.
const EXPLANATION_SCHEMA = {
  name: 'breach_explanation',
  description: 'A plain-English explanation of a single data breach for a non-technical user.',
  type: 'object',
  properties: {
    severity: {
      type: 'string',
      enum: ['Low', 'Medium', 'High', 'Critical'],
      description: 'Overall severity for the affected user, based on what data leaked.',
    },
    plainEnglish: {
      type: 'string',
      description: '2-3 sentence summary of what happened and why it matters, no jargon.',
    },
    whatLeaked: {
      type: 'array',
      items: { type: 'string' },
      description: 'Short bullets naming the specific data that was exposed, in plain words.',
    },
    recommendedActions: {
      type: 'array',
      items: { type: 'string' },
      description: 'Concrete next steps the user should take, most important first.',
    },
  },
  required: ['severity', 'plainEnglish', 'whatLeaked', 'recommendedActions'],
  additionalProperties: false,
};

const prompt = ChatPromptTemplate.fromMessages([
  [
    'system',
    [
      'You are a privacy assistant for Privmat, a personal data-protection dashboard.',
      'Explain a data breach to a non-technical person clearly and calmly.',
      'Be accurate and specific to the data that actually leaked — do not invent details.',
      'Do not be alarmist, but do not downplay genuine risk (e.g. leaked passwords).',
      'Keep it concise.',
    ].join(' '),
  ],
  [
    'human',
    [
      'Explain this breach:',
      'Name: {name}',
      'Date: {date}',
      'Accounts affected (approx): {pwnedCount}',
      'Data types leaked: {dataTypes}',
      'Provider description: {description}',
    ].join('\n'),
  ],
]);

/**
 * @param {Object} breach
 * @param {string} breach.name
 * @param {string} [breach.date]
 * @param {number|null} [breach.pwnedCount]
 * @param {string[]} [breach.compromisedData]  e.g. ['Email addresses','Passwords']
 * @param {string} [breach.description]
 * @returns {Promise<{severity:string, plainEnglish:string, whatLeaked:string[], recommendedActions:string[]}>}
 */
export async function explainBreach(breach) {
  if (!breach || !breach.name) {
    throw new Error('explainBreach: breach.name is required');
  }

  const model = getChatModel();
  const structured = model.withStructuredOutput(EXPLANATION_SCHEMA);
  const chain = prompt.pipe(structured);

  const dataTypes =
    Array.isArray(breach.compromisedData) && breach.compromisedData.length > 0
      ? breach.compromisedData.join(', ')
      : 'Not specified';

  return chain.invoke({
    name: breach.name,
    date: breach.date || 'Unknown',
    pwnedCount:
      typeof breach.pwnedCount === 'number'
        ? breach.pwnedCount.toLocaleString()
        : 'Unknown',
    dataTypes,
    description: breach.description || 'No description provided.',
  });
}

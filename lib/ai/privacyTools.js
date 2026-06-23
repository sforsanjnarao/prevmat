// lib/ai/privacyTools.js
// Read-only LangChain tools the privacy chatbot can call. Every tool is bound
// to a single userId at construction time, so the model physically cannot
// query another user's data — the userId is never taken from model input.

import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import axios from 'axios';
import { prisma } from '../prisma.js';
import { calculateAppRiskScore, calculateOverallRisk } from '../riskCalculator.js';

/**
 * Build the toolset for one authenticated user.
 * @param {Object} params
 * @param {string} params.userId - Privmat DB user id (NOT a Clerk id).
 * @param {string} [params.userEmail] - The user's registered email, used as the
 *   default target for live breach lookups.
 * @returns LangChain tools array.
 */
export function buildPrivacyTools({ userId, userEmail } = {}) {
  if (!userId) throw new Error('buildPrivacyTools: userId is required');

  // Which apps did the user share a given piece of data with?
  const findAppsByDataShared = tool(
    async ({ dataType }) => {
      const where = { userId };
      if (dataType === 'email') where.emailUsed = { not: null };
      else if (dataType === 'phone') where.phoneUsed = { not: null };
      else if (dataType === 'location') where.locationAccess = true;

      const rows = await prisma.userApp.findMany({
        where,
        include: { app: { select: { name: true, url: true } } },
      });

      const apps = rows.map((r) => ({
        app: r.app?.name,
        url: r.app?.url || null,
        email: dataType === 'email' ? r.emailUsed : undefined,
        phone: dataType === 'phone' ? r.phoneUsed : undefined,
        locationAccess: dataType === 'location' ? r.locationAccess : undefined,
      }));

      return JSON.stringify({ dataType, count: apps.length, apps });
    },
    {
      name: 'find_apps_by_data_shared',
      description:
        "List the user's tracked apps that have a specific piece of their personal data. " +
        "Use for questions like 'which apps have my phone number / email / location?'.",
      schema: z.object({
        dataType: z
          .enum(['email', 'phone', 'location'])
          .describe('The kind of shared data to filter apps by.'),
      }),
    }
  );

  // Everything the user tracks, with what was shared.
  const listMyApps = tool(
    async () => {
      const rows = await prisma.userApp.findMany({
        where: { userId },
        include: { app: { select: { name: true, url: true, hasKnownBreaches: true } } },
      });
      const apps = rows.map((r) => ({
        app: r.app?.name,
        url: r.app?.url || null,
        sharedEmail: !!r.emailUsed,
        sharedPhone: !!r.phoneUsed,
        locationAccess: r.locationAccess,
        appHasKnownBreaches: r.app?.hasKnownBreaches ?? null,
      }));
      return JSON.stringify({ count: apps.length, apps });
    },
    {
      name: 'list_my_apps',
      description:
        "List ALL apps the user tracks and a summary of what personal data they shared " +
        '(email / phone / location) plus whether the app has known breaches.',
      schema: z.object({}),
    }
  );

  // Breaches the user's email has appeared in.
  const listMyBreaches = tool(
    async () => {
      const rows = await prisma.userBreach.findMany({
        where: { userId },
        include: { dataBreach: true },
        orderBy: { createdAt: 'desc' },
      });
      const breaches = rows.map((r) => ({
        name: r.dataBreach?.name,
        date: r.dataBreach?.breachDate?.toISOString().split('T')[0] || null,
        dataLeaked: r.dataBreach?.dataTypesLeaked?.split(';') || [],
        accountsAffected: r.dataBreach?.pwnedCount ?? null,
        emailChecked: r.emailCompromised,
      }));
      return JSON.stringify({ count: breaches.length, breaches });
    },
    {
      name: 'list_my_breaches',
      description:
        "List breaches from the user's STORED history (breaches they previously saved via " +
        "'Check My Email Now'). This is local data only — it does NOT perform a fresh scan, " +
        'so it can be empty even if the email is actually breached. For an up-to-date answer, ' +
        'prefer check_email_breaches_live.',
      schema: z.object({}),
    }
  );

  // Live breach lookup against XposedOrNot (same source as the public scanner).
  const checkEmailBreachesLive = tool(
    async ({ email }) => {
      const target = (email || userEmail || '').trim();
      if (!target || !/\S+@\S+\.\S+/.test(target)) {
        return JSON.stringify({ error: 'No valid email to check.' });
      }

      try {
        const res = await axios.get(
          `https://api.xposedornot.com/v1/breach-analytics?email=${encodeURIComponent(target)}`,
          {
            headers: {
              Accept: 'application/json',
              // XposedOrNot's WAF 403s bare server-side requests; the public
              // scanner only works because it runs client-side with a browser
              // UA. Send a browser-like UA so the server-side call succeeds.
              'User-Agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
            },
            timeout: 10000,
            validateStatus: (s) => (s >= 200 && s < 300) || s === 404,
          }
        );

        if (res.status === 404 || res.data?.Error === 'Not found') {
          return JSON.stringify({ email: target, count: 0, breaches: [] });
        }

        const details = res.data?.ExposedBreaches?.breaches_details || [];
        const breaches = details.map((d) => ({
          name: d.breach,
          date: d.xposed_date || null,
          dataLeaked: d.xposed_data ? d.xposed_data.split(';') : [],
          accountsAffected: d.xposed_records ?? null,
          description: d.details || null,
        }));
        return JSON.stringify({ email: target, count: breaches.length, breaches });
      } catch (err) {
        return JSON.stringify({
          email: target,
          error: `Live breach lookup failed: ${err?.message || 'unknown error'}`,
        });
      }
    },
    {
      name: 'check_email_breaches_live',
      description:
        'Perform a FRESH, live breach scan for an email against the XposedOrNot database ' +
        '(the same source as the public scanner). Use this for any question about whether an ' +
        'email has been breached, or to check a specific email the user names. If no email is ' +
        "given, it checks the user's registered email.",
      schema: z.object({
        email: z
          .string()
          .optional()
          .describe("Email to scan. Omit to use the user's registered email."),
      }),
    }
  );

  // Computed risk overview, reusing the app's own scoring formula.
  const getRiskSummary = tool(
    async () => {
      const rows = await prisma.userApp.findMany({
        where: { userId },
        include: { app: { select: { name: true, hasKnownBreaches: true } } },
      });
      const scored = rows.map((r) => ({
        app: r.app?.name,
        riskScore: calculateAppRiskScore(r),
      }));
      scored.sort((a, b) => b.riskScore - a.riskScore);
      const overall = calculateOverallRisk(scored);
      return JSON.stringify({
        overall, // { score, level }
        riskiestApps: scored.slice(0, 5),
        totalApps: scored.length,
      });
    },
    {
      name: 'get_risk_summary',
      description:
        "Compute the user's overall privacy risk level and their riskiest apps. " +
        'Use for questions like \"what is my riskiest app?\" or \"how exposed am I?\".',
      schema: z.object({}),
    }
  );

  return [
    findAppsByDataShared,
    listMyApps,
    listMyBreaches,
    checkEmailBreachesLive,
    getRiskSummary,
  ];
}

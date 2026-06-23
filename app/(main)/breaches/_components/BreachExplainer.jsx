// app/(main)/breaches/_components/BreachExplainer.jsx
// Reusable "Explain with AI" widget. Drop it inside any breach card/accordion
// and pass the breach object. It calls /api/breaches/explain (LangChain ->
// OpenAI) and renders a plain-English summary + recommended actions.
//
// Used by both BreachCheckerPublic.jsx (public scan) and MyBreaches.jsx
// (logged-in history). The route is auth-gated, so on the public page an
// anonymous user gets a clear "sign in" message instead of a silent failure.

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, ShieldAlert } from 'lucide-react';

const SEVERITY_STYLES = {
  Low: 'text-green-600 dark:text-green-400',
  Medium: 'text-yellow-600 dark:text-yellow-400',
  High: 'text-orange-600 dark:text-orange-400',
  Critical: 'text-red-600 dark:text-red-400',
};

const BreachExplainer = ({ breach }) => {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [error, setError] = useState(null);

  const handleExplain = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/breaches/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: breach.name,
          date: breach.date,
          pwnedCount: breach.pwnedCount,
          compromisedData: breach.compromisedData,
          description: breach.description,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          res.status === 401
            ? 'Sign in to get an AI explanation.'
            : data.error || `Request failed (${res.status}).`
        );
      }
      setExplanation(data.explanation);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (explanation) {
    const sevClass = SEVERITY_STYLES[explanation.severity] || '';
    return (
      <div className="mt-3 rounded-md border bg-muted/40 p-3 text-xs space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="font-semibold">AI explanation</span>
          <span className={`ml-auto font-semibold ${sevClass}`}>
            {explanation.severity} risk
          </span>
        </div>
        <p className="text-muted-foreground">{explanation.plainEnglish}</p>

        {explanation.whatLeaked?.length > 0 && (
          <div>
            <strong>What leaked:</strong>
            <ul className="list-disc list-inside text-muted-foreground">
              {explanation.whatLeaked.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {explanation.recommendedActions?.length > 0 && (
          <div>
            <strong>What to do:</strong>
            <ul className="list-disc list-inside text-muted-foreground">
              {explanation.recommendedActions.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2">
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={handleExplain}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
        ) : (
          <Sparkles className="mr-2 h-3.5 w-3.5" />
        )}
        {loading ? 'Explaining…' : 'Explain with AI'}
      </Button>
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
          <ShieldAlert className="h-3 w-3" /> {error}
        </p>
      )}
    </div>
  );
};

export default BreachExplainer;

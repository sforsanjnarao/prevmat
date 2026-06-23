// app/(main)/assistant/_components/PrivacyChat.jsx
// Client chat UI for the privacy assistant. Talks to /api/assistant, keeps a
// short in-memory history, and sends it back each turn for follow-up context.

'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Loader2, Send } from 'lucide-react';

const SUGGESTIONS = [
  'Which apps have my phone number?',
  'Have I been in any breaches?',
  "What's my riskiest app?",
  'Which apps can access my location?',
];

const PrivacyChat = () => {
  // messages: { role: 'user' | 'assistant', content: string }
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const message = (text ?? input).trim();
    if (!message || loading) return;

    const history = messages; // history BEFORE this turn
    const next = [...messages, { role: 'user', content: message }];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          res.status === 401
            ? 'Please sign in to use the assistant.'
            : data.error || `Request failed (${res.status}).`
        );
      }
      setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: `⚠️ ${err.message}`, isError: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardContent className="p-4">
        <div ref={scrollRef} className="h-96 overflow-y-auto space-y-3 pr-1">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-center">
              <Sparkles className="h-8 w-8 text-primary" />
              <p className="text-sm text-muted-foreground">Try one of these:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <Button
                    key={s}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => send(s)}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : m.isError
                      ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                      : 'bg-muted'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2 text-sm flex items-center gap-2">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about your data…"
            rows={1}
            disabled={loading}
            className="resize-none min-h-10"
          />
          <Button onClick={() => send()} disabled={loading || !input.trim()} size="icon">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrivacyChat;

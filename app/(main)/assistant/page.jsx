import PrivacyChat from './_components/PrivacyChat';

export const metadata = {
  title: 'Privacy Assistant - Ask About Your Data',
  description:
    "Ask Privmat's AI assistant about your digital footprint: which apps have your data, breaches that affect you, and your privacy risk.",
};

export default function AssistantPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-20 md:py-24 flex flex-col items-center gap-6">
      <div className="text-center max-w-xl">
        <h1 className="text-3xl font-bold tracking-tighter mb-2">Privacy Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Ask about your own data — e.g. &ldquo;Which apps have my phone number?&rdquo;,
          &ldquo;Have I been in any breaches?&rdquo;, or &ldquo;What&rsquo;s my riskiest app?&rdquo;
        </p>
      </div>
      <PrivacyChat />
    </div>
  );
}

import PublicEmailChecker from "./_components/BreachCheckerPublic";

// --- SEO ---
// Use generateMetadata if you need async data, otherwise export metadata directly
export const metadata = {
  // **Title Tag:** Specific to this page's function
  title: 'Data Breach Check - See If Your Email Was Exposed',
  // **Meta Description:** Action-oriented description for this page
  description: "Has your email been compromised in a data breach? Use Privmat's free check (powered by XposedOrNot) and monitor your registered email's breach history.",
  keywords: ['check data breach', 'email breach', 'email leak', 'am i pwned', 'xposedornot', 'account security', 'password leak', 'haveibeenpwned'],
};

export default function DataBreachPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-20 md:py-24 lg:py-32 flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold tracking-tighter text-center mb-6">
        Check Data Breaches
      </h1>
      {/* <MyBreaches /> */}
      <PublicEmailChecker />
    </div>
  );
}
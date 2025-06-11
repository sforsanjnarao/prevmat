import PasswordGenerator from "./_components/PasswordGenerator";
// --- SEO ---
// Use generateMetadata if you need async data, otherwise export metadata directly
export const metadata = {
  // **Title Tag:** Specific to this page's function
  title: 'Generate a Secure Password - Protect Your Accounts',
  // **Meta Description:** Action-oriented description for this page
  description: "your password is your first line of defense against unauthorized access. Generate a strong password to protect your accounts and sensitive information.",
  keywords: ['generate password', 'password', 'strong password', 'secure password', 'password generator', 'account security', 'password leak', 'password manager', 'password strength'],
};

export default function PasswordGeneratePage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-20 md:py-24 lg:py-32 flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold tracking-tighter text-center mb-6">
        Generate a Secure Password
      </h1>
      <PasswordGenerator />
    </div>
  );
}
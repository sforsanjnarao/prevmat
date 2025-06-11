import { ShieldAlert, Eye, KeyRound, Vault, ListChecks /* Swapped Trash2 for Vault icon */ } from "lucide-react"; // Using Vault icon now

export const features = [
  {
    icon: <ShieldAlert className="w-10 h-10 mb-4 text-rose-500" />, // Changed color
    title: "Know Before Disaster Strikes", // More engaging title
    description:
      "Worried about data breaches? Get alerted the moment your email appears in a known leak, so you can secure your accounts *before* damage is done.", // Focus on prevention/timing
  },
  {
    icon: <ListChecks className="w-10 h-10 mb-4 text-blue-500" />, // Changed Icon & Color
    title: "Map Your Digital Footprint", // More active title
    description:
      "Stop guessing which apps have your info. Clearly visualize your data exposure across services and finally understand where your personal details live online.", // Focus on clarity/understanding
  },
  {
    icon: <KeyRound className="w-10 h-10 mb-4 text-green-500" />, // Changed color
    title: "Sign Up Without Selling Out", // Catchier title
    description:
      "Protect your real identity! Generate disposable emails and data for newsletters, trials, or less trusted sites. Keep your main inbox clean and reduce tracking.", // Focus on protection/reducing annoyance
  },
  {
    icon: <Vault className="w-10 h-10 mb-4 text-purple-500" />, // Changed Icon & Color
    title: "Lock Down Your Login Credentials", // More active title
    description:
        "Stop reusing weak passwords. Securely store all your complex website logins in one encrypted place. Access them easily, only when you need them.", // Focus on security/convenience
  },
];
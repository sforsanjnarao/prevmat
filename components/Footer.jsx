// components/Footer.jsx

import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-slate-950/80 backdrop-blur-sm supports-[backdrop-filter]:bg-slate-950/60 dark:border-gray-800 mt-8">
      <div className="container mx-auto px-4 py-10 flex flex-col items-center text-center gap-4">
        {/* Logo */}
        <Link href="/" className="inline-block">
          <Image
            src="/privmatLogo.png"
            alt="Privmat Logo"
            width={120}
            height={48}
            className="h-8 w-auto object-contain"
          />
        </Link>

        {/* Copyright */}
        <p className="text-sm text-muted-foreground">
          © {currentYear} Privmat. All rights reserved.
        </p>

        {/* Tagline */}
        <p className="text-xs text-muted-foreground/80">
          Your Privacy Matters.
        </p>

        {/* Navigation Links */}
        <div className="flex flex-col gap-1">
          <Link
            href="/privacy-policy"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms-of-service"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Terms of Service
          </Link>
          {/* Optional future links:
          <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            Contact
          </Link> */}
        </div>

        {/* Optional Social Icons */}
        {/* <div className="flex gap-4 mt-2">
          <Link href="#" aria-label="Twitter"><Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
          <Link href="#" aria-label="LinkedIn"><Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
          <Link href="#" aria-label="GitHub"><Github className="h-5 w-5 text-muted-foreground hover:text-primary" /></Link>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerData } from "@/lib/mock-data/landing-data";

export function PublicFooter() {
  const pathname = usePathname();
  if (pathname === "/") return null;

  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          {footerData.copyright}
        </p>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <Link href="/docs/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/docs/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <Link href="/docs/security" className="hover:text-foreground transition-colors">
            Security
          </Link>
          <Link href="/docs/compliance" className="hover:text-foreground transition-colors">
            Compliance
          </Link>
          <Link href="/contact" className="hover:text-foreground transition-colors">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}

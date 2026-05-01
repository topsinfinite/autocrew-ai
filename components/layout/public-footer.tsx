"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_CONFIG } from "@/lib/constants";
import { footerData } from "@/lib/mock-data/landing-data";
import { CookiePreferencesButton } from "@/components/consent/cookie-preferences-button";

// Pages with their own embedded landing footer in `cta-section.tsx` /
// `*-cta.tsx` — they already cross-link to legal/docs, so suppress the
// site-wide footer to avoid duplicate footers.
const SUPPRESSED_ROUTES = new Set([
  "/",
  "/industry/coaching",
  "/industry/restaurant",
  "/industry/legal",
  "/industry/healthcare",
]);

const productLinks = [
  { href: "/ai-receptionist", label: "AI Receptionist" },
  { href: "/widget", label: "Widget" },
];

const industryLinks = [
  { href: "/industry/coaching", label: "Coaching" },
  { href: "/industry/healthcare", label: "Healthcare" },
  { href: "/industry/legal", label: "Legal" },
  { href: "/industry/restaurant", label: "Restaurant" },
];

const resourceLinks = [
  { href: "/docs", label: "Documentation" },
  { href: "/docs/getting-started", label: "Getting Started" },
  { href: "/docs/faq", label: "FAQ" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/contact-support", label: "Support" },
];

const legalLinks = [
  { href: "/docs/privacy", label: "Privacy Policy" },
  { href: "/docs/terms", label: "Terms of Service" },
  { href: "/docs/security", label: "Security" },
  { href: "/docs/compliance", label: "Compliance" },
];

interface FooterColumnProps {
  heading: string;
  links: { href: string; label: string }[];
}

function FooterColumn({ heading, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground mb-3 font-space-grotesk">
        {heading}
      </h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PublicFooter() {
  const pathname = usePathname();
  if (SUPPRESSED_ROUTES.has(pathname)) return null;

  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <nav
          aria-label="Footer"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 mb-10"
        >
          <FooterColumn heading="Product" links={productLinks} />
          <FooterColumn heading="Industries" links={industryLinks} />
          <FooterColumn heading="Resources" links={resourceLinks} />
          <FooterColumn heading="Company" links={companyLinks} />
          <FooterColumn heading="Legal" links={legalLinks} />
        </nav>

        <div className="border-t border-border pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {footerData.copyright}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a
              href={APP_CONFIG.supportPhoneTel}
              className="hover:text-foreground transition-colors"
            >
              {APP_CONFIG.supportPhoneDisplay}
            </a>
            <a
              href={`mailto:${APP_CONFIG.supportEmail}`}
              className="hover:text-foreground transition-colors"
            >
              {APP_CONFIG.supportEmail}
            </a>
            <CookiePreferencesButton className="hover:text-foreground transition-colors" />
          </div>
        </div>
      </div>
    </footer>
  );
}

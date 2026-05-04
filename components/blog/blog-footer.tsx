import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { ROUTES, APP_CONFIG } from "@/lib/constants";

const productLinks = [
  { href: "/ai-receptionist", label: "AI Receptionist" },
  { href: "/widget", label: "Widget" },
  { href: "/roi-calculator", label: "ROI Calculator" },
];

const industryLinks = [
  { href: "/industry/coaching", label: "Coaching" },
  { href: "/industry/healthcare", label: "Healthcare" },
  { href: "/industry/legal", label: "Legal" },
  { href: "/industry/restaurant", label: "Restaurants" },
];

const journalLinks = [
  { href: ROUTES.BLOG, label: "All posts" },
  { href: ROUTES.BLOG_RSS, label: "RSS feed" },
  { href: "/blog/category/ai-automation", label: "AI & Automation" },
  { href: "/blog/category/customer-service", label: "Customer Service" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/contact-support", label: "Support" },
  { href: "/docs", label: "Documentation" },
];

interface FooterColumnProps {
  heading: string;
  links: { href: string; label: string }[];
}

function FooterColumn({ heading, links }: FooterColumnProps) {
  return (
    <div>
      <h3 className="text-[12px] font-sans font-semibold uppercase tracking-[0.08em] text-[hsl(20,26%,8%)] mb-4">
        {heading}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[14px] font-sans text-[hsl(25,10%,32%)] hover:text-[hsl(20,26%,8%)] transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BlogFooter() {
  return (
    <footer className="border-t border-[rgba(26,20,16,0.12)] mt-16">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" aria-label="Autocrew" className="inline-block mb-3">
              <Logo height={22} className="text-[hsl(20,26%,8%)]" />
            </Link>
            <p className="text-[13px] font-sans text-[hsl(25,10%,45%)] leading-relaxed max-w-[200px]">
              AI crews that answer every call, book every appointment, never
              sleep.
            </p>
          </div>
          <FooterColumn heading="Product" links={productLinks} />
          <FooterColumn heading="Industries" links={industryLinks} />
          <FooterColumn heading="Journal" links={journalLinks} />
          <FooterColumn heading="Company" links={companyLinks} />
        </div>
        <div className="border-t border-[rgba(26,20,16,0.12)] pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-[12px] font-sans text-[hsl(25,10%,45%)]">
            © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-sans text-[hsl(25,10%,45%)]">
            <Link
              href="/docs/privacy"
              className="hover:text-[hsl(20,26%,8%)] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/docs/terms"
              className="hover:text-[hsl(20,26%,8%)] transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/docs/security"
              className="hover:text-[hsl(20,26%,8%)] transition-colors"
            >
              Security
            </Link>
            <a
              href={`mailto:${APP_CONFIG.supportEmail}`}
              className="hover:text-[hsl(20,26%,8%)] transition-colors"
            >
              {APP_CONFIG.supportEmail}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

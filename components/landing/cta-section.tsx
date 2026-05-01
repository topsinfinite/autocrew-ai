import Link from "next/link";
import {
  ArrowRight,
  Mail,
  Calendar,
  Github,
  Linkedin,
  Phone,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { ctaData, footerData } from "@/lib/mock-data/landing-data";
import { APP_CONFIG } from "@/lib/constants";
import { CookiePreferencesButton } from "@/components/consent/cookie-preferences-button";

export function CtaSection() {
  return (
    <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 font-space-grotesk">
        <div className="group overflow-hidden sm:p-10 transition-colors duration-500 text-card-foreground bg-card border-border border rounded-[40px] p-6 relative shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Subtle top-left light */}
            <div className="absolute inset-0 bg-[radial-gradient(1000px_800px_at_0%_0%,rgba(0,0,0,0.02),transparent_100%)] dark:bg-[radial-gradient(1000px_800px_at_0%_0%,rgba(255,255,255,0.02),transparent_100%)]" />
            {/* Burnt Orange Glow bottom-right */}
            <div className="absolute inset-0 bg-[radial-gradient(1000px_800px_at_100%_100%,rgba(255,107,53,0.12),transparent_100%)]" />
            {/* Texture Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#0000000d_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.2]" />
          </div>

          <div className="relative z-10">
            {/* Large Typography Headline */}
            <h2 className="text-[clamp(2rem,10vw,7rem)] sm:text-[clamp(2.5rem,9vw,7rem)] lg:text-[clamp(3rem,7vw,7rem)] leading-[0.9] font-semibold tracking-tighter font-geist mb-6 sm:mb-8">
              <span className="block font-space-grotesk text-foreground">
                {ctaData.headline.line1}
              </span>
              <span className="block text-muted-foreground transition-colors duration-700 font-space-grotesk">
                {ctaData.headline.line2}
              </span>
            </h2>

            <p className="text-xl text-muted-foreground font-geist mb-12 max-w-2xl">
              {ctaData.subheadline}
            </p>

            {/* Contact Grid */}
            <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-10">
              {/* Email */}
              <div className="flex flex-col items-start">
                <p className="uppercase text-xs font-semibold text-[#FF6B35] tracking-wider font-space mb-3">
                  {ctaData.email.label}
                </p>
                <a
                  href={`mailto:${ctaData.email.address}`}
                  className="inline-flex items-center gap-3 text-lg sm:text-xl font-medium tracking-tight text-foreground hover:text-[#FF6B35] transition-colors font-geist group/link"
                >
                  <div className="w-8 h-8 rounded-lg bg-foreground/[0.05] dark:bg-white/5 border border-border flex items-center justify-center text-[#FF6B35] group-hover/link:bg-[#FF6B35]/10 group-hover/link:border-[#FF6B35]/20 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="break-all">{ctaData.email.address}</span>
                </a>
              </div>

              {/* Phone */}
              <div className="flex flex-col items-start">
                <p className="uppercase text-xs font-semibold text-[#FF6B35] tracking-wider font-space mb-1">
                  Speak to Sarah
                </p>
                <p className="text-xs text-muted-foreground font-geist mb-3">
                  {APP_CONFIG.speakToSarahSubtitle}
                </p>
                <a
                  href={APP_CONFIG.supportPhoneTel}
                  className="inline-flex items-center gap-3 text-lg sm:text-xl font-medium tracking-tight text-foreground hover:text-[#FF6B35] transition-colors font-geist group/link"
                >
                  <div className="w-8 h-8 rounded-lg bg-foreground/[0.05] dark:bg-white/5 border border-border flex items-center justify-center text-[#FF6B35] group-hover/link:bg-[#FF6B35]/10 group-hover/link:border-[#FF6B35]/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span>{APP_CONFIG.supportPhoneDisplay}</span>
                </a>
                <p className="text-sm text-muted-foreground font-geist mt-2">
                  {APP_CONFIG.supportPhoneHours}
                </p>
              </div>

              {/* Demo */}
              <div className="flex flex-col items-start">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#FF6B35] font-space mb-3">
                  {ctaData.schedule.label}
                </p>
                <Button
                  variant="pill"
                  size="pill-md"
                  className="group/btn"
                  asChild
                >
                  <Link href="/contact">
                    <Calendar className="w-4 h-4" />
                    {ctaData.schedule.ctaText}
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
              </div>

              {/* Try Autocrew */}
              <div className="flex flex-col items-start">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#FF6B35] font-space mb-3">
                  {ctaData.tryIt.label}
                </p>
                <div className="flex flex-col gap-4 w-full sm:w-auto">
                  <Button
                    variant="pill"
                    size="pill-md"
                    className="group/btn"
                    asChild
                  >
                    <Link href="https://app.autocrew-ai.com/signup">
                      {ctaData.tryIt.ctaText}
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                  </Button>
                  <Link
                    href="https://app.autocrew-ai.com/login"
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors pl-1 font-geist group/link"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-muted-foreground group-hover/link:bg-[#FF6B35] transition-colors"
                      aria-hidden="true"
                    />
                    <span>
                      Already a member?{" "}
                      <span className="text-foreground group-hover/link:text-[#FF6B35] transition-colors">
                        Sign in
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <footer className="flex flex-col gap-8 sm:gap-12 mt-10 sm:mt-16 w-full">
              {/* Top Section */}
              <div className="flex flex-col lg:flex-row justify-between gap-8 sm:gap-12 lg:gap-24">
                {/* Brand */}
                <div className="flex flex-col max-w-sm gap-6">
                  <Logo height={22} className="text-foreground" />
                  <p className="text-sm leading-relaxed text-muted-foreground font-geist">
                    AI-powered automation for modern businesses. Deploy
                    intelligent crews that work 24/7 to transform your
                    operations.
                  </p>
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="X (Twitter)"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        className="h-5 w-5 fill-current"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    <a
                      href="#"
                      className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>

                {/* Navigation Columns */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-16 w-full lg:w-auto">
                  {/* Product */}
                  <div className="flex flex-col gap-4">
                    <p className="text-sm font-semibold text-foreground font-space-grotesk">
                      Product
                    </p>
                    <div className="flex flex-col gap-3 text-sm text-muted-foreground font-geist">
                      <Link
                        href="/#features"
                        className="hover:text-foreground transition-colors"
                      >
                        Features
                      </Link>
                      <Link
                        href="/widget"
                        className="hover:text-foreground transition-colors"
                      >
                        Embeddable Widget
                      </Link>
                      <Link
                        href="/#solutions"
                        className="hover:text-foreground transition-colors"
                      >
                        Support Crew
                      </Link>
                      <Link
                        href="/#solutions"
                        className="hover:text-foreground transition-colors"
                      >
                        LeadGen Crew
                      </Link>
                      <Link
                        href="/contact"
                        className="hover:text-foreground transition-colors"
                      >
                        Pricing
                      </Link>
                      <Link
                        href="/docs"
                        className="hover:text-foreground transition-colors"
                      >
                        Changelog
                      </Link>
                    </div>
                  </div>

                  {/* Resources */}
                  <div className="flex flex-col gap-4">
                    <p className="text-sm font-semibold text-foreground font-space-grotesk">
                      Resources
                    </p>
                    <div className="flex flex-col gap-3 text-sm text-muted-foreground font-geist">
                      <Link
                        href="/docs"
                        className="hover:text-foreground transition-colors"
                      >
                        Documentation
                      </Link>
                      <Link
                        href="/docs/getting-started"
                        className="hover:text-foreground transition-colors"
                      >
                        Getting Started
                      </Link>
                      <Link
                        href="/docs/user-guide"
                        className="hover:text-foreground transition-colors"
                      >
                        User Guide
                      </Link>
                      <Link
                        href="/docs/faq"
                        className="hover:text-foreground transition-colors"
                      >
                        FAQ
                      </Link>
                    </div>
                  </div>

                  {/* Legal */}
                  <div className="flex flex-col gap-4">
                    <p className="text-sm font-semibold text-foreground font-space-grotesk">
                      Legal
                    </p>
                    <div className="flex flex-col gap-3 text-sm text-muted-foreground font-geist">
                      <Link
                        href="/docs/privacy"
                        className="hover:text-foreground transition-colors"
                      >
                        Privacy Policy
                      </Link>
                      <Link
                        href="/docs/terms"
                        className="hover:text-foreground transition-colors"
                      >
                        Terms of Service
                      </Link>
                      <Link
                        href="/docs/security"
                        className="hover:text-foreground transition-colors"
                      >
                        Security
                      </Link>
                      <Link
                        href="/docs/compliance"
                        className="hover:text-foreground transition-colors"
                      >
                        Compliance
                      </Link>
                      <CookiePreferencesButton className="hover:text-foreground transition-colors text-left" />
                    </div>
                  </div>

                  {/* Company */}
                  <div className="flex flex-col gap-4">
                    <p className="text-sm font-semibold text-foreground font-space-grotesk">
                      Company
                    </p>
                    <div className="flex flex-col gap-3 text-sm text-muted-foreground font-geist">
                      <Link
                        href="/about"
                        className="hover:text-foreground transition-colors"
                      >
                        About
                      </Link>
                      <Link
                        href="/contact"
                        className="hover:text-foreground transition-colors"
                      >
                        Contact
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border gap-4 mt-4">
                <p className="text-sm text-muted-foreground font-geist">
                  {footerData.copyright}
                </p>
                <div className="flex gap-6 text-sm text-muted-foreground font-geist">
                  <Link
                    href="/docs/privacy"
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/docs/terms"
                    className="hover:text-foreground transition-colors"
                  >
                    Terms of Service
                  </Link>
                  <CookiePreferencesButton className="hover:text-foreground transition-colors" />
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}

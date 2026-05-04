"use client";

import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Github,
  Linkedin,
  Mail,
  Mic,
  Plug,
  Settings2,
} from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { openVoice } from "@/lib/widget/ask-helpers";
import {
  restaurantCta,
  restaurantIntegrations,
} from "@/lib/mock-data/restaurant-data";
import { footerData } from "@/lib/mock-data/landing-data";

const badgeIcon = { Integrations: Plug, Setup: Settings2 };

/**
 * Restaurant CTA + footer.
 *
 * Mirrors the healthcare strong-footer pattern: large editorial card with a
 * compliance-style badge row, a featured "spotlight" row (integrations grid
 * here, since restaurants have no audio demo), three-column contact grid,
 * brand block + nav columns, bottom legal strip.
 */
export function RestaurantCta() {
  return (
    <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32">
      <div className="mx-auto max-w-7xl px-4 font-space-grotesk sm:px-6">
        <div className="group relative overflow-hidden rounded-[40px] border border-border bg-card p-6 text-card-foreground shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-colors duration-500 sm:p-10 dark:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
          {/* Background effects */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(1000px_800px_at_0%_0%,rgba(0,0,0,0.02),transparent_100%)] dark:bg-[radial-gradient(1000px_800px_at_0%_0%,rgba(255,255,255,0.02),transparent_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(1000px_800px_at_100%_100%,rgba(255,107,53,0.12),transparent_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(#0000000d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.2] dark:bg-[radial-gradient(#ffffff0d_1px,transparent_1px)]" />
          </div>

          <div className="relative z-10">
            {/* Badge row */}
            <ul className="mb-6 flex flex-wrap gap-2 sm:mb-8">
              {restaurantCta.badges.map((b) => {
                const Icon = b.label.startsWith("30+")
                  ? badgeIcon.Integrations
                  : badgeIcon.Setup;
                return (
                  <li
                    key={b.label}
                    className="inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/25 bg-[#FF6B35]/[0.06] px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#FF6B35]"
                  >
                    <Icon className="h-3.5 w-3.5" aria-hidden />
                    <span>{b.label}</span>
                    <span className="text-[#FF6B35]/55">·</span>
                    <span className="text-[#FF6B35]/85">{b.value}</span>
                  </li>
                );
              })}
            </ul>

            {/* Headline */}
            <h2 className="mb-6 font-geist text-[clamp(2rem,10vw,7rem)] font-semibold leading-[0.9] tracking-tighter sm:mb-8 sm:text-[clamp(2.5rem,9vw,7rem)] lg:text-[clamp(3rem,7vw,7rem)]">
              <span className="block font-space-grotesk text-foreground">
                {restaurantCta.headline.line1}
              </span>
              <span className="block font-space-grotesk text-muted-foreground transition-colors duration-700">
                {restaurantCta.headline.line2}
              </span>
            </h2>

            <p className="mb-10 max-w-2xl font-geist text-xl text-muted-foreground">
              {restaurantCta.subheadline}
            </p>

            {/* Integrations spotlight row */}
            <div className="mb-12 grid gap-6 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#FF6B35]">
                  Plugs into the stack you already pay for
                </p>
                <p className="mt-3 max-w-[44ch] font-geist text-[15px] leading-[1.65] text-muted-foreground">
                  No new tablet on the host stand. Sarah works through the
                  reservation system, POS, and review tools your team already
                  uses.
                </p>
              </div>
              <div className="lg:col-span-7">
                <dl className="grid grid-cols-2 divide-x divide-y divide-[var(--border-subtle)] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-foreground/[0.02] sm:grid-cols-3">
                  {restaurantIntegrations.ledger.map((cell) => (
                    <div key={cell.label} className="px-5 py-4">
                      <dt className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
                        {cell.label}
                      </dt>
                      <dd className="mt-1.5 font-space-grotesk text-[14px] font-semibold leading-[1.25] tracking-[-0.005em] text-foreground">
                        {cell.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Contact grid */}
            <div className="mt-6 grid grid-cols-1 gap-6 sm:mt-8 sm:gap-10 md:grid-cols-3">
              <div className="flex flex-col items-start">
                <p className="mb-3 font-space text-xs font-semibold uppercase tracking-wider text-[#FF6B35]">
                  {restaurantCta.contact.email.eyebrow}
                </p>
                <a
                  href={`mailto:${restaurantCta.contact.email.address}`}
                  className="group/link inline-flex items-center gap-3 font-geist text-lg font-medium tracking-tight text-foreground transition-colors hover:text-[#FF6B35] sm:text-xl"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-foreground/[0.05] text-[#FF6B35] transition-colors group-hover/link:border-[#FF6B35]/20 group-hover/link:bg-[#FF6B35]/10 dark:bg-white/5">
                    <Mail className="h-4 w-4" />
                  </div>
                  <span className="break-all">
                    {restaurantCta.contact.email.address}
                  </span>
                </a>
              </div>

              <div className="flex flex-col items-start">
                <p className="mb-3 font-space text-xs font-semibold uppercase tracking-wider text-[#FF6B35]">
                  {restaurantCta.contact.demo.eyebrow}
                </p>
                <Button
                  variant="pill"
                  size="pill-md"
                  className="group/btn"
                  asChild
                >
                  <Link href={restaurantCta.contact.demo.cta.href}>
                    <Calendar className="h-4 w-4" />
                    {restaurantCta.contact.demo.cta.text}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </Link>
                </Button>
              </div>

              <div className="flex flex-col items-start">
                <p className="mb-3 font-space text-xs font-semibold uppercase tracking-wider text-[#FF6B35]">
                  {restaurantCta.contact.try.eyebrow}
                </p>
                <div className="flex w-full flex-col gap-4 sm:w-auto">
                  <Button
                    variant="pill"
                    size="pill-md"
                    className="group/btn"
                    onClick={() => openVoice()}
                  >
                    <Mic className="h-4 w-4" />
                    {restaurantCta.contact.try.voiceCta.text}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5" />
                  </Button>
                  <Link
                    href={restaurantCta.contact.try.memberLink.href}
                    className="group/link inline-flex items-center gap-2 pl-1 font-geist text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-muted-foreground transition-colors group-hover/link:bg-[#FF6B35]"
                    />
                    <span>
                      Already a member?{" "}
                      <span className="text-foreground transition-colors group-hover/link:text-[#FF6B35]">
                        Sign in
                      </span>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className="mt-10 flex w-full flex-col gap-8 sm:mt-16 sm:gap-12">
              <div className="flex flex-col justify-between gap-8 sm:gap-12 lg:flex-row lg:gap-24">
                <div className="flex max-w-sm flex-col gap-6">
                  <Logo height={22} className="text-foreground" />
                  <p className="font-geist text-sm leading-relaxed text-muted-foreground">
                    {restaurantCta.brand.blurb}
                  </p>
                  <div className="flex gap-2">
                    <a
                      href="#"
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center p-2 text-muted-foreground transition-colors hover:text-foreground"
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
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center p-2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="GitHub"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center p-2 text-muted-foreground transition-colors hover:text-foreground"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>

                <div className="grid w-full grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4 lg:w-auto lg:gap-16">
                  <div className="flex flex-col gap-4">
                    <p className="font-space-grotesk text-sm font-semibold text-foreground">
                      Product
                    </p>
                    <div className="flex flex-col gap-3 font-geist text-sm text-muted-foreground">
                      <Link
                        href="/ai-receptionist"
                        className="transition-colors hover:text-foreground"
                      >
                        AI Receptionist
                      </Link>
                      <Link
                        href="/widget"
                        className="transition-colors hover:text-foreground"
                      >
                        Embeddable Widget
                      </Link>
                      <Link
                        href="/#features"
                        className="transition-colors hover:text-foreground"
                      >
                        Features
                      </Link>
                      <Link
                        href="/#solutions"
                        className="transition-colors hover:text-foreground"
                      >
                        Solutions
                      </Link>
                      <Link
                        href="/contact"
                        className="transition-colors hover:text-foreground"
                      >
                        Pricing
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <p className="font-space-grotesk text-sm font-semibold text-foreground">
                      Restaurants
                    </p>
                    <div className="flex flex-col gap-3 font-geist text-sm text-muted-foreground">
                      <Link
                        href="/docs"
                        className="transition-colors hover:text-foreground"
                      >
                        Reservation integrations
                      </Link>
                      <Link
                        href="/docs"
                        className="transition-colors hover:text-foreground"
                      >
                        POS integrations
                      </Link>
                      <Link
                        href="/docs"
                        className="transition-colors hover:text-foreground"
                      >
                        Review handling
                      </Link>
                      <Link
                        href="/contact"
                        className="transition-colors hover:text-foreground"
                      >
                        Talk to us
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <p className="font-space-grotesk text-sm font-semibold text-foreground">
                      Resources
                    </p>
                    <div className="flex flex-col gap-3 font-geist text-sm text-muted-foreground">
                      <Link
                        href="/roi-calculator"
                        className="transition-colors hover:text-foreground"
                      >
                        ROI Calculator
                      </Link>
                      <Link
                        href="/docs"
                        className="transition-colors hover:text-foreground"
                      >
                        Documentation
                      </Link>
                      <Link
                        href="/docs/getting-started"
                        className="transition-colors hover:text-foreground"
                      >
                        Getting Started
                      </Link>
                      <Link
                        href="/docs/faq"
                        className="transition-colors hover:text-foreground"
                      >
                        FAQ
                      </Link>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <p className="font-space-grotesk text-sm font-semibold text-foreground">
                      Company
                    </p>
                    <div className="flex flex-col gap-3 font-geist text-sm text-muted-foreground">
                      <Link
                        href="/about"
                        className="transition-colors hover:text-foreground"
                      >
                        About
                      </Link>
                      <Link
                        href="/contact"
                        className="transition-colors hover:text-foreground"
                      >
                        Contact
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
                <p className="font-geist text-sm text-muted-foreground">
                  {footerData.copyright}
                </p>
                <div className="flex gap-6 font-geist text-sm text-muted-foreground">
                  <Link
                    href="/docs/privacy"
                    className="transition-colors hover:text-foreground"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/docs/terms"
                    className="transition-colors hover:text-foreground"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}

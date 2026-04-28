"use client";

import Link from "next/link";
import {
  ArrowRight,
  Lock,
  Mic,
  Scale,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { openVoice } from "@/lib/widget/ask-helpers";
import { legalHeroData } from "@/lib/mock-data/legal-data";

/**
 * Legal hero — "Privilege-safe by default" briefing.
 *
 * Same editorial vocabulary as the healthcare and coaching heroes: mono
 * status masthead, asymmetric 8/4 split, compliance spec card on the
 * right rail. Primary action opens the live voice widget.
 */
export function LegalHero() {
  const {
    status,
    badges,
    headline,
    subheadline,
    spec,
    primaryCta,
    secondaryCta,
  } = legalHeroData;
  const badgeIcon = { shield: ShieldCheck, scale: Scale, lock: Lock };

  return (
    <section className="relative z-10 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(128,128,128,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.06)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_55%,transparent_100%)]"
      />

      <div className="relative mx-auto max-w-[1320px] px-6 pb-16 pt-12 lg:pb-24 lg:pt-16">
        {/* Status masthead */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/55">
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            On-duty
          </span>
          <span className="text-foreground/30">·</span>
          <span>{status.location}</span>
          <span className="text-foreground/30">·</span>
          <span>{status.role}</span>
          <span className="text-foreground/30">·</span>
          <span className="tabular-nums">{status.coverage}</span>
          <span className="text-foreground/30">·</span>
          <span>{status.standard}</span>
        </div>

        {/* Asymmetric headline */}
        <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-12 lg:gap-16">
          <h1 className="lg:col-span-8 font-space-grotesk font-semibold text-foreground text-[clamp(2.25rem,4.4vw,4rem)] leading-[1.04] tracking-[-0.02em]">
            {headline.prefix}{" "}
            <span className="text-[#FF6B35]">{headline.accent}</span>
          </h1>
          <p className="lg:col-span-4 max-w-[44ch] self-end font-geist text-[15px] leading-[1.6] text-foreground/70">
            {subheadline}
          </p>
        </div>

        {/* Compliance badge row */}
        <ul className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 lg:mt-7">
          {badges.map((b) => {
            const Icon = badgeIcon[b.icon];
            return (
              <li
                key={b.label}
                className="inline-flex items-center gap-2 rounded-full border border-[#FF6B35]/25 bg-[#FF6B35]/[0.06] px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#FF6B35]"
              >
                <Icon className="h-3.5 w-3.5" aria-hidden />
                {b.label}
              </li>
            );
          })}
        </ul>

        {/* Console grid: copy column + spec card */}
        <div className="mt-10 grid gap-4 lg:mt-12 lg:grid-cols-12">
          {/* Copy / CTAs column */}
          <div className="min-w-0 lg:col-span-8">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-card">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] bg-foreground/[0.025] px-5 py-3">
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                  <Scale className="h-3.5 w-3.5 text-[#FF6B35]" aria-hidden />
                  Intake desk · Legal
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
                  Privilege stays with the attorney
                </div>
              </div>

              <div className="px-5 py-7 sm:px-7 sm:py-8">
                <ul className="grid gap-x-8 gap-y-4 font-geist text-[15px] leading-[1.55] text-foreground/80 sm:grid-cols-2">
                  <li className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[9px] inline-block h-1 w-1 shrink-0 rounded-full bg-[#FF6B35]"
                    />
                    <span>
                      Qualifies, conflicts-checks, and routes new matters{" "}
                      <span className="text-foreground">in your CMS</span> —
                      not a separate system.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[9px] inline-block h-1 w-1 shrink-0 rounded-full bg-[#FF6B35]"
                    />
                    <span>
                      Runs{" "}
                      <span className="text-foreground">
                        eligibility screening
                      </span>{" "}
                      end-to-end for legal aid.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[9px] inline-block h-1 w-1 shrink-0 rounded-full bg-[#FF6B35]"
                    />
                    <span>
                      Sends client status updates and{" "}
                      <span className="text-foreground">
                        deadline reminders
                      </span>{" "}
                      in plain language.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-[9px] inline-block h-1 w-1 shrink-0 rounded-full bg-[#FF6B35]"
                    />
                    <span>
                      Hands{" "}
                      <span className="text-foreground">
                        anything privileged
                      </span>{" "}
                      to an attorney with full context.
                    </span>
                  </li>
                </ul>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Button
                    variant="pill"
                    size="pill-lg"
                    onClick={() => openVoice()}
                    className="group shadow-[0_0_18px_rgba(255,107,53,0.35)] hover:shadow-[0_0_22px_rgba(255,107,53,0.5)]"
                  >
                    <Mic className="h-4 w-4" aria-hidden />
                    {primaryCta.text}
                  </Button>
                  <Link
                    href={secondaryCta.href}
                    className="inline-flex items-center gap-2 font-geist text-[14px] text-foreground/70 transition-colors hover:text-foreground"
                  >
                    {secondaryCta.text}
                    <ArrowRight className="h-4 w-4 text-[#FF6B35]" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Spec card — compliance */}
          <aside className="min-w-0 lg:col-span-4">
            <div className="flex h-full flex-col gap-5 rounded-2xl border border-[var(--border-subtle)] bg-foreground/[0.02] p-5 lg:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
                    {spec.label}
                  </div>
                  <div className="mt-2 font-space-grotesk text-[28px] font-semibold leading-[1.05] tracking-tight text-foreground">
                    {spec.figure}
                  </div>
                  <div className="mt-2 font-geist text-[12.5px] text-foreground/55">
                    {spec.figureSub}
                  </div>
                </div>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#FF6B35]/40 bg-[#FF6B35]/10 text-[#FF6B35]">
                  <Sparkles className="h-4 w-4" aria-hidden />
                </span>
              </div>

              <dl className="grid grid-cols-2 gap-2.5">
                {spec.cells.map((cell) => (
                  <div
                    key={cell.label}
                    className="rounded-lg border border-[var(--border-subtle)] bg-foreground/[0.015] px-3 py-2.5"
                  >
                    <dt className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-foreground/45">
                      {cell.label}
                    </dt>
                    <dd className="mt-0.5 font-space-grotesk text-[14px] font-semibold tracking-[-0.005em] text-foreground">
                      {cell.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-auto font-mono text-[9.5px] uppercase tracking-[0.2em] text-foreground/40">
                {spec.footer}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

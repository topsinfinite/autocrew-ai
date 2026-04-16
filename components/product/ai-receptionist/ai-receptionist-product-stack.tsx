"use client";

import Link from "next/link";
import { Database, PhoneCall, UserCheck, type LucideIcon } from "lucide-react";
import { SectionBadge } from "@/components/landing/section-badge";
import { Button } from "@/components/ui/button";
import {
  aiReceptionistProductStack,
  type AiReceptionistProductStackIcon,
} from "@/lib/mock-data/ai-receptionist-data";
import { cn } from "@/lib/utils";

const panelIcons: Record<AiReceptionistProductStackIcon, LucideIcon> = {
  PhoneCall,
  Database,
  UserCheck,
};

/** Appended after translate(-50%, -50%) for fanned rear panels (desktop) */
const BACK_TRANSFORMS = [
  "translate3d(-14%, -4%, -90px) rotateY(22deg) scale(0.9)",
  "translate3d(0, 12%, -125px) rotateY(0deg) scale(0.84)",
  "translate3d(14%, -4%, -90px) rotateY(-22deg) scale(0.9)",
] as const;

function BackPanelCard({
  title,
  subtitle,
  icon,
  transform,
  zIndex,
}: {
  title: string;
  subtitle: string;
  icon: AiReceptionistProductStackIcon;
  transform: string;
  zIndex: number;
}) {
  const Icon = panelIcons[icon];

  return (
    <div
      className={cn(
        "pointer-events-none absolute left-1/2 top-[38%] w-[min(100%,268px)] rounded-[24px] border border-white/[0.09]",
        "bg-gradient-to-br from-[#FF6B35]/18 via-card/90 to-card/70 px-5 py-5 shadow-[0_24px_50px_-28px_rgba(0,0,0,0.75)]",
      )}
      style={{
        transform: `translate(-50%, -50%) ${transform}`,
        transformStyle: "preserve-3d",
        zIndex,
      }}
      aria-hidden="true"
    >
      <div className="mb-3 flex size-9 items-center justify-center rounded-xl border border-[#FF6B35]/25 bg-[#FF6B35]/12 text-[#FF6B35]">
        <Icon className="size-4" strokeWidth={2} />
      </div>
      <p className="font-space-grotesk text-sm font-semibold text-foreground">
        {title}
      </p>
      <p className="mt-1.5 font-geist text-xs leading-relaxed text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}

export function AiReceptionistProductStack() {
  const { badge, headline, subheadline, panels, focusCard } =
    aiReceptionistProductStack;

  return (
    <section
      className="relative z-10 border-y border-foreground/[0.06] dark:border-white/[0.06] bg-foreground/[0.02] dark:bg-white/[0.02] section-glow-center"
      aria-labelledby="ai-receptionist-product-stack-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl lg:max-w-none">
            <SectionBadge className="mb-6">{badge}</SectionBadge>
            <h2
              id="ai-receptionist-product-stack-heading"
              className="font-space-grotesk text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-[2.5rem] md:leading-tight"
            >
              {headline}
            </h2>
            <p className="mt-4 font-geist text-lg leading-relaxed text-muted-foreground">
              {subheadline}
            </p>
          </div>

          {/* Mobile: focus card + compact panel list */}
          <div className="lg:hidden">
            <div
              className={cn(
                "rounded-[28px] border border-white/[0.12] bg-background/55 p-6 shadow-[0_28px_60px_-32px_rgba(0,0,0,0.65)] backdrop-blur-xl",
                "backdrop-saturate-150",
              )}
            >
              <h3 className="font-space-grotesk text-xl font-semibold text-foreground">
                {focusCard.title}
              </h3>
              <p className="mt-3 font-geist text-sm leading-relaxed text-muted-foreground">
                {focusCard.body}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <Button
                  variant="pill"
                  size="pill-lg"
                  className="group w-full shadow-[0_0_15px_rgba(255,107,53,0.4)] hover:shadow-[0_0_18px_rgba(255,107,53,0.45)] motion-safe:transition-shadow sm:w-auto"
                  asChild
                >
                  <Link href={focusCard.primaryCta.href}>
                    {focusCard.primaryCta.text}
                  </Link>
                </Button>
                {focusCard.secondaryLink ? (
                  <Link
                    href={focusCard.secondaryLink.href}
                    className="text-center font-geist text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline sm:text-left"
                  >
                    {focusCard.secondaryLink.text}
                  </Link>
                ) : null}
              </div>
            </div>
            <ul className="mt-8 space-y-3" aria-label="Product capabilities">
              {panels.map((p) => {
                const Icon = panelIcons[p.icon];
                return (
                  <li
                    key={p.title}
                    className="flex gap-3 rounded-2xl border border-white/[0.07] bg-card/40 px-4 py-3"
                  >
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#FF6B35]/20 bg-[#FF6B35]/10 text-[#FF6B35]">
                      <Icon className="size-4" strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-space-grotesk text-sm font-medium text-foreground">
                        {p.title}
                      </p>
                      <p className="mt-0.5 font-geist text-xs text-muted-foreground">
                        {p.subtitle}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Desktop: perspective fan + glass focus */}
          <div className="relative mx-auto hidden h-[460px] w-full max-w-[520px] lg:block">
            <div
              className={cn(
                "group relative h-full w-full motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out",
                "motion-safe:md:hover:[transform:rotateX(4deg)]",
              )}
              style={{ perspective: "1100px" }}
            >
              <div
                className="relative h-full w-full"
                style={{ transformStyle: "preserve-3d" }}
              >
                {panels.map((panel, i) => (
                  <BackPanelCard
                    key={panel.title}
                    title={panel.title}
                    subtitle={panel.subtitle}
                    icon={panel.icon}
                    transform={BACK_TRANSFORMS[i]}
                    zIndex={10 + i}
                  />
                ))}

                <div
                  className={cn(
                    "absolute left-1/2 top-[42%] z-40 w-[min(100%,300px)] -translate-x-1/2 -translate-y-1/2",
                    "rounded-[28px] border border-white/[0.14] bg-background/45 p-7",
                    "shadow-[0_32px_64px_-36px_rgba(0,0,0,0.85)] backdrop-blur-xl backdrop-saturate-150",
                  )}
                  style={{
                    transform: "translate(-50%, -50%) translateZ(42px)",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <h3 className="font-space-grotesk text-xl font-semibold text-foreground">
                    {focusCard.title}
                  </h3>
                  <p className="mt-3 font-geist text-sm leading-relaxed text-muted-foreground">
                    {focusCard.body}
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                    <Button
                      variant="pill"
                      size="pill-md"
                      className="w-full shadow-[0_0_15px_rgba(255,107,53,0.4)] hover:shadow-[0_0_18px_rgba(255,107,53,0.45)] motion-safe:transition-shadow sm:w-auto"
                      asChild
                    >
                      <Link href={focusCard.primaryCta.href}>
                        {focusCard.primaryCta.text}
                      </Link>
                    </Button>
                    {focusCard.secondaryLink ? (
                      <Link
                        href={focusCard.secondaryLink.href}
                        className="text-center font-geist text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline sm:text-left"
                      >
                        {focusCard.secondaryLink.text}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

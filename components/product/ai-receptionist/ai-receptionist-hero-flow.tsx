"use client";

import { Database, PhoneCall, UserCheck, type LucideIcon } from "lucide-react";
import type {
  AiReceptionistHeroWorkflowIcon,
  AiReceptionistHeroWorkflowStep,
} from "@/lib/mock-data/ai-receptionist-data";
import { cn } from "@/lib/utils";

const workflowIcons: Record<AiReceptionistHeroWorkflowIcon, LucideIcon> = {
  PhoneCall,
  Database,
  UserCheck,
};

const HERO_FLOW_SPINE_D =
  "M 70 56 C 230 56 320 18 500 18 C 680 18 770 56 930 56";

type Props = {
  steps: AiReceptionistHeroWorkflowStep[];
};

export function AiReceptionistHeroFlow({ steps }: Props) {
  return (
    <>
      <ol
        className="mx-auto max-w-lg list-none space-y-0 p-0 md:hidden"
        aria-label="How each call flows through Sarah"
      >
        {steps.map((step, index) => {
          const Icon = workflowIcons[step.icon];
          const stepNum = String(index + 1).padStart(2, "0");
          const isFirst = index === 0;
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.label}
              className="flex cursor-default gap-5"
            >
              <div
                className="flex w-11 shrink-0 flex-col items-center"
                aria-hidden="true"
              >
                {isFirst ? (
                  <div className="h-2 w-px shrink-0" />
                ) : (
                  <div className="h-6 w-px shrink-0 bg-gradient-to-b from-transparent to-[#FF6B35]/55" />
                )}
                <div
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-[#FF6B35]/45",
                    "bg-[#FF6B35]/12 text-[#FF6B35] shadow-[0_0_20px_-4px_rgba(255,107,53,0.35)]",
                  )}
                >
                  <Icon className="size-5" strokeWidth={2} />
                </div>
                {!isLast ? (
                  <div className="relative min-h-20 w-px shrink-0 overflow-hidden rounded-full bg-gradient-to-b from-[#FF6B35]/55 via-[#FF6B35]/28 to-transparent">
                    <div
                      className="pointer-events-none absolute left-1/2 top-0 h-16 min-w-[3px] -translate-x-1/2 bg-gradient-to-b from-transparent via-[#FF6B35] to-transparent opacity-90 motion-reduce:hidden animate-beam-vertical"
                      aria-hidden
                    />
                  </div>
                ) : (
                  <div className="h-2 w-px shrink-0" />
                )}
              </div>
              <div className={cn("min-w-0 pb-10", isLast && "pb-0")}>
                <p className="mb-1 font-mono text-xs tabular-nums text-[#FF6B35]/80">
                  {stepNum}
                </p>
                <p className="font-space-grotesk text-base font-semibold text-foreground">
                  {step.label}
                </p>
                <p className="mt-2 font-geist text-sm leading-relaxed text-muted-foreground">
                  {step.caption}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="relative hidden md:block">
        <svg
          viewBox="0 0 1000 88"
          className="pointer-events-none absolute inset-x-0 top-[3.25rem] z-0 h-16 w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <filter
              id="ai-receptionist-hero-flow-beam-blur"
              x="-35%"
              y="-35%"
              width="170%"
              height="170%"
            >
              <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d={HERO_FLOW_SPINE_D}
            className="fill-none stroke-[#FF6B35]/18"
            strokeLinecap="round"
            strokeWidth="10"
          />
          <path
            d={HERO_FLOW_SPINE_D}
            className="fill-none stroke-[#FF6B35]/40"
            strokeLinecap="round"
            strokeWidth="2"
          />
          <path
            d={HERO_FLOW_SPINE_D}
            pathLength={100}
            className="animate-hero-flow-beam fill-none stroke-[#FF6B35]"
            filter="url(#ai-receptionist-hero-flow-beam-blur)"
            strokeDasharray="16 84"
            strokeLinecap="round"
            strokeOpacity={0.38}
            strokeWidth="9"
          />
          <path
            d={HERO_FLOW_SPINE_D}
            pathLength={100}
            className="animate-hero-flow-beam fill-none stroke-[#FF6B35]"
            strokeDasharray="16 84"
            strokeLinecap="round"
            strokeOpacity={0.95}
            strokeWidth="3"
          />
          <path
            d={HERO_FLOW_SPINE_D}
            className="animate-hero-signal-path fill-none stroke-[#FF6B35]"
            strokeDasharray="14 32"
            strokeLinecap="round"
            strokeWidth="2.5"
          />
        </svg>

        <ol
          className="relative z-10 m-0 grid list-none grid-cols-3 gap-6 p-0 text-center"
          aria-label="How each call flows through Sarah"
        >
          {steps.map((step, index) => {
            const Icon = workflowIcons[step.icon];
            const stepNum = String(index + 1).padStart(2, "0");

            return (
              <li
                key={step.label}
                className="flex cursor-default flex-col items-center px-2"
              >
                <p className="mb-3 font-mono text-xs tabular-nums text-[#FF6B35]/75">
                  {stepNum}
                </p>
                <div
                  className={cn(
                    "mb-5 flex size-14 items-center justify-center rounded-full border-2 border-[#FF6B35]/50",
                    "bg-background/85 text-[#FF6B35] shadow-[0_0_24px_-6px_rgba(255,107,53,0.45)] backdrop-blur-sm",
                  )}
                >
                  <Icon className="size-6" strokeWidth={2} />
                </div>
                <p className="font-space-grotesk text-base font-semibold text-foreground">
                  {step.label}
                </p>
                <p className="mt-2 max-w-[220px] font-geist text-sm leading-relaxed text-muted-foreground">
                  {step.caption}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </>
  );
}

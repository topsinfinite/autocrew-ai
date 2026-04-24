"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AudioPlayer } from "@/components/landing/audio-player";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { Button } from "@/components/ui/button";
import { heroData } from "@/lib/mock-data/landing-data";
import { SuggestedPills } from "./suggested-pills";
import { TypewriterCaret } from "./typewriter-caret";
import { usePrefersReducedMotion, useTypewriter } from "./use-typewriter";

const SUGGESTED_QUESTIONS = [
  "How does it learn my business?",
  "Can it escalate to a human?",
  "What does a deploy look like?",
] as const;

const VISITOR_TEXT = "What could your crew handle today?";
const CREW_TEXT_PRIMARY =
  "Calls. Appointments. Intake. Lead qualification. Escalations.";
const CREW_TEXT_MUTED =
  " All trained on your operations, and live within days.";
const SEARCH_PLACEHOLDER = "Ask anything…";

// Timings tuned for a deliberate, readable pace (~11 seconds total).
const VISITOR_START_DELAY = 700; // after fade-up (delay 100ms + 600ms duration)
const VISITOR_SPEED = 80;
const CREW_GAP = 600;
const CREW_SPEED = 40;
const SEARCH_GAP = 700;
const SEARCH_SPEED = 120;

/**
 * Direction A — Dialogue / Editorial Exchange.
 *
 * Single-column, typographic composition where the hero copy IS the
 * conversation: a visitor asks, AutoCrew answers. Every element sits on an
 * editorial label grid (Visitor / AutoCrew / You / Or ask / Or hear).
 *
 * A typewriter effect streams each turn sequentially on mount, ending with
 * the search placeholder. Respects prefers-reduced-motion.
 */
export function HeroDialogue() {
  const reduced = usePrefersReducedMotion();
  const animate = !reduced;

  const visitor = useTypewriter({
    text: VISITOR_TEXT,
    speed: VISITOR_SPEED,
    delay: VISITOR_START_DELAY,
    enabled: animate,
  });

  const crewPrimary = useTypewriter({
    text: CREW_TEXT_PRIMARY,
    speed: CREW_SPEED,
    delay: CREW_GAP,
    enabled: animate,
    start: visitor.done,
  });

  const crewMuted = useTypewriter({
    text: CREW_TEXT_MUTED,
    speed: CREW_SPEED,
    delay: 0,
    enabled: animate,
    start: crewPrimary.done,
  });

  // Stream the search placeholder into the <autocrew-search> host after the
  // crew's turn finishes. We update the attribute on the custom element; the
  // widget's own input reads from it.
  const searchRef = useRef<HTMLElement | null>(null);
  const [searchTyping, setSearchTyping] = useState(false);
  useEffect(() => {
    if (!crewMuted.done) return;
    if (!animate) {
      searchRef.current?.setAttribute("placeholder", SEARCH_PLACEHOLDER);
      return;
    }

    const el = searchRef.current;
    if (!el) return;

    // Reach into the widget's shadow DOM if we need to animate the input's
    // placeholder — the host's setAttribute may not propagate after
    // initialisation. Fall back to attribute updates if shadowRoot is absent.
    const inputEl =
      (el as HTMLElement & { shadowRoot?: ShadowRoot | null }).shadowRoot?.querySelector<HTMLInputElement>(
        'input[part="input"]',
      ) ?? null;

    const setPlaceholder = (v: string) => {
      if (inputEl) inputEl.placeholder = v;
      else el.setAttribute("placeholder", v);
    };

    setPlaceholder("");
    setSearchTyping(true);
    let i = 0;
    const startId = setTimeout(() => {
      const id = setInterval(() => {
        i += 1;
        setPlaceholder(SEARCH_PLACEHOLDER.slice(0, i));
        if (i >= SEARCH_PLACEHOLDER.length) {
          clearInterval(id);
          setSearchTyping(false);
        }
      }, SEARCH_SPEED);
    }, SEARCH_GAP);

    return () => {
      clearTimeout(startId);
    };
  }, [crewMuted.done, animate]);

  return (
    <section className="relative z-10 overflow-hidden">
      {/* Film-grain noise overlay — print-like texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-5 opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          backgroundSize: "160px 160px",
        }}
      />

      <div className="relative mx-auto max-w-[920px] px-6 pb-24 pt-16 sm:pt-24 lg:pb-32">
        {/* Online indicator */}
        <div
          className={cn(
            "flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55",
            "animate-fade-up opacity-0",
          )}
          style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B35]/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
          </span>
          <span>Crew &middot; Online</span>
        </div>

        {/* Exchange block */}
        <div className="mt-10 space-y-10">
          {/* Visitor turn */}
          <div
            className={cn(
              "grid grid-cols-[72px_1fr] gap-x-5 gap-y-2 sm:grid-cols-[96px_1fr]",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            <span className="pt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
              Visitor
            </span>
            <p
              className="font-space-grotesk text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.01em] text-foreground/90"
              aria-label={VISITOR_TEXT}
            >
              {visitor.out}
              {animate && !visitor.done && (
                <TypewriterCaret color="rgba(255,255,255,0.5)" />
              )}
            </p>
          </div>

          {/* Crew turn — only starts after visitor finishes */}
          <div
            className={cn(
              "grid grid-cols-[72px_1fr] gap-x-5 gap-y-2 sm:grid-cols-[96px_1fr]",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "220ms", animationFillMode: "forwards" }}
          >
            <span className="pt-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#FF6B35]">
              AutoCrew
            </span>
            <p
              className="font-space-grotesk text-[clamp(1.75rem,4vw,2.75rem)] font-medium leading-[1.15] tracking-[-0.01em] text-foreground"
              aria-label={CREW_TEXT_PRIMARY + CREW_TEXT_MUTED}
            >
              {crewPrimary.out}
              {animate && visitor.done && !crewPrimary.done && (
                <TypewriterCaret />
              )}
              {crewPrimary.done && (
                <span className="text-foreground/70">
                  {crewMuted.out}
                  {animate && !crewMuted.done && <TypewriterCaret />}
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Search — framed as "continue the conversation" */}
        <div
          className={cn("mt-16", "animate-fade-up opacity-0")}
          style={{ animationDelay: "340ms", animationFillMode: "forwards" }}
        >
          <div className="grid grid-cols-[72px_1fr] items-start gap-x-5 sm:grid-cols-[96px_1fr]">
            <span className="pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
              You
            </span>
            <div
              className={cn(
                "hero-search-dialogue",
                searchTyping && "hero-search-typing",
              )}
            >
              <autocrew-search
                ref={searchRef}
                placeholder={animate ? "" : SEARCH_PLACEHOLDER}
                button-label="Ask Sarah"
                primary-color="#FF6B35"
              />
              <p className="mt-3 font-geist text-[12px] italic text-foreground/45">
                Continue the conversation &mdash; the crew answers in real
                time.
              </p>
            </div>
          </div>
        </div>

        {/* Pills as quoted follow-ups */}
        <div
          className={cn(
            "mt-10 grid grid-cols-[72px_1fr] gap-x-5 sm:grid-cols-[96px_1fr]",
            "animate-fade-up opacity-0",
          )}
          style={{ animationDelay: "460ms", animationFillMode: "forwards" }}
        >
          <span className="pt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
            Or ask
          </span>
          <SuggestedPills
            questions={SUGGESTED_QUESTIONS}
            variant="conversational"
          />
        </div>

        {/* Audio demo + Book a Demo — same row, keeps the editorial label grammar */}
        <div
          className={cn(
            "mt-10 grid grid-cols-[72px_1fr] items-start gap-x-5 sm:grid-cols-[96px_1fr]",
            "animate-fade-up opacity-0",
          )}
          style={{ animationDelay: "580ms", animationFillMode: "forwards" }}
        >
          <span className="pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
            Or hear
          </span>
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <AudioPlayer autoPlay />
              <Button
                variant="pill"
                size="pill-md"
                asChild
                className="group shrink-0 shadow-[0_0_15px_rgba(255,107,53,0.4)] hover:shadow-[0_0_18px_rgba(255,107,53,0.45)]"
              >
                <Link href={heroData.primaryCta.href}>
                  {heroData.primaryCta.text}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>
            <p className="mt-3 font-geist text-[12px] italic text-foreground/45">
              A real call, handled by Sarah &mdash; no script.
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard preview — proof artifact, forced dark context */}
      <div
        id="demo"
        className={cn(
          "relative z-20 mx-auto max-w-[1200px] px-4 pb-20 scroll-mt-24",
          "animate-scale-in opacity-0",
        )}
        style={{ animationDelay: "600ms", animationFillMode: "forwards" }}
        data-theme="dark"
      >
        <div className="relative">
          <div className="absolute left-1/2 top-1/2 -z-10 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6B35]/20 blur-[100px]" />
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}

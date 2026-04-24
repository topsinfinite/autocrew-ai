"use client";

import Link from "next/link";
import { ArrowRight, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { heroData } from "@/lib/mock-data/landing-data";
import { askSarah } from "@/lib/widget/ask-helpers";
import { LiveEventLog } from "./live-event-log";
import { RunnableCodeBlock } from "./runnable-code-block";

const HERO_DEMO_QUESTION = "What can your widget handle on my site?";
const SECONDARY_DEMO_QUESTION =
  "Show me an example of a button that opens this widget.";

const SAMPLE_CODE = `<button data-autocrew-question="What's your pricing?">
  See our pricing
</button>`;

/**
 * Concept A — Console + Canvas.
 *
 * Two-column hero. Left: editorial pitch + working <autocrew-search> +
 * primary CTA. Right: window-chrome panel containing a runnable code
 * block stacked above the live trigger event log.
 */
export function WidgetHeroAConsole() {
  return (
    <section className="relative z-10 overflow-hidden">
      {/* Subtle technical grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-5"
      >
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:48px_48px]"
          style={{
            maskImage:
              "radial-gradient(ellipse 70% 60% at 60% 40%, #000 50%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 60% 40%, #000 50%, transparent 100%)",
          }}
        />
      </div>

      <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 pb-24 pt-16 lg:grid-cols-12 lg:gap-16 lg:pb-32 lg:pt-20">
        {/* LEFT — pitch + search */}
        <div className="lg:col-span-6 lg:flex lg:flex-col">
          <div
            className={cn(
              "flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/60",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "0ms", animationFillMode: "forwards" }}
          >
            <Code2 className="h-3.5 w-3.5 text-[#FF6B35]" />
            <span>AutoCrew &middot; Widget &middot; v1.1</span>
          </div>

          <h1
            className={cn(
              "mt-6 font-space-grotesk font-semibold text-foreground",
              "text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[1.02] tracking-[-0.02em]",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            Turn every button into a
            <span className="text-[#FF6B35]"> live conversation</span>.
          </h1>

          <p
            className={cn(
              "mt-6 max-w-[56ch] font-geist text-[17px] leading-[1.65] text-foreground/75",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            Five trigger surfaces. Zero forms. One AI agent your visitors
            can reach from any page, button, or link &mdash; without
            re-embedding.
          </p>

          {/* Search */}
          <div
            className={cn(
              "mt-10 max-w-[620px] lg:mt-auto",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "320ms", animationFillMode: "forwards" }}
          >
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground/50">
              <span>&gt; Try it</span>
            </div>
            <autocrew-search
              placeholder="Ask anything about the widget…"
              button-label="Ask Sarah"
              primary-color="#FF6B35"
            />
            <p className="mt-3 font-geist text-[12px] italic text-foreground/45">
              Live demo &mdash; this is the very widget you&rsquo;d ship.
            </p>
          </div>

          {/* Secondary CTAs */}
          <div
            className={cn(
              "mt-7 flex flex-wrap items-center gap-3",
              "animate-fade-up opacity-0",
            )}
            style={{ animationDelay: "440ms", animationFillMode: "forwards" }}
          >
            <Button
              variant="pill"
              size="pill-md"
              asChild
              className="group shadow-[0_0_15px_rgba(255,107,53,0.4)] hover:shadow-[0_0_18px_rgba(255,107,53,0.45)]"
            >
              <Link href={heroData.primaryCta.href}>
                {heroData.primaryCta.text}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              variant="pill-outline"
              size="pill-md"
              asChild
              className="group"
            >
              <Link href="#install">
                Get embed code
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* RIGHT — runnable code + live event log */}
        <aside
          className={cn(
            "lg:col-span-6 lg:flex lg:flex-col lg:gap-4",
            "animate-fade-up opacity-0",
          )}
          style={{ animationDelay: "260ms", animationFillMode: "forwards" }}
          aria-label="Runnable demo"
        >
          <RunnableCodeBlock
            filename="trigger.html"
            code={SAMPLE_CODE}
            runLabel="Run this"
            onRun={() => askSarah(HERO_DEMO_QUESTION)}
          />

          <RunnableCodeBlock
            filename="trigger.js"
            code={`AutoCrew.ask("${SECONDARY_DEMO_QUESTION}");`}
            runLabel="Run this"
            onRun={() => askSarah(SECONDARY_DEMO_QUESTION)}
          />

          <LiveEventLog className="min-h-[180px]" max={6} />
        </aside>
      </div>
    </section>
  );
}

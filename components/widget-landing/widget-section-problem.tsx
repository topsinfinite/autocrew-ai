import { cn } from "@/lib/utils";

/**
 * Section 2 — The cost of static.
 *
 * Editorial breath after the hero's density. One opinion, one paragraph,
 * one quiet visual contrast. No fake statistics — qualitative framing.
 */
export function WidgetSectionProblem() {
  return (
    <section className="relative z-10 border-t border-[var(--border-subtle)]">
      <div className="mx-auto max-w-[1100px] px-6 pb-24 pt-24 lg:pb-32 lg:pt-32">
        {/* Eyebrow */}
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
          The problem
        </div>

        {/* Main statement — editorial pull-quote */}
        <h2
          className={cn(
            "mt-6 max-w-[20ch] font-space-grotesk font-semibold text-foreground",
            "text-[clamp(2rem,4.5vw,4rem)] leading-[1.05] tracking-[-0.02em]",
          )}
        >
          Static forms send visitors into a
          <span className="text-[#FF6B35]"> queue</span>.
          <br />
          Conversations don&rsquo;t.
        </h2>

        {/* Supporting paragraph */}
        <p className="mt-8 max-w-[60ch] font-geist text-[17px] leading-[1.65] text-foreground/70">
          Every &ldquo;Contact us&rdquo; button is a form. Every form is a wait.
          Every wait is a conversion you&rsquo;ve already lost. The widget
          flips that model: visitors talk to your AI agent immediately, on
          the same page they were already reading.
        </p>

        {/* Quiet visual contrast — monospace before/after */}
        <div className="mt-12 grid max-w-[640px] gap-3 font-mono text-[12px] uppercase tracking-[0.16em] text-foreground/55">
          <div className="grid grid-cols-[68px_1fr] items-baseline gap-x-4">
            <span className="text-foreground/40">Form</span>
            <span>
              queued <span className="text-foreground/35">·</span> replied to
              hours later <span className="text-foreground/35">·</span> often
              never
            </span>
          </div>
          <div className="grid grid-cols-[68px_1fr] items-baseline gap-x-4">
            <span className="text-[#FF6B35]">Widget</span>
            <span className="text-foreground/85">
              triggered <span className="text-foreground/35">·</span> answered
              in seconds <span className="text-foreground/35">·</span> on the
              same page
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

import { cn } from "@/lib/utils";

interface TrustItem {
  id: string;
  title: string;
  description: string;
}

const TRUST_ITEMS: TrustItem[] = [
  {
    id: "01",
    title: "500-character message cap",
    description:
      "Every trigger surface — declarative, URL, API, search — auto-truncates the message. No injection wormholes via overlong strings; no LLM context overruns.",
  },
  {
    id: "02",
    title: "Single-event dispatch",
    description:
      "Every trigger fires exactly one autocrew:triggered event, even on nested click targets that bubble up. Your analytics never double-count.",
  },
  {
    id: "03",
    title: "Pre-init queue stub",
    description:
      "Calls to AutoCrew.ask() before widget.js finishes loading buffer in a small queue and replay on init. GA-style. Drop-in. No race conditions.",
  },
  {
    id: "04",
    title: "Closed shadow DOM",
    description:
      "The widget renders inside a closed shadow root. Host CSS can't leak in, host JS can't reach internals, your visitor's session stays scoped.",
  },
  {
    id: "05",
    title: "Self-cleaning URLs",
    description:
      "?autocrew_q= and ?autocrew_open= are stripped via history.replaceState after consumption. Refresh doesn't re-trigger; shared links stay clean.",
  },
  {
    id: "06",
    title: "Per-crew session isolation",
    description:
      "Each crewCode owns its own session, conversation history, and tenant scope. Multi-tenant safe by construction — no leakage between crews.",
  },
];

/**
 * Section 6 — Built for production.
 *
 * Spec-sheet style trust grid. Six engineering decisions that show up
 * as polish but matter for production: length cap, single dispatch,
 * pre-init queue, shadow DOM, self-cleaning URLs, per-crew isolation.
 * No icons by design — type and rhythm carry the section.
 */
export function WidgetSectionProduction() {
  return (
    <section
      id="production"
      className="relative z-10 border-t border-[var(--border-subtle)]"
    >
      <div className="mx-auto max-w-[1320px] px-6 pb-24 pt-24 lg:pb-32 lg:pt-32">
        {/* Header */}
        <div className="mb-16 max-w-[60ch] lg:mb-20">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
            Built for production
          </div>
          <h2
            className={cn(
              "mt-4 font-space-grotesk font-semibold text-foreground",
              "text-[clamp(1.875rem,3.6vw,3rem)] leading-[1.1] tracking-[-0.02em]",
            )}
          >
            The boring engineering that keeps this in production.
          </h2>
          <p className="mt-5 max-w-[55ch] font-geist text-[16px] leading-[1.65] text-foreground/70">
            None of this is glamorous. All of it is what separates a demo
            from something you embed on a live site and forget about.
          </p>
        </div>

        {/* Spec grid — 2 cols × 3 rows on desktop, dense ruled rows */}
        <div className="grid border-t border-[var(--border-subtle)] lg:grid-cols-2">
          {TRUST_ITEMS.map((item, i) => (
            <article
              key={item.id}
              className={cn(
                "group flex gap-6 border-b border-[var(--border-subtle)] py-8 lg:py-10",
                "lg:px-8",
                // vertical divider between columns on desktop
                i % 2 === 0 && "lg:border-r lg:border-[var(--border-subtle)]",
              )}
            >
              <div className="shrink-0 pt-1">
                <span className="font-mono text-[11px] tabular-nums uppercase tracking-[0.2em] text-[#FF6B35]">
                  {item.id}
                </span>
              </div>
              <div>
                <h3 className="font-space-grotesk text-[18px] font-semibold leading-[1.3] tracking-[-0.005em] text-foreground">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[52ch] font-geist text-[14px] leading-[1.65] text-foreground/65">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

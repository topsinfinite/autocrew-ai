import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfigRow {
  label: string;
  value: React.ReactNode;
  note?: string;
}

const CONFIG_ROWS: ConfigRow[] = [
  {
    label: "Theme",
    value: (
      <SegmentedControl
        options={["Auto", "Light", "Dark"]}
        active="Auto"
      />
    ),
  },
  {
    label: "Position",
    value: (
      <SegmentedControl
        options={["Bottom-right", "Bottom-left"]}
        active="Bottom-right"
      />
    ),
  },
  {
    label: "Primary color",
    value: <ColorSwatch hex="#FF6B35" />,
  },
  {
    label: "Title",
    value: <PillField text="Chat with Sarah" />,
  },
  {
    label: "Welcome message",
    value: (
      <PillField text="Hi! What can I help you with today?" longer />
    ),
  },
  {
    label: "First-launch action",
    value: (
      <SegmentedControl
        options={["Show greeting", "Auto-open", "None"]}
        active="Show greeting"
      />
    ),
  },
  {
    label: "Greeting delay",
    value: <PillField text="2,000 ms" mono />,
  },
  {
    label: "Voice agent",
    value: <Toggle on label="Enabled" />,
  },
  {
    label: "Suggested actions",
    value: (
      <div className="flex flex-wrap gap-1.5">
        {["Pricing", "Demo", "Support"].map((a) => (
          <span
            key={a}
            className="rounded-md border border-[var(--border-subtle)] bg-white/[0.03] px-2 py-0.5 font-geist text-[11px] text-foreground/70"
          >
            {a}
          </span>
        ))}
        <span className="rounded-md border border-dashed border-[var(--border-subtle)] px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/40">
          + add
        </span>
      </div>
    ),
  },
];

/**
 * Section 7 — Configure without code.
 *
 * Two-column. Left: pitch about who edits what (marketing vs engineering).
 * Right: a stylised admin-style config panel showing the most impactful
 * knobs. Pure presentation — visually mimics a real settings UI without
 * being interactive.
 */
export function WidgetSectionConfigure() {
  return (
    <section
      id="configure"
      className="relative z-10 border-t border-[var(--border-subtle)]"
    >
      <div className="mx-auto max-w-[1320px] px-6 pb-24 pt-24 lg:pb-32 lg:pt-32">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left — pitch */}
          <div className="min-w-0 lg:col-span-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
              Configure without code
            </div>
            <h2
              className={cn(
                "mt-4 font-space-grotesk font-semibold text-foreground",
                "text-[clamp(1.875rem,3.6vw,3rem)] leading-[1.1] tracking-[-0.02em]",
              )}
            >
              Engineering ships once. Marketing iterates forever.
            </h2>
            <p className="mt-5 max-w-[52ch] font-geist text-[15px] leading-[1.65] text-foreground/70">
              Every visible config knob lives in the AutoCrew dashboard.
              Theme, position, copy, suggested questions, voice toggle,
              greeting timing &mdash; change them per crew, push live, no
              redeploy. The widget pulls fresh config on every page load.
            </p>

            <div className="mt-8 space-y-2">
              {[
                "Tone the widget per audience without a code change",
                "A/B test copy and suggested questions in the dashboard",
                "Flip voice on for one crew, off for another",
                "Swap colors and position when the brand refreshes",
              ].map((bullet) => (
                <div
                  key={bullet}
                  className="flex items-baseline gap-3 font-geist text-[14px] leading-[1.6] text-foreground/75"
                >
                  <span
                    className="mt-1.5 inline-flex h-3 w-3 shrink-0 items-center justify-center rounded-full bg-[#FF6B35]/15"
                    aria-hidden
                  >
                    <Check className="h-2 w-2 text-[#FF6B35]" />
                  </span>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — config panel mockup */}
          <aside
            className="min-w-0 lg:col-span-7"
            aria-label="Widget config panel preview"
          >
            <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[#0a0c14]/95 shadow-2xl shadow-black/40">
              {/* Header — looks like an admin tab strip */}
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-white/[0.015] px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-foreground/15" aria-hidden />
                    <span className="h-2 w-2 rounded-full bg-foreground/15" aria-hidden />
                    <span className="h-2 w-2 rounded-full bg-foreground/15" aria-hidden />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
                    crews / autocrew-001 / customize
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-emerald-300/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden />
                  <span>Saved</span>
                </div>
              </div>

              {/* Form rows */}
              <dl>
                {CONFIG_ROWS.map((row, i) => (
                  <div
                    key={row.label}
                    className={cn(
                      "grid grid-cols-1 gap-3 px-5 py-3.5 sm:grid-cols-[180px_1fr] sm:items-center sm:gap-4",
                      i !== CONFIG_ROWS.length - 1 &&
                        "border-b border-[var(--border-subtle)]",
                    )}
                  >
                    <dt className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-foreground/55">
                      {row.label}
                    </dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>

              {/* Footer — looks like a save bar */}
              <div className="flex items-center justify-between border-t border-[var(--border-subtle)] bg-white/[0.015] px-5 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
                  Changes propagate on next page load
                </span>
                <span className="rounded-md border border-[#FF6B35]/40 bg-[#FF6B35]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#FF6B35]">
                  Publish
                </span>
              </div>
            </div>

            {/* Tiny note */}
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/40">
              Preview &middot; the actual dashboard ships with every crew
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

// ── Stylised form controls (presentational only) ─────────────────────────────

function SegmentedControl({
  options,
  active,
}: {
  options: string[];
  active: string;
}) {
  return (
    <div className="inline-flex items-center gap-0 rounded-md border border-[var(--border-subtle)] bg-white/[0.02] p-0.5">
      {options.map((opt) => {
        const isActive = opt === active;
        return (
          <span
            key={opt}
            className={cn(
              "rounded px-2.5 py-1 font-geist text-[11.5px] transition-colors",
              isActive
                ? "bg-[#FF6B35]/12 text-[#FF6B35]"
                : "text-foreground/60",
            )}
          >
            {opt}
          </span>
        );
      })}
    </div>
  );
}

function PillField({
  text,
  longer,
  mono,
}: {
  text: string;
  longer?: boolean;
  mono?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-[var(--border-subtle)] bg-white/[0.02] px-2.5 py-1 text-foreground/80",
        mono ? "font-mono text-[11.5px]" : "font-geist text-[12.5px]",
        longer && "max-w-full",
      )}
    >
      {text}
    </span>
  );
}

function ColorSwatch({ hex }: { hex: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-md border border-[var(--border-subtle)] bg-white/[0.02] px-2 py-1">
      <span
        className="h-4 w-4 rounded"
        style={{ backgroundColor: hex }}
        aria-hidden
      />
      <span className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-foreground/75">
        {hex}
      </span>
    </span>
  );
}

function Toggle({ on, label }: { on: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full transition-colors",
          on ? "bg-[#FF6B35]" : "bg-foreground/15",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
            on ? "translate-x-4" : "translate-x-0.5",
          )}
        />
      </span>
      <span className="font-geist text-[12.5px] text-foreground/75">
        {label}
      </span>
    </span>
  );
}

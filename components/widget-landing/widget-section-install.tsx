"use client";

import { useState } from "react";
import { Check, Clipboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { askSarah } from "@/lib/widget/ask-helpers";

const EMBED_SNIPPET = `<!-- 1. Tell the widget which crew to load -->
<script>
  window.AutoCrewConfig = { crewCode: "YOUR-CREW-CODE" };
</script>

<!-- 2. Drop in the widget -->
<script src="https://app.autocrew-ai.com/widget.js" async></script>`;

const QUEUE_STUB = `<!-- Optional: buffer pre-init AutoCrew.ask() calls -->
<script>
  window.AutoCrew = window.AutoCrew || {
    q: [],
    ask: function () { (this.q = this.q || []).push(["ask", arguments]); },
    open: function () { (this.q = this.q || []).push(["open", arguments]); },
    close: function () { (this.q = this.q || []).push(["close", arguments]); },
    onReady: function () { (this.q = this.q || []).push(["onReady", arguments]); }
  };
</script>`;

/**
 * Section 8 — Install in three lines.
 *
 * Two stacked code panels: the required embed snippet (with copy
 * affordance) and the optional GA-style queue stub for pre-init
 * triggers. A "Try with our crew" callout fires the live widget so
 * visitors can feel the install before signing up.
 */
export function WidgetSectionInstall() {
  return (
    <section
      id="install"
      className="relative z-10 border-t border-[var(--border-subtle)]"
    >
      <div className="mx-auto max-w-[1000px] px-6 pb-24 pt-24 lg:pb-32 lg:pt-32">
        {/* Header */}
        <div className="mb-12 max-w-[60ch] lg:mb-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
            Install
          </div>
          <h2
            className={cn(
              "mt-4 font-space-grotesk font-semibold text-foreground",
              "text-[clamp(1.875rem,3.6vw,3rem)] leading-[1.1] tracking-[-0.02em]",
            )}
          >
            Three lines. One <code className="font-mono">crewCode</code>.
            That&rsquo;s it.
          </h2>
          <p className="mt-5 max-w-[55ch] font-geist text-[16px] leading-[1.65] text-foreground/70">
            Paste the snippet anywhere in your page&rsquo;s HTML. The widget
            picks up its config from the dashboard, attaches the trigger
            listeners, and starts answering. No build step, no SDK install.
          </p>
        </div>

        {/* Primary embed snippet */}
        <CodePanel
          filename="index.html"
          tag="Required"
          code={EMBED_SNIPPET}
        />

        {/* Steps */}
        <ol className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            {
              n: "01",
              title: "Drops in",
              description:
                "Loads async. No render-blocking. No bundler config.",
            },
            {
              n: "02",
              title: "Pulls config",
              description:
                "Theme, position, suggested actions, voice toggle — all from your crew.",
            },
            {
              n: "03",
              title: "Wires triggers",
              description:
                "Declarative attrs, URL params, JS API, search element — all live.",
            },
          ].map((step) => (
            <li
              key={step.n}
              className="rounded-lg border border-[var(--border-subtle)] bg-white/[0.015] p-4"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#FF6B35]">
                {step.n}
              </div>
              <div className="mt-2 font-space-grotesk text-[15px] font-medium tracking-tight text-foreground">
                {step.title}
              </div>
              <div className="mt-1 font-geist text-[13px] leading-[1.55] text-foreground/65">
                {step.description}
              </div>
            </li>
          ))}
        </ol>

        {/* Optional queue stub */}
        <div className="mt-12">
          <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
            Optional
          </div>
          <p className="mb-4 max-w-[55ch] font-geist text-[14px] leading-[1.6] text-foreground/65">
            If you call <code className="font-mono text-foreground/85">AutoCrew.ask()</code>
            {" "}before <code className="font-mono text-foreground/85">widget.js</code> finishes
            loading, drop in the queue stub to buffer + replay. GA-style.
          </p>
          <CodePanel
            filename="head.html"
            tag="Pre-init queue"
            code={QUEUE_STUB}
          />
        </div>

        {/* Try-with-our-crew callout */}
        <div className="mt-14 flex flex-col gap-4 rounded-2xl border border-[var(--border-subtle)] bg-white/[0.015] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/55">
              Try it without signing up
            </div>
            <p className="mt-2 max-w-[48ch] font-geist text-[15px] leading-[1.55] text-foreground/80">
              The widget is already running on this page. Ask it for a
              walkthrough &mdash; you&rsquo;ll see exactly what your visitors
              would.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              askSarah(
                "Walk me through what installing the widget would look like for my business.",
              )
            }
            className={cn(
              "group inline-flex shrink-0 items-center gap-2 self-start rounded-full",
              "border border-[#FF6B35]/40 bg-[#FF6B35]/10",
              "hover:border-[#FF6B35]/60 hover:bg-[#FF6B35]/20",
              "px-4 py-2 transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/60",
            )}
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#FF6B35]">
              Ask the widget &rarr;
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Code panel with copy affordance ────────────────────────────────────────

function CodePanel({
  filename,
  tag,
  code,
}: {
  filename: string;
  tag: string;
  code: string;
}) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard unavailable; silent — the snippet is still selectable.
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[#06070b]/95">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-white/[0.015] px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-foreground/15" aria-hidden />
            <span className="h-2 w-2 rounded-full bg-foreground/15" aria-hidden />
            <span className="h-2 w-2 rounded-full bg-foreground/15" aria-hidden />
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/50">
            {filename}
          </span>
          <span className="rounded-full border border-[#FF6B35]/30 bg-[#FF6B35]/[0.08] px-2 py-0.5 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[#FF6B35]">
            {tag}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={cn(
            "group inline-flex items-center gap-1.5 rounded-full",
            "border border-[var(--border-subtle)] bg-white/[0.02]",
            "hover:border-[#FF6B35]/40 hover:bg-[#FF6B35]/[0.06]",
            "px-2.5 py-1 transition-colors",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/60",
          )}
        >
          {copied ? (
            <Check className="h-3 w-3 text-[#FF6B35]" />
          ) : (
            <Clipboard className="h-3 w-3 text-foreground/65 group-hover:text-[#FF6B35]" />
          )}
          <span
            className={cn(
              "font-mono text-[10px] uppercase tracking-[0.18em]",
              copied ? "text-[#FF6B35]" : "text-foreground/65 group-hover:text-[#FF6B35]",
            )}
          >
            {copied ? "Copied" : "Copy"}
          </span>
        </button>
      </div>
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[12.5px] leading-relaxed text-foreground/85">
        <code>{code}</code>
      </pre>
    </div>
  );
}

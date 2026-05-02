"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { ArrowRight, BarChart3, Mic, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { calculateRoi, type RoiInputs } from "@/lib/roi/calculate";
import { openVoice } from "@/lib/widget/ask-helpers";
import {
  roiCalculatorDefaults,
  roiInputFields,
  roiResultTiles,
} from "@/lib/mock-data/roi-calculator-data";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const integer = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

function formatTile(
  key: keyof ReturnType<typeof calculateRoi>,
  value: number,
): string {
  if (key === "laborCostSavedPerYear" || key === "revenueUpliftPerYear") {
    return currency.format(Math.round(value));
  }
  return integer.format(Math.round(value));
}

/**
 * Interactive ROI calculator — five sliders + numeric inputs on the left,
 * four live result tiles on the right. Pure client state, no API. Visual
 * shell mirrors the console card from coaching-hero.tsx (mono header bar,
 * border-subtle, bg-card).
 */
export function RoiCalculator() {
  const [inputs, setInputs] = useState<RoiInputs>(roiCalculatorDefaults);
  const sectionId = useId();

  const results = useMemo(() => calculateRoi(inputs), [inputs]);

  const update = (key: keyof RoiInputs, value: number) => {
    const safe = Number.isFinite(value) ? value : 0;
    setInputs((prev) => ({ ...prev, [key]: safe }));
  };

  const reset = () => setInputs(roiCalculatorDefaults);

  return (
    <section className="relative z-10">
      <div className="mx-auto max-w-[1320px] px-6 pb-16 pt-4 lg:pb-24">
        <div className="grid gap-4 lg:grid-cols-12 lg:items-start">
          {/* Inputs panel */}
          <div className="min-w-0 lg:col-span-7">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-card">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] bg-foreground/[0.025] px-5 py-3">
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>
                  ROI · Inputs
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-foreground/[0.02] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/60 transition-colors hover:border-[#FF6B35]/40 hover:text-[#FF6B35]"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden />
                  Reset
                </button>
              </div>

              <div className="flex flex-col gap-7 px-5 py-7 sm:px-7 sm:py-8">
                {roiInputFields.map((field) => {
                  const id = `${sectionId}-${field.key}`;
                  const value = inputs[field.key];
                  return (
                    <div key={field.key} className="flex flex-col gap-2.5">
                      <div className="flex items-baseline justify-between gap-3">
                        <Label
                          htmlFor={id}
                          className="font-geist text-[14px] font-medium text-foreground"
                        >
                          {field.label}
                        </Label>
                        <div className="inline-flex items-baseline gap-1 font-space-grotesk text-[15px] font-semibold tabular-nums text-foreground">
                          {field.prefix && (
                            <span className="text-foreground/55">
                              {field.prefix}
                            </span>
                          )}
                          <span>{integer.format(value)}</span>
                          {field.suffix && (
                            <span className="text-foreground/55">
                              {field.suffix}
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="font-geist text-[12.5px] leading-[1.55] text-foreground/55">
                        {field.helper}
                      </p>

                      <div className="flex items-center gap-3">
                        <input
                          id={id}
                          type="range"
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          value={value}
                          onChange={(e) =>
                            update(field.key, Number(e.target.value))
                          }
                          aria-label={field.label}
                          className="roi-range h-2 w-full cursor-pointer appearance-none rounded-full bg-foreground/[0.08] accent-[#FF6B35] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]/40"
                          style={{
                            backgroundImage: `linear-gradient(to right, #FF6B35 0%, #FF6B35 ${
                              ((value - field.min) /
                                Math.max(field.max - field.min, 1)) *
                              100
                            }%, rgba(255,255,255,0.08) ${
                              ((value - field.min) /
                                Math.max(field.max - field.min, 1)) *
                              100
                            }%, rgba(255,255,255,0.08) 100%)`,
                          }}
                        />
                        <Input
                          type="number"
                          inputMode="numeric"
                          min={field.min}
                          max={field.max}
                          step={field.step}
                          value={value}
                          onChange={(e) =>
                            update(field.key, Number(e.target.value))
                          }
                          aria-label={`${field.label} (numeric input)`}
                          className="h-9 w-24 shrink-0 text-right font-space-grotesk text-[14px] tabular-nums"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results panel */}
          <div className="min-w-0 lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-foreground/[0.02]">
              <div className="flex items-center justify-between gap-4 border-b border-[var(--border-subtle)] bg-foreground/[0.025] px-5 py-3">
                <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                  <BarChart3
                    className="h-3.5 w-3.5 text-[#FF6B35]"
                    aria-hidden
                  />
                  ROI · Live results
                </div>
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
                  Updated as you type
                </div>
              </div>

              <div className="flex flex-col gap-4 px-5 py-7 sm:px-7 sm:py-8">
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {roiResultTiles.map((tile) => (
                    <li
                      key={tile.key}
                      className="rounded-xl border border-[var(--border-subtle)] bg-card px-4 py-5"
                    >
                      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#FF6B35]">
                        {tile.eyebrow}
                      </div>
                      <div className="mt-2 font-space-grotesk text-[clamp(1.5rem,3.2vw,2.25rem)] font-semibold leading-[1.05] tracking-[-0.01em] tabular-nums text-foreground">
                        {formatTile(tile.key, results[tile.key])}
                      </div>
                      <div className="mt-1 font-geist text-[12px] leading-[1.45] text-foreground/55">
                        {tile.label}
                      </div>
                      <div className="mt-2 font-geist text-[11.5px] leading-[1.5] text-foreground/45">
                        {tile.sublabel}
                      </div>
                    </li>
                  ))}
                </ul>

                <p className="rounded-xl border border-[#FF6B35]/15 bg-[#FF6B35]/[0.04] px-4 py-3 font-geist text-[13px] leading-[1.55] text-foreground/80">
                  Autocrew saves you{" "}
                  <span className="font-semibold text-foreground">
                    {currency.format(Math.round(results.laborCostSavedPerYear))}
                  </span>{" "}
                  in labor and rescues{" "}
                  <span className="font-semibold text-foreground">
                    {integer.format(
                      Math.round(results.afterHoursLeadsCapturedPerMonth * 12),
                    )}
                  </span>{" "}
                  after-hours leads worth{" "}
                  <span className="font-semibold text-foreground">
                    {currency.format(Math.round(results.revenueUpliftPerYear))}
                  </span>{" "}
                  every year.
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3">
                  <Button
                    variant="pill"
                    size="pill-md"
                    onClick={() => openVoice()}
                    className="group shadow-[0_0_18px_rgba(255,107,53,0.35)] hover:shadow-[0_0_22px_rgba(255,107,53,0.5)]"
                  >
                    <Mic className="h-4 w-4" aria-hidden />
                    Talk to Sarah live
                  </Button>
                  <Button variant="pill-outline" size="pill-md" asChild>
                    <Link href="/contact">
                      Book a demo
                      <ArrowRight className="h-4 w-4 text-[#FF6B35]" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

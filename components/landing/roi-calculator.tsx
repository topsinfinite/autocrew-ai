"use client";

import { useState, useMemo, useCallback } from "react";
import { TrendingUp, PhoneMissed, DollarSign, Zap, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

// ─── Industry config ──────────────────────────────────────────────────────────

type Industry = {
  label: string;
  avgRevenue: number;
  defaultMissedPct: number;
  benchmark: string;
};

const INDUSTRIES: Record<string, Industry> = {
  healthcare: {
    label: "Healthcare / Dental",
    avgRevenue: 250,
    defaultMissedPct: 33,
    benchmark: "Practices lose ~$180K/year avg. to missed calls",
  },
  home_services: {
    label: "Home Services",
    avgRevenue: 350,
    defaultMissedPct: 40,
    benchmark: "Contractors miss 40% of after-hours leads on average",
  },
  legal: {
    label: "Legal",
    avgRevenue: 500,
    defaultMissedPct: 35,
    benchmark: "Law firms lose up to $250K/year to unanswered calls",
  },
  real_estate: {
    label: "Real Estate",
    avgRevenue: 1200,
    defaultMissedPct: 25,
    benchmark: "Agents miss 1 in 4 inbound buyer/seller inquiries",
  },
  general: {
    label: "General Business",
    avgRevenue: 200,
    defaultMissedPct: 30,
    benchmark: "SMBs lose an avg. 30% of call-driven revenue annually",
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

// ─── Component ───────────────────────────────────────────────────────────────

export function RoiCalculator() {
  // ── Form state ─────────────────────────────────────────────────────────────
  const [industryKey, setIndustryKey] = useState("healthcare");
  const [callVolume, setCallVolume] = useState(500);
  const [missedPct, setMissedPct] = useState(INDUSTRIES["healthcare"].defaultMissedPct);
  const [avgRevenue, setAvgRevenue] = useState(INDUSTRIES["healthcare"].avgRevenue);

  // ── Email gate state ───────────────────────────────────────────────────────
  const [showResults, setShowResults] = useState(false);
  const [showEmailGate, setShowEmailGate] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "success" | "error">("idle");

  // ── Calculations ───────────────────────────────────────────────────────────
  const results = useMemo(() => {
    const missedCalls = Math.round(callVolume * (missedPct / 100));
    const monthlyLost = missedCalls * avgRevenue;
    const annualLost = monthlyLost * 12;
    const projectedRecovery = annualLost * 0.85;
    return { missedCalls, monthlyLost, annualLost, projectedRecovery };
  }, [callVolume, missedPct, avgRevenue]);

  // ── Industry change handler ────────────────────────────────────────────────
  const handleIndustryChange = useCallback((key: string) => {
    const industry = INDUSTRIES[key];
    if (!industry) return;
    setIndustryKey(key);
    setMissedPct(industry.defaultMissedPct);
    setAvgRevenue(industry.avgRevenue);
  }, []);

  // ── CTA: reveal results (show email gate) ─────────────────────────────────
  const handleRevealCta = useCallback(() => {
    setShowEmailGate(true);
    setTimeout(() => {
      document.getElementById("roi-email-gate")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  }, []);

  // ── Email submit ───────────────────────────────────────────────────────────
  const handleEmailSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = email.trim();
      if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        setEmailError("Please enter a valid email address");
        return;
      }
      setEmailError("");
      setSubmitState("loading");

      try {
        const res = await fetch("/api/roi-calculator-signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: trimmed,
            industry: INDUSTRIES[industryKey]?.label,
            utm_source: typeof window !== "undefined"
              ? new URLSearchParams(window.location.search).get("utm_source") ?? "autocrew-website"
              : "autocrew-website",
            utm_medium: "lead-magnet",
            utm_campaign: "roi-calculator-2026",
          }),
        });
        if (!res.ok) throw new Error("Request failed");
        setSubmitState("success");
        setShowResults(true);
        setShowEmailGate(false);
        setTimeout(() => {
          document.getElementById("roi-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } catch {
        setSubmitState("error");
      }
    },
    [email, industryKey]
  );

  const industry = INDUSTRIES[industryKey];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* ── Inputs card ─────────────────────────────────────────────────── */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#0A0C14]/80 backdrop-blur-sm p-6 sm:p-8 shadow-xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Industry */}
          <div className="space-y-2 sm:col-span-2 lg:col-span-1">
            <Label className="text-sm font-medium text-muted-foreground">Industry</Label>
            <Select value={industryKey} onValueChange={handleIndustryChange}>
              <SelectTrigger className="bg-white/[0.03] border-white/10 h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(INDUSTRIES).map(([key, ind]) => (
                  <SelectItem key={key} value={key}>{ind.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Monthly call volume */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Monthly Calls
            </Label>
            <Input
              type="number"
              min={1}
              max={100000}
              value={callVolume}
              onChange={(e) => setCallVolume(clamp(parseInt(e.target.value) || 0, 1, 100000))}
              className="bg-white/[0.03] border-white/10 h-11"
              placeholder="500"
            />
          </div>

          {/* Missed call % */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Missed Call % <span className="text-[#FF6B35]">{missedPct}%</span>
            </Label>
            <div className="flex items-center gap-3 h-11">
              <input
                type="range"
                min={1}
                max={80}
                value={missedPct}
                onChange={(e) => setMissedPct(parseInt(e.target.value))}
                className="flex-1 accent-[#FF6B35] cursor-pointer"
              />
            </div>
          </div>

          {/* Avg revenue per booking */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Avg Revenue / Booking
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              <Input
                type="number"
                min={1}
                max={100000}
                value={avgRevenue}
                onChange={(e) => setAvgRevenue(clamp(parseInt(e.target.value) || 0, 1, 100000))}
                className="bg-white/[0.03] border-white/10 h-11 pl-7"
                placeholder="250"
              />
            </div>
          </div>
        </div>

        {/* Industry benchmark */}
        <div className="mt-5 flex items-start gap-2 px-3 py-2.5 rounded-lg bg-[#FF6B35]/[0.06] border border-[#FF6B35]/20">
          <TrendingUp className="w-4 h-4 text-[#FF6B35] mt-0.5 shrink-0" />
          <p className="text-xs text-[#FF6B35]/80">{industry.benchmark}</p>
        </div>

        {/* Preview metrics (always visible) */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard
            icon={<PhoneMissed className="w-4 h-4" />}
            label="Missed calls / mo"
            value={results.missedCalls.toLocaleString()}
            muted
          />
          <MetricCard
            icon={<DollarSign className="w-4 h-4" />}
            label="Lost revenue / mo"
            value={formatCurrency(results.monthlyLost)}
            muted
          />
          <MetricCard
            icon={<DollarSign className="w-4 h-4" />}
            label="Lost revenue / yr"
            value={formatCurrency(results.annualLost)}
            highlight
          />
          <MetricCard
            icon={<Zap className="w-4 h-4" />}
            label="Recovery w/ AutoCrew"
            value={formatCurrency(results.projectedRecovery)}
            accent
          />
        </div>

        {/* Primary CTA */}
        {!showResults && !showEmailGate && (
          <div className="mt-6 text-center">
            <Button
              variant="pill"
              size="pill-lg"
              onClick={handleRevealCta}
              className="gap-2"
            >
              Get My Custom ROI Report
              <ChevronRight className="w-4 h-4" />
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">Free, instant — no credit card required</p>
          </div>
        )}
      </div>

      {/* ── Email gate ──────────────────────────────────────────────────── */}
      {showEmailGate && !showResults && (
        <div
          id="roi-email-gate"
          className={cn(
            "mt-6 rounded-2xl border border-[#FF6B35]/30 bg-[#FF6B35]/[0.04] p-6 sm:p-8",
            "animate-in fade-in slide-in-from-bottom-4 duration-500"
          )}
        >
          <div className="max-w-lg mx-auto text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/20 mb-4">
              <TrendingUp className="w-5 h-5 text-[#FF6B35]" />
            </div>
            <h3 className="text-xl font-semibold font-space-grotesk text-foreground mb-1">
              Your report is ready
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Enter your work email to unlock your full ROI breakdown, industry benchmarks, and a
              custom recovery plan.
            </p>

            <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                  className="bg-white/[0.05] border-white/10 h-11 text-center sm:text-left"
                  aria-label="Work email"
                  aria-invalid={!!emailError}
                  disabled={submitState === "loading"}
                />
                {emailError && (
                  <p className="mt-1 text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{emailError}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                variant="pill"
                size="pill-md"
                disabled={submitState === "loading"}
                className="shrink-0"
              >
                {submitState === "loading" ? "Sending…" : "Unlock Full Report"}
              </Button>
            </form>

            {submitState === "error" && (
              <p className="mt-3 text-xs text-destructive flex items-center justify-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Something went wrong. Please try again.
              </p>
            )}

            <p className="mt-3 text-xs text-muted-foreground/60">
              No spam. Unsubscribe any time.
            </p>
          </div>
        </div>
      )}

      {/* ── Full results (post email gate) ──────────────────────────────── */}
      {showResults && (
        <div
          id="roi-results"
          className={cn(
            "mt-6 rounded-2xl border border-white/[0.08] bg-[#0A0C14]/80 p-6 sm:p-8",
            "animate-in fade-in slide-in-from-bottom-4 duration-500"
          )}
        >
          {/* Success message */}
          <div className="flex items-center gap-2 mb-6 text-sm text-green-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Your custom report has been sent to <strong>{email}</strong></span>
          </div>

          <h3 className="text-xl font-semibold font-space-grotesk text-foreground mb-1">
            Your ROI Summary
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            Based on <strong>{callVolume.toLocaleString()} calls/mo</strong>,{" "}
            <strong>{missedPct}% missed</strong>, and{" "}
            <strong>{formatCurrency(avgRevenue)}/booking</strong> — {industry.label}
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <ResultBlock
              label="Monthly missed calls"
              value={results.missedCalls.toLocaleString()}
              sub="calls going unanswered each month"
            />
            <ResultBlock
              label="Monthly lost revenue"
              value={formatCurrency(results.monthlyLost)}
              sub="slipping through the cracks every month"
            />
            <ResultBlock
              label="Annual lost revenue"
              value={formatCurrency(results.annualLost)}
              sub="per year without AI voice coverage"
              highlight
            />
            <ResultBlock
              label="Projected recovery with AutoCrew"
              value={formatCurrency(results.projectedRecovery)}
              sub="at our 85% call-capture rate"
              accent
            />
          </div>

          <div className="mt-6 rounded-xl bg-[#FF6B35]/[0.06] border border-[#FF6B35]/20 p-4">
            <p className="text-sm text-[#FF6B35]/90 font-medium mb-1">Industry insight</p>
            <p className="text-xs text-muted-foreground">{industry.benchmark}</p>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <Button variant="pill" size="pill-md" asChild>
              <a href="https://app.autocrew-ai.com/signup" target="_blank" rel="noopener noreferrer">
                Start Recovering Revenue
                <ChevronRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="pill-outline" size="pill-md" asChild>
              <a href="/contact">Talk to Sales</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricCard({
  icon,
  label,
  value,
  muted,
  highlight,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  muted?: boolean;
  highlight?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-3 border",
        accent
          ? "bg-[#FF6B35]/[0.08] border-[#FF6B35]/30"
          : highlight
          ? "bg-white/[0.04] border-white/10"
          : "bg-white/[0.02] border-white/[0.06]"
      )}
    >
      <div
        className={cn(
          "flex items-center gap-1 mb-1",
          accent ? "text-[#FF6B35]" : highlight ? "text-foreground/70" : "text-muted-foreground"
        )}
      >
        {icon}
        <span className="text-[10px] font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p
        className={cn(
          "text-lg font-bold font-space-grotesk tabular-nums",
          accent ? "text-[#FF6B35]" : highlight ? "text-foreground" : "text-foreground/80"
        )}
      >
        {value}
      </p>
    </div>
  );
}

function ResultBlock({
  label,
  value,
  sub,
  highlight,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-4",
        accent
          ? "bg-[#FF6B35]/[0.08] border-[#FF6B35]/30"
          : highlight
          ? "bg-white/[0.04] border-white/10"
          : "bg-white/[0.02] border-white/[0.06]"
      )}
    >
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p
        className={cn(
          "text-3xl font-bold font-space-grotesk tabular-nums",
          accent ? "text-[#FF6B35]" : "text-foreground"
        )}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

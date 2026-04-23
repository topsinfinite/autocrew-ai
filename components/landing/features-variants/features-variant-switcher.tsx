"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { FeaturesVariantCard } from "./features-variant-card";
import { FeaturesVariantCta } from "./features-variant-cta";
import { FeaturesVariantHover } from "./features-variant-hover";
import { FeaturesVariantLink } from "./features-variant-link";
import { FeaturesVariantPills } from "./features-variant-pills";

type VariantId = "1" | "2" | "3" | "4" | "5";

interface VariantMeta {
  id: VariantId;
  title: string;
  subtitle: string;
}

const VARIANTS: VariantMeta[] = [
  { id: "1", title: "Ask link", subtitle: "Subtle per-card CTA" },
  { id: "2", title: "FAQ pills", subtitle: "Two question chips per card" },
  { id: "3", title: "Whole card", subtitle: "Entire card is the trigger" },
  { id: "4", title: "Hover bar", subtitle: "Ask / Hear slides in on hover" },
  { id: "5", title: "Unified CTA", subtitle: "One module below the grid" },
];

const DEFAULT_VARIANT: VariantId = "1";
const STORAGE_KEY = "features-variant";
const URL_PARAM = "features";

function isValidVariant(v: string | null | undefined): v is VariantId {
  return v === "1" || v === "2" || v === "3" || v === "4" || v === "5";
}

function readInitial(): VariantId {
  if (typeof window === "undefined") return DEFAULT_VARIANT;
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get(URL_PARAM);
  if (isValidVariant(fromUrl)) return fromUrl;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isValidVariant(stored)) return stored;
  } catch {
    // localStorage may be unavailable — fall through.
  }
  return DEFAULT_VARIANT;
}

function renderVariant(id: VariantId) {
  switch (id) {
    case "2":
      return <FeaturesVariantPills />;
    case "3":
      return <FeaturesVariantCard />;
    case "4":
      return <FeaturesVariantHover />;
    case "5":
      return <FeaturesVariantCta />;
    case "1":
    default:
      return <FeaturesVariantLink />;
  }
}

export function FeaturesVariantSwitcher() {
  const [hydrated, setHydrated] = useState(false);
  const [variant, setVariant] = useState<VariantId>(DEFAULT_VARIANT);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setVariant(readInitial());
  }, []);

  const handlePick = useCallback((id: VariantId) => {
    setVariant(id);
    setOpen(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // ignore
    }
    const url = new URL(window.location.href);
    url.searchParams.set(URL_PARAM, id);
    window.history.replaceState(null, "", url.toString());
  }, []);

  const active = hydrated ? variant : DEFAULT_VARIANT;
  const activeMeta = VARIANTS.find((v) => v.id === active) ?? VARIANTS[0];

  return (
    <>
      {renderVariant(active)}

      {hydrated && (
        <div
          className="fixed bottom-6 left-6 z-[80] font-geist"
          data-contextual-ai="off"
        >
          {open && (
            <div
              className={cn(
                "mb-2 w-[280px] overflow-hidden rounded-xl border border-[var(--border-subtle)]",
                "bg-[#0A0C14]/95 backdrop-blur-xl shadow-2xl",
                "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2",
              )}
              role="listbox"
              aria-label="Features section variant"
            >
              <div className="border-b border-[var(--border-subtle)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/50">
                Features &mdash; widget trigger
              </div>
              <ul>
                {VARIANTS.map((v) => {
                  const isActive = v.id === active;
                  return (
                    <li key={v.id}>
                      <button
                        type="button"
                        onClick={() => handlePick(v.id)}
                        className={cn(
                          "group flex w-full items-start gap-3 px-4 py-3 text-left transition-colors",
                          isActive
                            ? "bg-[#FF6B35]/[0.06]"
                            : "hover:bg-white/[0.03]",
                        )}
                        role="option"
                        aria-selected={isActive}
                      >
                        <span
                          className={cn(
                            "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full",
                            isActive ? "bg-[#FF6B35]" : "bg-foreground/25",
                          )}
                          aria-hidden="true"
                        />
                        <span className="flex-1">
                          <span className="block text-[13px] font-medium text-foreground">
                            {v.title}
                          </span>
                          <span className="mt-0.5 block text-[12px] text-foreground/55">
                            {v.subtitle}
                          </span>
                        </span>
                        <span
                          className={cn(
                            "font-mono text-[10px] uppercase tracking-[0.18em]",
                            isActive ? "text-[#FF6B35]" : "text-foreground/40",
                          )}
                        >
                          {v.id}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-[var(--border-subtle)] px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
                Temporary &middot; remove after pick
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "group inline-flex items-center gap-3 rounded-full border border-[var(--border-subtle)]",
              "bg-[#0A0C14]/90 px-4 py-2 backdrop-blur-xl shadow-lg",
              "hover:border-[#FF6B35]/40 hover:bg-[#0A0C14]",
              "transition-colors",
            )}
            aria-expanded={open}
            aria-haspopup="listbox"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B35]/60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#FF6B35]" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/70 group-hover:text-foreground">
              Features: {activeMeta.title}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/40">
              {active}
            </span>
          </button>
        </div>
      )}
    </>
  );
}

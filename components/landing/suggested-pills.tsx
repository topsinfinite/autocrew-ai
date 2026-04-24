"use client";

import { cn } from "@/lib/utils";
import { askSarah } from "@/lib/widget/ask-helpers";

/** Visual treatments for the suggested-question pill row. */
export type PillVariant = "editorial" | "architectural" | "conversational";

export interface SuggestedPillsProps {
  questions: readonly string[];
  variant: PillVariant;
  className?: string;
}

const EDITORIAL_CLASSES = {
  list: "flex flex-wrap items-center gap-x-6 gap-y-3 text-sm",
  item: "group inline-flex items-center gap-2 text-foreground/70 transition-colors hover:text-foreground",
  dot: "h-[5px] w-[5px] rounded-full bg-[#FF6B35]/70 transition-colors group-hover:bg-[#FF6B35]",
  label: "font-geist tracking-normal",
  divider: "hidden sm:inline text-foreground/20",
};

const ARCHITECTURAL_CLASSES = {
  list: "flex flex-wrap items-center gap-2",
  item: "group inline-flex items-center gap-2 rounded-md border border-[var(--border-subtle)] bg-white/[0.02] px-3 py-1.5 text-[11px] font-mono uppercase tracking-[0.12em] text-foreground/70 transition-colors hover:border-[#FF6B35]/40 hover:bg-[#FF6B35]/[0.04] hover:text-foreground",
  dot: "h-1.5 w-1.5 rounded-full bg-[#FF6B35]/50 transition-colors group-hover:bg-[#FF6B35]",
  label: "",
  divider: "hidden",
};

const CONVERSATIONAL_CLASSES = {
  list: "flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-5 sm:gap-y-2",
  item: "group inline-flex items-baseline gap-2 text-[15px] italic text-foreground/65 transition-colors hover:text-foreground",
  dot: "h-1 w-1 rounded-full bg-[#FF6B35]/70 translate-y-[-3px] transition-colors group-hover:bg-[#FF6B35]",
  label: "font-geist",
  divider: "hidden",
};

function classesFor(variant: PillVariant) {
  switch (variant) {
    case "architectural":
      return ARCHITECTURAL_CLASSES;
    case "conversational":
      return CONVERSATIONAL_CLASSES;
    case "editorial":
    default:
      return EDITORIAL_CLASSES;
  }
}

export function SuggestedPills({
  questions,
  variant,
  className,
}: SuggestedPillsProps) {
  const classes = classesFor(variant);

  return (
    <ul
      className={cn(classes.list, className)}
      aria-label="Suggested questions"
    >
      {questions.map((question, i) => (
        <li key={question} className="inline-flex items-center gap-x-6">
          <button
            type="button"
            onClick={() => askSarah(question)}
            className={classes.item}
          >
            <span className={classes.dot} aria-hidden="true" />
            <span className={classes.label}>{question}</span>
          </button>
          {variant === "editorial" && i < questions.length - 1 && (
            <span className={classes.divider} aria-hidden="true">
              /
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

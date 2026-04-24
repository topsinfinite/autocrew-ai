import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type Cell = "✓" | "—" | "partial" | string;

interface ComparisonRow {
  attribute: string;
  values: [Cell, Cell, Cell, Cell]; // [staticForm, chatbot, custom, autocrew]
}

interface Column {
  key: string;
  label: string;
  highlight?: boolean;
}

const COLUMNS: Column[] = [
  { key: "static", label: "Static form" },
  { key: "chatbot", label: "Generic chatbot" },
  { key: "custom", label: "Custom AI build" },
  { key: "autocrew", label: "AutoCrew triggers", highlight: true },
];

const ROWS: ComparisonRow[] = [
  {
    attribute: "Time to deploy",
    values: ["Hours", "Days", "Weeks", "Minutes"],
  },
  {
    attribute: "Per-page question targeting",
    values: ["—", "partial", "✓", "✓"],
  },
  {
    attribute: "Voice mode",
    values: ["—", "—", "Custom build", "✓"],
  },
  {
    attribute: "Single-dispatch + length-capped",
    values: ["—", "Varies", "Varies", "✓"],
  },
  {
    attribute: "Live handoff to humans",
    values: ["—", "✓", "✓", "✓"],
  },
  {
    attribute: "New triggers without re-embed",
    values: ["—", "—", "—", "✓"],
  },
  {
    attribute: "Cost",
    values: ["Low", "Per-seat (high)", "Very high", "Usage-based"],
  },
];

/**
 * Section 9 — Versus alternatives.
 *
 * Compact comparison table. AutoCrew column is highlighted to read as
 * the answer. Cells are mostly check / dash / short string for fast
 * scanning; no marketing prose inside the grid.
 */
export function WidgetSectionCompare() {
  return (
    <section
      id="compare"
      className="relative z-10 border-t border-[var(--border-subtle)]"
    >
      <div className="mx-auto max-w-[1320px] px-6 pb-24 pt-24 lg:pb-32 lg:pt-32">
        <div className="mb-12 max-w-[60ch] lg:mb-16">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-foreground/45">
            Versus the alternatives
          </div>
          <h2
            className={cn(
              "mt-4 font-space-grotesk font-semibold text-foreground",
              "text-[clamp(1.875rem,3.6vw,3rem)] leading-[1.1] tracking-[-0.02em]",
            )}
          >
            Static forms. Off-the-shelf chatbots. Custom builds. None of
            them ship in five minutes.
          </h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-white/[0.015]">
          <table className="w-full min-w-[760px] border-separate border-spacing-0">
            <thead>
              <tr>
                <th className="border-b border-[var(--border-subtle)] px-5 py-4 text-left font-mono text-[10px] font-normal uppercase tracking-[0.22em] text-foreground/45">
                  Capability
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      "border-b border-[var(--border-subtle)] px-5 py-4 text-left font-mono text-[10px] uppercase tracking-[0.22em]",
                      col.highlight
                        ? "bg-[#FF6B35]/[0.06] text-[#FF6B35]"
                        : "text-foreground/55",
                    )}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, rowIdx) => (
                <tr key={row.attribute}>
                  <th
                    scope="row"
                    className={cn(
                      "border-r border-[var(--border-subtle)] px-5 py-4 text-left font-geist text-[14px] font-medium text-foreground",
                      rowIdx !== ROWS.length - 1 &&
                        "border-b border-[var(--border-subtle)]",
                    )}
                  >
                    {row.attribute}
                  </th>
                  {row.values.map((value, colIdx) => {
                    const col = COLUMNS[colIdx];
                    return (
                      <td
                        key={colIdx}
                        className={cn(
                          "px-5 py-4 align-middle font-geist text-[13.5px]",
                          rowIdx !== ROWS.length - 1 &&
                            "border-b border-[var(--border-subtle)]",
                          colIdx !== row.values.length - 1 &&
                            "border-r border-[var(--border-subtle)]",
                          col.highlight
                            ? "bg-[#FF6B35]/[0.04] text-foreground"
                            : "text-foreground/70",
                        )}
                      >
                        <Cell value={value} highlight={col.highlight} />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 max-w-[60ch] font-geist text-[13px] italic text-foreground/45">
          The single feature only AutoCrew has: a new trigger never requires
          a re-embed. Add an HTML attribute, change a URL param, the widget
          picks it up.
        </p>
      </div>
    </section>
  );
}

function Cell({ value, highlight }: { value: Cell; highlight?: boolean }) {
  if (value === "✓") {
    return (
      <span className="inline-flex items-center gap-1.5">
        <Check
          className={cn(
            "h-3.5 w-3.5",
            highlight ? "text-[#FF6B35]" : "text-foreground/55",
          )}
        />
        <span className="sr-only">Yes</span>
      </span>
    );
  }
  if (value === "—") {
    return (
      <span className="inline-flex items-center gap-1.5 text-foreground/35">
        <Minus className="h-3.5 w-3.5" />
        <span className="sr-only">No</span>
      </span>
    );
  }
  if (value === "partial") {
    return (
      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground/50">
        Partial
      </span>
    );
  }
  return <span>{value}</span>;
}

"use client";

/**
 * Blinking terminal-style caret. Steps hard (no fade) via CSS keyframes
 * defined in globals.css (see `@keyframes cursor-blink`).
 */
export function TypewriterCaret({
  color = "#FF6B35",
  className,
}: {
  color?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: "inline-block",
        width: "0.08em",
        height: "0.95em",
        marginLeft: "0.08em",
        verticalAlign: "-0.05em",
        background: color,
        animation: "cursor-blink 1s step-start infinite",
      }}
    />
  );
}

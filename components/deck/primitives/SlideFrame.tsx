import { SLIDE_WIDTH, SLIDE_HEIGHT, SLIDE_OUTER_MARGIN } from "@/lib/deck/tokens";

type Props = {
  /** Footer node, rendered bottom-aligned with hairline rule above. Optional. */
  footer?: React.ReactNode;
  /** Header node, rendered top-aligned. Optional (some slides like Cover/ClosingCTA omit). */
  header?: React.ReactNode;
  /** Override default outer padding (e.g. ClosingCTA centered layout). */
  noPadding?: boolean;
  children: React.ReactNode;
};

export function SlideFrame({ footer, header, noPadding, children }: Props) {
  return (
    <section
      data-deck-slide
      style={{
        width: SLIDE_WIDTH,
        height: SLIDE_HEIGHT,
        background: "var(--deck-bg)",
        color: "var(--deck-text-primary)",
        position: "relative",
        overflow: "hidden",
        padding: noPadding ? 0 : SLIDE_OUTER_MARGIN,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {header ? <header style={{ flexShrink: 0 }}>{header}</header> : null}
      <div style={{ flex: 1, minHeight: 0 }}>{children}</div>
      {footer ? (
        <footer
          style={{
            flexShrink: 0,
            paddingTop: 24,
            borderTop: "1px solid var(--deck-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          {footer}
        </footer>
      ) : null}
    </section>
  );
}

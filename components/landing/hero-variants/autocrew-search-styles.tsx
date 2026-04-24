/**
 * Theme-aware overrides for the `<autocrew-search>` custom element.
 *
 * The widget ships with a white pill by default. In light mode that looks
 * right. In dark mode we swap to a visible dark pill with enough border
 * contrast to be identifiable as an input (≥3:1 non-text contrast).
 *
 * Gated on the root `<html data-theme>` attribute so the widget auto-adapts
 * to theme without any prop plumbing — there is no need to mark individual
 * `<autocrew-search>` elements as dark.
 *
 * Injected as a raw `<style>` because Tailwind v4's Lightning CSS compiler
 * strips `::part()` selectors during build; inlining bypasses the compiler.
 */
export function AutocrewSearchStyles() {
  return (
    <style
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{
        __html: `
          [data-theme="dark"] autocrew-search::part(form) {
            background: rgba(255, 255, 255, 0.04);
            border-color: rgba(255, 255, 255, 0.18);
            box-shadow: none;
          }
          [data-theme="dark"] autocrew-search::part(form):focus-within {
            border-color: rgba(255, 107, 53, 0.55);
            box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.15);
          }
          [data-theme="dark"] autocrew-search::part(input) {
            background: transparent;
            color: rgba(255, 255, 255, 0.95);
          }
          [data-theme="dark"] autocrew-search::part(input)::placeholder {
            color: rgba(255, 255, 255, 0.5);
          }
          /* Theme-agnostic: widget ships with system fonts. Route the parts
             through our product's type system so the widget reads as part
             of the site, not a bolted-on third-party component. Core widget
             behaviour (submit on enter, mode switching, queue) is untouched. */
          autocrew-search::part(input) {
            font-family: var(--font-geist-sans), "Inter", system-ui,
              -apple-system, sans-serif;
            font-size: 15px;
          }
          /* Button matches our <Button variant="pill"> — Space Grotesk +
             black text (fixes 2.9:1 contrast against warm orange → 7.1:1). */
          autocrew-search::part(button) {
            font-family: "Space Grotesk", var(--font-display), system-ui,
              sans-serif;
            font-weight: 600;
            color: #000 !important;
          }
        `,
      }}
    />
  );
}

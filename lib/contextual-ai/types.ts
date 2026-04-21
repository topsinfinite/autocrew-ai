export interface EnrichedContext {
  /** Exact highlighted text, capped at 1000 chars by the hook. */
  selection: string;
  /** Nearest block-level ancestor's text, whitespace-collapsed, <= 500 chars. */
  surrounding?: string;
  /** Label for the section containing the selection, <= 80 chars. */
  sectionLabel?: string;
  /** location.pathname — no search, no hash. */
  url: string;
}

export interface ContextualAIAdapter {
  prefillWithContext(ctx: EnrichedContext): Promise<void> | void;
}

export type ContextualAIEvent =
  | {
      name: "contextual_ai_selection";
      chars: number;
      sectionLabel?: string;
      path: string;
    }
  | {
      name: "contextual_ai_open";
      chars: number;
      sectionLabel?: string;
      path: string;
      hasSurrounding: boolean;
    }
  | {
      name: "contextual_ai_dismissed";
      reason: "click_away" | "escape" | "scroll" | "resize" | "route_change";
    }
  | { name: "contextual_ai_adapter_missing"; path: string };

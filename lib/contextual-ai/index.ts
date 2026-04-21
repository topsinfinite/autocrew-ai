export { buildContext, inferSectionLabel, SURROUNDING_CAP } from "./context";
export { resolveAdapter, stubAdapter } from "./adapter";
export { isEnabled, isStubEnabled, hasAnalyticsConsent } from "./flags";
export { track } from "./events";
export type {
  ContextualAIAdapter,
  ContextualAIEvent,
  EnrichedContext,
} from "./types";

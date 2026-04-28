import type { AccentToken, DisplayStyle } from "./tokens";
import type { SlideContent } from "./slide-content-types";
import { WIDGET_PITCH_SLIDES } from "./templates/widget-pitch";
import { HEALTHCARE_PITCH_SLIDES } from "./templates/healthcare-pitch";
import { RESTAURANT_PITCH_SLIDES } from "./templates/restaurant-pitch";
import { BLANK_SLIDES } from "./templates/blank";

export type DeckTemplateId = "widget-pitch" | "healthcare-pitch" | "restaurant-pitch" | "blank";

export type DeckTemplateManifest = {
  id: DeckTemplateId;
  name: string;
  description: string;
  thumbnail: string;
  defaultAccent: AccentToken;
  defaultDisplayStyle: DisplayStyle;
  slides: SlideContent[];
};

export const DECK_TEMPLATES: Record<DeckTemplateId, DeckTemplateManifest> = {
  "widget-pitch":     { id: "widget-pitch",     name: "Widget Pitch",      description: "The full 15-slide product pitch.",          thumbnail: "/decks/thumbs/widget-pitch.jpg",     defaultAccent: "orange", defaultDisplayStyle: "bold-sans",    slides: WIDGET_PITCH_SLIDES },
  "healthcare-pitch": { id: "healthcare-pitch", name: "Healthcare Pitch",  description: "HIPAA-aware voice agents for clinics.",     thumbnail: "/decks/thumbs/healthcare-pitch.jpg", defaultAccent: "green",  defaultDisplayStyle: "serif-italic", slides: HEALTHCARE_PITCH_SLIDES },
  "restaurant-pitch": { id: "restaurant-pitch", name: "Restaurant Pitch",  description: "Phone + reservations for restaurants.",     thumbnail: "/decks/thumbs/restaurant-pitch.jpg", defaultAccent: "orange", defaultDisplayStyle: "serif-italic", slides: RESTAURANT_PITCH_SLIDES },
  "blank":            { id: "blank",            name: "Blank deck",        description: "Cover + ClosingCTA. Add the rest.",         thumbnail: "/decks/thumbs/blank.jpg",            defaultAccent: "green",  defaultDisplayStyle: "serif-italic", slides: BLANK_SLIDES },
};

export const DECK_TEMPLATE_LIST: DeckTemplateManifest[] = Object.values(DECK_TEMPLATES);

import { sequence as aiReceptionist } from "@/content/welcome-sequences/ai-receptionist";
import { sequence as aiReceptionistCoaching } from "@/content/welcome-sequences/ai-receptionist-coaching";
import { sequence as aiReceptionistHealthcare } from "@/content/welcome-sequences/ai-receptionist-healthcare";
import { sequence as aiReceptionistHomeServices } from "@/content/welcome-sequences/ai-receptionist-home-services";
import { sequence as aiReceptionistLegal } from "@/content/welcome-sequences/ai-receptionist-legal";
import { sequence as aiReceptionistRestaurant } from "@/content/welcome-sequences/ai-receptionist-restaurant";
import { sequence as healthcareCrew } from "@/content/welcome-sequences/healthcare-crew";
import { sequence as supportCrew } from "@/content/welcome-sequences/support-crew";
import { sequence as widget } from "@/content/welcome-sequences/widget";

import type {
  Locations,
  PackageGroup,
  PackageSlug,
  SequenceStep,
  TokenValues,
  Vertical,
  WelcomeSequence,
} from "./types";
import { PACKAGE_SLUGS } from "./types";

const SEQUENCES: Record<PackageSlug, WelcomeSequence> = {
  "ai-receptionist": aiReceptionist,
  "ai-receptionist-healthcare": aiReceptionistHealthcare,
  "ai-receptionist-legal": aiReceptionistLegal,
  "ai-receptionist-restaurant": aiReceptionistRestaurant,
  "ai-receptionist-coaching": aiReceptionistCoaching,
  "ai-receptionist-home-services": aiReceptionistHomeServices,
  widget,
  "healthcare-crew": healthcareCrew,
  "support-crew": supportCrew,
};

const GROUP_ORDER: PackageGroup[] = ["receptionist", "widget", "crews"];

const GROUP_LABELS: Record<PackageGroup, string> = {
  receptionist: "Receptionist",
  widget: "Widget",
  crews: "Crews",
};

export function getSequence(slug: PackageSlug): WelcomeSequence {
  const seq = SEQUENCES[slug];
  if (!seq) {
    throw new Error(`Missing welcome sequence for package: ${slug}`);
  }
  return seq;
}

export function listSequences(): WelcomeSequence[] {
  return PACKAGE_SLUGS.map((slug) => getSequence(slug));
}

export function listSequencesByGroup(): {
  group: PackageGroup;
  label: string;
  packages: WelcomeSequence[];
}[] {
  const all = listSequences();
  return GROUP_ORDER.map((group) => ({
    group,
    label: GROUP_LABELS[group],
    packages: all.filter((s) => s.group === group),
  }));
}

export function isPackageSlug(value: string): value is PackageSlug {
  return (PACKAGE_SLUGS as readonly string[]).includes(value);
}

export function resolveStepBody(
  sequence: WelcomeSequence,
  step: SequenceStep,
  locations: Locations,
): string {
  const useMulti =
    Boolean(step.bodyMulti) &&
    (sequence.persona === "multi-location" || locations !== "1");
  return useMulti && step.bodyMulti ? step.bodyMulti : step.body;
}

export function toTokenValues(input: {
  adminName: string;
  company: string;
  packageSlug: PackageSlug;
  vertical: Vertical;
  locations: Locations;
  goLive: string;
  promisedOutcome: string;
  ownerName: string;
  ownerEmail: string;
}): TokenValues {
  const sequence = getSequence(input.packageSlug);
  return {
    admin_name: input.adminName.trim(),
    company: input.company.trim(),
    package_name: sequence.label,
    vertical: input.vertical,
    locations: input.locations,
    go_live: input.goLive.trim(),
    promised_outcome: input.promisedOutcome.trim(),
    owner_name: input.ownerName.trim(),
    owner_email: input.ownerEmail.trim(),
  };
}

export const VERTICAL_OPTIONS: { value: Vertical; label: string }[] = [
  { value: "healthcare", label: "Healthcare" },
  { value: "legal", label: "Legal" },
  { value: "restaurant", label: "Restaurant" },
  { value: "coaching", label: "Coaching" },
  { value: "home-services", label: "Home Services" },
  { value: "other", label: "Other" },
];

export const LOCATION_OPTIONS: { value: Locations; label: string }[] = [
  { value: "1", label: "1 location" },
  { value: "2-5", label: "2–5 locations" },
  { value: "6+", label: "6+ locations" },
];

export const PACKAGE_SLUGS = [
  "ai-receptionist",
  "ai-receptionist-healthcare",
  "ai-receptionist-legal",
  "ai-receptionist-restaurant",
  "ai-receptionist-coaching",
  "ai-receptionist-home-services",
  "widget",
  "healthcare-crew",
  "support-crew",
] as const;

export type PackageSlug = (typeof PACKAGE_SLUGS)[number];

export type PackageGroup = "receptionist" | "widget" | "crews";

export type Vertical =
  | "healthcare"
  | "legal"
  | "restaurant"
  | "coaching"
  | "home-services"
  | "other";

export type Locations = "1" | "2-5" | "6+";

export type StepStatus = "authored" | "stub";

export type Persona = "solo" | "multi-location";

export const TOKEN_KEYS = [
  "admin_name",
  "company",
  "package_name",
  "vertical",
  "locations",
  "go_live",
  "promised_outcome",
  "owner_name",
  "owner_email",
] as const;

export type TokenKey = (typeof TOKEN_KEYS)[number];

export type TokenValues = Record<TokenKey, string>;

export type SequenceStep = {
  id: 0 | 1 | 2 | 3;
  timing: string;
  job: string;
  status: StepStatus;
  subject: string;
  body: string;
  /** Used when persona is multi-location or locations !== "1" */
  bodyMulti?: string;
};

export type WelcomeSequence = {
  slug: PackageSlug;
  label: string;
  group: PackageGroup;
  persona: Persona;
  /** When set, Composer locks vertical to this value */
  lockedVertical?: Vertical;
  siteSource: string;
  steps: [SequenceStep, SequenceStep, SequenceStep, SequenceStep];
};

export type IntakeFormState = {
  adminName: string;
  adminEmail: string;
  company: string;
  packageSlug: PackageSlug;
  vertical: Vertical;
  locations: Locations;
  goLive: string;
  promisedOutcome: string;
  ownerName: string;
  ownerEmail: string;
};

export const FRICTION_FOOTER_TEMPLATE =
  "Reply to this email with: (1) where you are in setup, (2) anything confusing. Your Autocrew contact is {{owner_name}} ({{owner_email}}).";

export const COOKIE_NAME = "welcome_composer_auth";

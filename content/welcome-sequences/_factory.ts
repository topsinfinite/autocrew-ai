import type {
  PackageGroup,
  PackageSlug,
  Persona,
  SequenceStep,
  Vertical,
  WelcomeSequence,
} from "@/lib/welcome-sequences/types";

function stubStep(
  id: 1 | 2 | 3,
  timing: string,
  job: string,
): SequenceStep {
  return {
    id,
    timing,
    job,
    status: "stub",
    subject: "",
    body: "",
  };
}

export function defineSequence(input: {
  slug: PackageSlug;
  label: string;
  group: PackageGroup;
  persona: Persona;
  lockedVertical?: Vertical;
  siteSource: string;
  day0Subject: string;
  day0Body: string;
  day0BodyMulti?: string;
}): WelcomeSequence {
  return {
    slug: input.slug,
    label: input.label,
    group: input.group,
    persona: input.persona,
    lockedVertical: input.lockedVertical,
    siteSource: input.siteSource,
    steps: [
      {
        id: 0,
        timing: "Day of close / kickoff",
        job: "Welcome, what you bought, who to reply to, 7-day success definition",
        status: "authored",
        subject: input.day0Subject,
        body: input.day0Body,
        bodyMulti: input.day0BodyMulti,
      },
      stubStep(1, "Day 2–3", "Setup / first value path"),
      stubStep(2, "Day 5–7", "Admin dashboard / product surface tour"),
      stubStep(3, "Day 10–14", '"Are you live?" + collect stuck points'),
    ],
  };
}

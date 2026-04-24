/**
 * Curated widget-ask questions per feature. Keyed by feature title.
 *
 *   main  → single "learn about this" question
 *   pills → two targeted follow-ups (rendered as chip buttons on each card)
 */

export interface FeatureQuestionSet {
  main: string;
  pills: [string, string];
}

export const FEATURE_QUESTIONS: Record<string, FeatureQuestionSet> = {
  "HIPAA-Aware Healthcare Agents": {
    main: "How do HIPAA-aware healthcare agents fit my practice?",
    pills: [
      "Can it integrate with Epic or Athenahealth?",
      "Is it HIPAA compliant out of the box?",
    ],
  },
  "Multi-Channel Voice Access": {
    main: "How does multi-channel voice access work for my team?",
    pills: [
      "Can the same agent handle SMS and WhatsApp?",
      "How does it route callers between channels?",
    ],
  },
  "Smart Escalation": {
    main: "How does Smart Escalation hand off callers to my team?",
    pills: [
      "What happens if no one on my team picks up?",
      "Does it brief my agents before the call connects?",
    ],
  },
  "Knowledge Base RAG": {
    main: "How does Knowledge Base RAG work with my documentation?",
    pills: [
      "Can it use my existing help docs and FAQs?",
      "How do you keep hallucinations down?",
    ],
  },
  "Real-Time Analytics": {
    main: "What does Real-Time Analytics show me about my crew?",
    pills: [
      "Can I export reports for my stakeholders?",
      "What metrics are tracked out of the box?",
    ],
  },
  "Enterprise Security": {
    main: "What security certifications and controls does AutoCrew offer?",
    pills: [
      "Is data residency available in the EU?",
      "Do you support SSO and SCIM?",
    ],
  },
};

/** Safe lookup — falls back to a generic question if the feature is unknown. */
export function questionsFor(title: string): FeatureQuestionSet {
  return (
    FEATURE_QUESTIONS[title] ?? {
      main: `Tell me more about ${title}.`,
      pills: [
        `How does ${title} work?`,
        `Is ${title} right for my business?`,
      ],
    }
  );
}

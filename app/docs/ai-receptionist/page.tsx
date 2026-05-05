import type { Metadata } from "next";
import Link from "next/link";
import { DocNavigation } from "@/components/docs/doc-navigation";
import { DocsBreadcrumbSchema } from "@/components/seo/docs-breadcrumb-schema";
import {
  aiReceptionistRolloutSteps,
  aiReceptionistFaqItems,
} from "@/lib/mock-data/ai-receptionist-data";

export const metadata: Metadata = {
  title: "AI Receptionist",
  description:
    "Set up Autocrew's AI receptionist (Sarah): voice coverage, knowledge-grounded answers, smart escalation, and HIPAA-aware deployment options.",
  alternates: {
    canonical: "/docs/ai-receptionist",
  },
};

const SETUP_FAQ_QUESTIONS = new Set([
  "How does escalation work?",
  "What integrations are supported?",
  "Is this suitable for HIPAA-regulated organizations?",
  "How fast can we go live?",
]);

const rolloutDescriptions: Record<string, string> = {
  "Map your calls":
    "Review your peak call times, top inbound intents, and any compliance constraints. Together we define what Sarah handles end-to-end versus what routes to your team.",
  "Connect knowledge & tools":
    "Load your FAQs, policies, and calendars into the knowledge base, then connect telephony plus the systems you want Sarah to read from or write back to.",
  "Pilot with guardrails":
    "Launch with a bounded scope, monitor handoffs and call outcomes, and tune prompts and routing rules before opening the doors to wider traffic.",
  "Scale & optimize":
    "Use analytics on volumes, handoffs, and outcomes to expand languages, locations, or intents — without losing the escalation paths your staff trusts.",
};

export default function AiReceptionistDocsPage() {
  const setupFaqs = aiReceptionistFaqItems.filter((item) =>
    SETUP_FAQ_QUESTIONS.has(item.question),
  );

  return (
    <div>
      <DocsBreadcrumbSchema
        currentPath="/docs/ai-receptionist"
        currentTitle="AI Receptionist"
      />
      <h1
        id="ai-receptionist"
        className="mb-4 text-4xl font-bold text-foreground"
      >
        AI Receptionist
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Sarah is Autocrew&rsquo;s AI receptionist — she handles routine
        inbound calls 24/7, books appointments, answers from your knowledge
        base, and hands off to your team with full context when it matters.
      </p>

      <h2
        id="what-it-does"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        What It Does
      </h2>
      <p className="mb-4 text-muted-foreground">
        Sarah picks up inbound calls on your business number with a calm,
        branded greeting. She detects caller intent in natural language —
        appointment scheduling, FAQ lookups, message taking, hours and
        directions — and resolves the call in one of three ways:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Answer directly</strong> using your knowledge base when the
          question matches your FAQs and policies.
        </li>
        <li>
          <strong>Take action</strong> in connected systems — book a slot on
          your calendar, capture lead details, or trigger a workflow.
        </li>
        <li>
          <strong>Escalate to a human</strong> with a structured summary when
          the request needs judgment, empathy, or sits outside her playbook.
        </li>
      </ul>

      <h2
        id="key-capabilities"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Key Capabilities
      </h2>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>24/7 availability:</strong> Answer peaks, after-hours, and
          overflow calls without burning out the front desk.
        </li>
        <li>
          <strong>Natural voice conversations:</strong> Real-time voice with
          barge-in support — callers can interrupt mid-response.
        </li>
        <li>
          <strong>Knowledge-grounded answers:</strong> Responses pull from
          your indexed FAQs, policies, and content (RAG) to keep replies
          on-script.
        </li>
        <li>
          <strong>Calendar &amp; CRM integration:</strong> Book, reschedule,
          and capture details directly in the systems you already use.
        </li>
        <li>
          <strong>Smart escalation:</strong> Warm transfer with conversation
          summary attached — no &ldquo;start over&rdquo; for the caller.
        </li>
        <li>
          <strong>HIPAA-aware option:</strong> Healthcare deployments can run
          configurations and BAAs designed around HIPAA expectations.
        </li>
      </ul>

      <h2
        id="personas"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Personas &amp; Customization
      </h2>
      <p className="mb-4 text-muted-foreground">
        Sarah&rsquo;s persona — name, voice, tone, greeting, and
        industry-specific language — is configured in the Autocrew dashboard
        before deployment. Persona selection is a prerequisite for the
        rollout steps below: your team picks a baseline persona for each
        location or line, then layers in your scripts and escalation rules.
      </p>
      <p className="mb-8 text-muted-foreground">
        See the{" "}
        <Link
          href="/ai-receptionist"
          className="text-primary underline-offset-4 hover:underline"
        >
          AI Receptionist marketing page
        </Link>{" "}
        for persona examples by industry, including healthcare, legal,
        coaching, and restaurant.
      </p>

      <h2
        id="getting-started"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Getting Started
      </h2>
      <p className="mb-6 text-muted-foreground">
        Sarah ships in four phases. Each phase is bounded so you can validate
        the experience and tune routing before widening traffic.
      </p>
      <ol className="mb-8 space-y-6">
        {aiReceptionistRolloutSteps.map((step) => (
          <li key={step.number} className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-sm font-semibold text-primary">
              {step.number}
            </div>
            <div>
              <h3 className="mb-1 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-muted-foreground">
                {rolloutDescriptions[step.title] ?? step.description}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <h2 id="faq" className="mb-4 text-2xl font-semibold text-foreground">
        Frequently Asked Questions
      </h2>
      <dl className="mb-8 space-y-6">
        {setupFaqs.map((item) => (
          <div key={item.question}>
            <dt className="mb-2 text-lg font-semibold text-foreground">
              {item.question}
            </dt>
            <dd className="text-muted-foreground">{item.answer}</dd>
          </div>
        ))}
      </dl>

      <DocNavigation />
    </div>
  );
}

import { APP_CONFIG } from "@/lib/constants";

export const dynamic = "force-static";
export const revalidate = false;

export function GET() {
  const baseUrl = APP_CONFIG.url;
  const body = `# ${APP_CONFIG.name}

> ${APP_CONFIG.description}. Autocrew deploys AI voice and chat crews that answer every call, book appointments, qualify leads, and check records — with Smart Escalation to a human when needed. HIPAA-aware, live in days.

## Product

- [AI Receptionist](${baseUrl}/ai-receptionist): Inbound voice agent that answers, schedules, looks up records, and bridges to a human with full context.
- [Widget](${baseUrl}/widget): Five trigger surfaces (button, link, page, intent, intent-with-data) that turn any site into a live conversation — no forms.
- [Documentation](${baseUrl}/docs): Setup, crew configuration, integrations, and operational guides.

## Industries

- [Healthcare](${baseUrl}/industry/healthcare): HIPAA-aware patient intake, scheduling, and EHR-grounded answers.
- [Legal](${baseUrl}/industry/legal): Privilege-respecting intake, conflicts checks, and routine client communication for firms, legal ops, and legal aid.
- [Coaching](${baseUrl}/industry/coaching): Discovery-call handling, intake, scheduling, payments, and follow-ups across Calendly, Stripe, Notion, Slack.
- [Restaurant](${baseUrl}/industry/restaurant): Reservations, takeout, and overflow-call coverage.

## Resources

- [About Autocrew](${baseUrl}/about)
- [FAQ](${baseUrl}/docs/faq)
- [Getting Started](${baseUrl}/docs/getting-started)
- [Privacy Policy](${baseUrl}/docs/privacy)
- [Security](${baseUrl}/docs/security)
- [Compliance](${baseUrl}/docs/compliance)
- [Terms of Service](${baseUrl}/docs/terms)

## Full content

- [llms-full.txt](${baseUrl}/llms-full.txt): Full marketing-site corpus authored for AI agents (brand voice, product overview, per-industry detail).

## Contact

- Email: ${APP_CONFIG.supportEmail}
- Phone: ${APP_CONFIG.supportPhoneDisplay} (${APP_CONFIG.supportPhoneHours})
- Contact form: ${baseUrl}/contact
- App: https://app.autocrew-ai.com
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}

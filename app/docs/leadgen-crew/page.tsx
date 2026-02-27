import type { Metadata } from "next"
import { DocNavigation } from "@/components/docs/doc-navigation"
import { CodeBlock } from "@/components/docs/code-block"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lightbulb } from "lucide-react"

export const metadata: Metadata = {
  title: "LeadGen Crew",
  description:
    "Intelligent lead generation and qualification. Identify prospects, qualify leads, and accelerate your sales pipeline.",
}

export default function LeadGenCrewPage() {
  return (
    <div>
      <h1 id="leadgen-crew" className="mb-4 text-4xl font-bold text-foreground">
        LeadGen Crew
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Intelligent lead generation and qualification powered by AI. Identify
        potential customers, qualify leads, and accelerate your sales pipeline.
      </p>

      <h2 id="overview" className="mb-4 text-2xl font-semibold text-foreground">
        Overview
      </h2>
      <p className="mb-4 text-muted-foreground">
        LeadGen Crew is an AI-powered system that monitors your customer interactions
        to identify potential leads, qualify them based on your criteria, and
        seamlessly integrate them into your sales process.
      </p>
      <p className="mb-8 text-muted-foreground">
        By automating lead identification and qualification, LeadGen Crew ensures
        your sales team focuses on the highest-quality opportunities while never
        missing a potential customer.
      </p>

      <h2 id="key-features" className="mb-4 text-2xl font-semibold text-foreground">
        Key Features
      </h2>

      <h3 id="lead-identification" className="mb-3 text-xl font-semibold text-foreground">
        Intelligent Lead Identification
      </h3>
      <p className="mb-4 text-muted-foreground">
        LeadGen Crew analyzes conversations to detect buying signals and potential
        leads:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Intent detection from natural language conversations</li>
        <li>Identification of pain points and business needs</li>
        <li>Recognition of budget and timeline signals</li>
        <li>Detection of decision-maker indicators</li>
      </ul>

      <h3 id="lead-qualification" className="mb-3 text-xl font-semibold text-foreground">
        Automated Lead Qualification
      </h3>
      <p className="mb-4 text-muted-foreground">
        Score and qualify leads based on customizable criteria:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>BANT qualification (Budget, Authority, Need, Timeline)</li>
        <li>Custom scoring models based on your business</li>
        <li>Fit scoring for ideal customer profile matching</li>
        <li>Engagement level assessment</li>
      </ul>

      <h3 id="data-enrichment" className="mb-3 text-xl font-semibold text-foreground">
        Lead Data Enrichment
      </h3>
      <p className="mb-8 text-muted-foreground">
        Automatically collect and enrich lead information:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Contact details extraction (email, phone, company)</li>
        <li>Company information and industry classification</li>
        <li>Social media profiles and professional information</li>
      </ul>

      <h2 id="configuration" className="mb-4 text-2xl font-semibold text-foreground">
        Configuration
      </h2>

      <h3 id="qualification-criteria" className="mb-3 text-xl font-semibold text-foreground">
        Qualification Criteria
      </h3>
      <p className="mb-4 text-muted-foreground">
        Define what makes a qualified lead for your business:
      </p>
      <CodeBlock
        code={`Lead Qualification Settings:

Minimum Score: 70/100

Scoring Factors:
- Company Size: 10-500 employees (+20 points)
- Budget Mentioned: Yes (+25 points)
- Decision Maker: Yes (+30 points)
- Timeline: Within 3 months (+15 points)
- Pain Point Match: High (+10 points)

Required Fields:
- Email address (mandatory)
- Company name (mandatory)
- Contact name (recommended)`}
        language="text"
        className="mb-6"
      />

      <h3 id="lead-routing" className="mb-3 text-xl font-semibold text-foreground">
        Lead Routing Rules
      </h3>
      <p className="mb-4 text-muted-foreground">
        Automatically route qualified leads to the right sales team members:
      </p>
      <CodeBlock
        code={`Routing Rule: Enterprise Leads
Conditions:
- Company Size > 500 employees
- Budget > $50,000/year
- Score >= 85

Action: Assign to Enterprise Sales Team
Notify: sales-enterprise@company.com
Priority: High

---

Routing Rule: SMB Leads
Conditions:
- Company Size: 10-500 employees
- Score >= 70

Action: Assign to SMB Sales Team
Notify: sales-smb@company.com
Priority: Medium`}
        language="text"
        className="mb-8"
      />

      <h2 id="lead-scoring" className="mb-4 text-2xl font-semibold text-foreground">
        Lead Scoring System
      </h2>
      <p className="mb-4 text-muted-foreground">
        LeadGen Crew uses a comprehensive scoring model out of the box:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Fit Score (40 points):</strong> Match to ideal customer profile
        </li>
        <li>
          <strong>Intent Score (30 points):</strong> Strength of buying signals
        </li>
        <li>
          <strong>Engagement Score (20 points):</strong> Interaction level
        </li>
        <li>
          <strong>Timing Score (10 points):</strong> Urgency indicators
        </li>
      </ul>

      <h2 id="integrations" className="mb-4 text-2xl font-semibold text-foreground">
        Integrations
      </h2>

      <h3 id="crm-integration" className="mb-3 text-xl font-semibold text-foreground">
        CRM Integration
      </h3>
      <p className="mb-4 text-muted-foreground">
        Seamlessly sync leads to your CRM system (Salesforce, HubSpot, Pipedrive).
      </p>

      <h3 id="notification-setup" className="mb-3 text-xl font-semibold text-foreground">
        Notification Setup
      </h3>
      <p className="mb-4 text-muted-foreground">
        Configure real-time notifications for new qualified leads via Email, Slack, or Webhooks.
      </p>

      <h2 id="analytics" className="mb-4 text-2xl font-semibold text-foreground">
        Analytics & Reporting
      </h2>
      <p className="mb-4 text-muted-foreground">
        Track key metrics: Lead Volume, Qualification Rate, Average Lead Score, Conversion Rate.
      </p>

      <h2 id="best-practices" className="mb-4 text-2xl font-semibold text-foreground">
        Best Practices
      </h2>
      <Alert className="mb-6">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>Tip:</strong> Start with a lower qualification threshold and
          gradually increase it based on sales team feedback.
        </AlertDescription>
      </Alert>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Align with Sales:</strong> Define criteria together
        </li>
        <li>
          <strong>Regular Reviews:</strong> Optimize scoring weekly
        </li>
        <li>
          <strong>Speed to Lead:</strong> Instant notifications for high-priority leads
        </li>
      </ul>

      <DocNavigation />
    </div>
  )
}

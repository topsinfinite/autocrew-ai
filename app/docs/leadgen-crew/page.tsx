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
      <p className="mb-4 text-muted-foreground">
        Automatically collect and enrich lead information:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Contact details extraction (email, phone, company)</li>
        <li>Company information and industry classification</li>
        <li>Social media profiles and professional information</li>
        <li>Technology stack and tool usage insights</li>
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

      <h3 id="default-scoring" className="mb-3 text-xl font-semibold text-foreground">
        Default Scoring Model
      </h3>
      <p className="mb-4 text-muted-foreground">
        LeadGen Crew uses a comprehensive scoring model out of the box:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Fit Score (40 points):</strong> How well the lead matches your
          ideal customer profile
        </li>
        <li>
          <strong>Intent Score (30 points):</strong> Strength of buying signals and
          intent indicators
        </li>
        <li>
          <strong>Engagement Score (20 points):</strong> Level of interaction and
          responsiveness
        </li>
        <li>
          <strong>Timing Score (10 points):</strong> Urgency and timeline indicators
        </li>
      </ul>

      <h3 id="custom-scoring" className="mb-3 text-xl font-semibold text-foreground">
        Custom Scoring Models
      </h3>
      <p className="mb-4 text-muted-foreground">
        Create custom scoring models tailored to your specific needs:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Define custom scoring factors and weights</li>
        <li>Set minimum thresholds for each factor</li>
        <li>Create multiple scoring models for different products/services</li>
        <li>A/B test different scoring approaches</li>
      </ul>

      <h2 id="integrations" className="mb-4 text-2xl font-semibold text-foreground">
        Integrations
      </h2>

      <h3 id="crm-integration" className="mb-3 text-xl font-semibold text-foreground">
        CRM Integration
      </h3>
      <p className="mb-4 text-muted-foreground">
        Seamlessly sync leads to your CRM system:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Salesforce - Automatic lead creation and updates</li>
        <li>HubSpot - Contact and deal synchronization</li>
        <li>Pipedrive - Lead and organization management</li>
        <li>Custom CRM - API integration via webhooks</li>
      </ul>

      <h3 id="notification-setup" className="mb-3 text-xl font-semibold text-foreground">
        Notification Setup
      </h3>
      <p className="mb-4 text-muted-foreground">
        Configure real-time notifications for new qualified leads:
      </p>
      <CodeBlock
        code={`Notification Settings:

Email Notifications:
- High-priority leads: Immediate
- Medium-priority leads: Daily digest
- Low-priority leads: Weekly digest

Slack Integration:
- Channel: #sales-leads
- Message Format: Detailed (includes score breakdown)
- Frequency: Real-time for scores >= 80

Webhook:
- URL: https://your-app.com/api/leads
- Method: POST
- Headers: { "Authorization": "Bearer YOUR_TOKEN" }
- Payload: Full lead object with score and metadata`}
        language="text"
        className="mb-8"
      />

      <h2 id="analytics" className="mb-4 text-2xl font-semibold text-foreground">
        Analytics & Reporting
      </h2>

      <h3 id="lead-metrics" className="mb-3 text-xl font-semibold text-foreground">
        Key Lead Metrics
      </h3>
      <p className="mb-4 text-muted-foreground">
        Track the performance of your lead generation efforts:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Lead Volume:</strong> Number of leads identified per period
        </li>
        <li>
          <strong>Qualification Rate:</strong> % of identified leads that meet
          qualification criteria
        </li>
        <li>
          <strong>Average Lead Score:</strong> Mean score of all qualified leads
        </li>
        <li>
          <strong>Conversion Rate:</strong> % of leads that convert to opportunities
        </li>
        <li>
          <strong>Time to Qualification:</strong> Average time from first contact to
          qualification
        </li>
      </ul>

      <h3 id="source-attribution" className="mb-3 text-xl font-semibold text-foreground">
        Source Attribution
      </h3>
      <p className="mb-6 text-muted-foreground">
        Understand where your best leads are coming from:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Lead source breakdown (website, email, chat, social, etc.)</li>
        <li>Channel performance comparison</li>
        <li>Score distribution by source</li>
        <li>ROI analysis per acquisition channel</li>
      </ul>

      <h2 id="best-practices" className="mb-4 text-2xl font-semibold text-foreground">
        Best Practices
      </h2>

      <Alert className="mb-6">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>Tip:</strong> Start with a lower qualification threshold and
          gradually increase it based on sales team feedback. This helps you avoid
          missing potential opportunities while you fine-tune your criteria.
        </AlertDescription>
      </Alert>

      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Align with Sales:</strong> Work with your sales team to define
          qualification criteria that match their ideal leads
        </li>
        <li>
          <strong>Regular Reviews:</strong> Review lead quality and scoring accuracy
          weekly to optimize performance
        </li>
        <li>
          <strong>Feedback Loop:</strong> Collect feedback from sales on lead
          quality to refine scoring models
        </li>
        <li>
          <strong>Segment Leads:</strong> Create different qualification criteria
          for different products or customer segments
        </li>
        <li>
          <strong>Speed to Lead:</strong> Set up instant notifications for
          high-priority leads to maximize conversion
        </li>
        <li>
          <strong>Data Hygiene:</strong> Regularly clean and deduplicate lead data
          to maintain accuracy
        </li>
      </ul>

      <h2 id="common-use-cases" className="mb-4 text-2xl font-semibold text-foreground">
        Common Use Cases
      </h2>

      <h3 id="inbound-qualification" className="mb-3 text-xl font-semibold text-foreground">
        Inbound Lead Qualification
      </h3>
      <p className="mb-4 text-muted-foreground">
        Automatically qualify inbound inquiries from your website, marketing
        campaigns, and content downloads.
      </p>

      <h3 id="trial-conversion" className="mb-3 text-xl font-semibold text-foreground">
        Trial User Conversion
      </h3>
      <p className="mb-4 text-muted-foreground">
        Identify and prioritize trial users showing strong buying signals for sales
        team outreach.
      </p>

      <h3 id="event-followup" className="mb-3 text-xl font-semibold text-foreground">
        Event Follow-up
      </h3>
      <p className="mb-4 text-muted-foreground">
        Score and qualify leads from conferences, webinars, and other events based
        on engagement and fit.
      </p>

      <h3 id="account-expansion" className="mb-3 text-xl font-semibold text-foreground">
        Account Expansion
      </h3>
      <p className="mb-8 text-muted-foreground">
        Detect upsell and cross-sell opportunities within existing customer
        conversations.
      </p>

      <h2 id="lead-lifecycle" className="mb-4 text-2xl font-semibold text-foreground">
        Lead Lifecycle Management
      </h2>

      <h3 id="lead-stages" className="mb-3 text-xl font-semibold text-foreground">
        Lead Stages
      </h3>
      <p className="mb-4 text-muted-foreground">
        LeadGen Crew tracks leads through the following stages:
      </p>
      <ol className="mb-8 list-decimal space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Identified:</strong> Lead detected in conversation
        </li>
        <li>
          <strong>Qualifying:</strong> Information being gathered and scored
        </li>
        <li>
          <strong>Qualified:</strong> Met qualification criteria, ready for sales
        </li>
        <li>
          <strong>Contacted:</strong> Sales team has engaged with the lead
        </li>
        <li>
          <strong>Converted:</strong> Lead became an opportunity or customer
        </li>
        <li>
          <strong>Disqualified:</strong> Did not meet criteria or not interested
        </li>
      </ol>

      <DocNavigation />
    </div>
  )
}

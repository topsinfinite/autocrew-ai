import { DocNavigation } from "@/components/docs/doc-navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export default function UserGuidePage() {
  return (
    <div>
      <h1 id="user-guide" className="mb-4 text-4xl font-bold text-foreground">
        User Guide
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Complete guide to using AutoCrew's features and capabilities. Learn how to
        maximize the value of your AI crews and streamline your business operations.
      </p>

      <h2 id="dashboard-overview" className="mb-4 text-2xl font-semibold text-foreground">
        Dashboard Overview
      </h2>
      <p className="mb-4 text-muted-foreground">
        Your AutoCrew dashboard provides a comprehensive view of your AI crew
        performance and activities. The main sections include:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Overview Cards:</strong> Quick stats showing active crews, total
          conversations, leads generated, and response time
        </li>
        <li>
          <strong>Recent Activity:</strong> Latest conversations and crew actions
        </li>
        <li>
          <strong>Performance Metrics:</strong> Charts displaying trends over time
        </li>
        <li>
          <strong>Quick Actions:</strong> Shortcuts to create crews, view
          conversations, and manage leads
        </li>
      </ul>

      <h2 id="managing-crews" className="mb-4 text-2xl font-semibold text-foreground">
        Managing Crews
      </h2>
      <p className="mb-4 text-muted-foreground">
        The Crews section lets you create, configure, and monitor your AI crews.
      </p>

      <h3 id="creating-crews" className="mb-3 text-xl font-semibold text-foreground">
        Creating Crews
      </h3>
      <p className="mb-4 text-muted-foreground">
        To create a new crew, navigate to the Crews page and click "Create New Crew".
        You'll need to specify:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Crew name and description</li>
        <li>Crew type (Support or LeadGen)</li>
        <li>Configuration settings specific to the crew type</li>
        <li>Integration channels and endpoints</li>
      </ul>

      <h3 id="configuring-crews" className="mb-3 text-xl font-semibold text-foreground">
        Configuring Crews
      </h3>
      <p className="mb-4 text-muted-foreground">
        Each crew can be customized to match your specific business needs:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Adjust response tone and communication style</li>
        <li>Set business hours and availability windows</li>
        <li>Configure escalation rules and triggers</li>
        <li>Define custom keywords and triggers</li>
        <li>Set up integrations with your existing tools</li>
      </ul>

      <h3 id="monitoring-performance" className="mb-3 text-xl font-semibold text-foreground">
        Monitoring Performance
      </h3>
      <p className="mb-6 text-muted-foreground">
        Track your crew's performance with detailed metrics including response times,
        conversation volumes, customer satisfaction scores, and more.
      </p>

      <h2 id="conversations" className="mb-4 text-2xl font-semibold text-foreground">
        Conversations
      </h2>
      <p className="mb-4 text-muted-foreground">
        The Conversations section displays all interactions handled by your crews.
      </p>

      <h3 id="viewing-conversations" className="mb-3 text-xl font-semibold text-foreground">
        Viewing Conversations
      </h3>
      <p className="mb-4 text-muted-foreground">
        Each conversation entry shows:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Customer information and contact details</li>
        <li>Full conversation history with timestamps</li>
        <li>Assigned crew and handling status</li>
        <li>Sentiment analysis and satisfaction score</li>
        <li>Any escalations or manual interventions</li>
      </ul>

      <h3 id="filtering-conversations" className="mb-3 text-xl font-semibold text-foreground">
        Filtering and Search
      </h3>
      <p className="mb-6 text-muted-foreground">
        Use the filter options to find specific conversations by date range, crew,
        status, sentiment, or keyword search.
      </p>

      <h2 id="analytics" className="mb-4 text-2xl font-semibold text-foreground">
        Analytics
      </h2>
      <p className="mb-4 text-muted-foreground">
        The Analytics page provides in-depth insights into your crew performance and
        customer interactions.
      </p>

      <h3 id="key-metrics" className="mb-3 text-xl font-semibold text-foreground">
        Key Metrics
      </h3>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Response Time:</strong> Average time for crews to respond to
          inquiries
        </li>
        <li>
          <strong>Resolution Rate:</strong> Percentage of issues resolved without
          escalation
        </li>
        <li>
          <strong>Customer Satisfaction:</strong> Overall satisfaction scores from
          interactions
        </li>
        <li>
          <strong>Lead Conversion:</strong> Percentage of leads that convert to
          opportunities
        </li>
        <li>
          <strong>Volume Trends:</strong> Conversation and lead volume over time
        </li>
      </ul>

      <h3 id="reports" className="mb-3 text-xl font-semibold text-foreground">
        Reports
      </h3>
      <p className="mb-6 text-muted-foreground">
        Generate custom reports to share with your team or export for further
        analysis. Reports can be scheduled for automatic delivery.
      </p>

      <h2 id="settings" className="mb-4 text-2xl font-semibold text-foreground">
        Settings
      </h2>
      <p className="mb-4 text-muted-foreground">
        Manage your account settings, user permissions, and integrations from the
        Settings page.
      </p>

      <h3 id="account-settings" className="mb-3 text-xl font-semibold text-foreground">
        Account Settings
      </h3>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Update company information and profile</li>
        <li>Manage billing and subscription plans</li>
        <li>Configure notification preferences</li>
        <li>Set up two-factor authentication</li>
      </ul>

      <h3 id="user-management" className="mb-3 text-xl font-semibold text-foreground">
        User Management
      </h3>
      <p className="mb-6 text-muted-foreground">
        Invite team members, assign roles, and manage user permissions. Different
        roles have different levels of access to features and data.
      </p>

      <h3 id="integrations" className="mb-3 text-xl font-semibold text-foreground">
        Integrations
      </h3>
      <p className="mb-4 text-muted-foreground">
        Connect AutoCrew with your existing tools and platforms:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Email platforms (Gmail, Outlook, etc.)</li>
        <li>Live chat systems (Intercom, Zendesk, etc.)</li>
        <li>CRM systems (Salesforce, HubSpot, etc.)</li>
        <li>Messaging platforms (Slack, Microsoft Teams, etc.)</li>
        <li>Custom webhooks and API integrations</li>
      </ul>

      <h2 id="best-practices" className="mb-4 text-2xl font-semibold text-foreground">
        Best Practices
      </h2>

      <h3 id="crew-optimization" className="mb-3 text-xl font-semibold text-foreground">
        Crew Optimization
      </h3>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Regularly review and update crew configurations based on performance</li>
        <li>Monitor conversation sentiment to identify areas for improvement</li>
        <li>Use A/B testing to optimize response templates and triggers</li>
        <li>Keep escalation rules up-to-date with current business processes</li>
      </ul>

      <h3 id="data-quality" className="mb-3 text-xl font-semibold text-foreground">
        Data Quality
      </h3>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Ensure lead qualification criteria align with your sales process</li>
        <li>Regularly audit conversation data for accuracy</li>
        <li>Keep customer information synchronized across integrations</li>
        <li>Archive old conversations to maintain system performance</li>
      </ul>

      <h3 id="security" className="mb-3 text-xl font-semibold text-foreground">
        Security
      </h3>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Enable two-factor authentication for all users</li>
        <li>Regularly review user access and permissions</li>
        <li>Use strong, unique passwords</li>
        <li>Monitor audit logs for suspicious activity</li>
      </ul>

      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertDescription>
          For more specific guidance on Support Crew and LeadGen Crew features,
          refer to their dedicated documentation pages.
        </AlertDescription>
      </Alert>

      <DocNavigation />
    </div>
  )
}

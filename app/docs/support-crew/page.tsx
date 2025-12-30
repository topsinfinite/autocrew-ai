import { DocNavigation } from "@/components/docs/doc-navigation"
import { CodeBlock } from "@/components/docs/code-block"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lightbulb } from "lucide-react"

export default function SupportCrewPage() {
  return (
    <div>
      <h1 id="support-crew" className="mb-4 text-4xl font-bold text-foreground">
        Support Crew
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        AI-powered customer support that works 24/7 to handle inquiries, resolve
        issues, and provide exceptional customer experiences.
      </p>

      <h2 id="overview" className="mb-4 text-2xl font-semibold text-foreground">
        Overview
      </h2>
      <p className="mb-4 text-muted-foreground">
        Support Crew is an intelligent AI system designed to handle customer support
        inquiries automatically. It understands customer questions, provides accurate
        responses, and escalates complex issues to human agents when needed.
      </p>
      <p className="mb-8 text-muted-foreground">
        By automating routine support tasks, Support Crew frees up your team to focus
        on high-value interactions while ensuring customers receive fast, consistent
        support around the clock.
      </p>

      <h2 id="key-features" className="mb-4 text-2xl font-semibold text-foreground">
        Key Features
      </h2>

      <h3 id="intelligent-responses" className="mb-3 text-xl font-semibold text-foreground">
        Intelligent Response Generation
      </h3>
      <p className="mb-4 text-muted-foreground">
        Support Crew uses advanced AI to understand customer inquiries and generate
        appropriate responses:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Natural language understanding of customer questions</li>
        <li>Context-aware responses based on conversation history</li>
        <li>Multi-language support for global customers</li>
        <li>Tone adaptation to match your brand voice</li>
      </ul>

      <h3 id="auto-escalation" className="mb-3 text-xl font-semibold text-foreground">
        Smart Escalation
      </h3>
      <p className="mb-4 text-muted-foreground">
        Configure escalation rules to ensure complex issues reach human agents:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Keyword-based escalation triggers</li>
        <li>Sentiment analysis for frustrated customers</li>
        <li>Complexity detection for technical issues</li>
        <li>Manual escalation request handling</li>
      </ul>

      <h3 id="multi-channel" className="mb-3 text-xl font-semibold text-foreground">
        Multi-Channel Support
      </h3>
      <p className="mb-4 text-muted-foreground">
        Handle customer inquiries across all your communication channels:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Email support inbox integration</li>
        <li>Live chat widget for your website</li>
        <li>Social media monitoring and responses</li>
        <li>Messaging app integrations (Slack, WhatsApp, etc.)</li>
      </ul>

      <h2 id="configuration" className="mb-4 text-2xl font-semibold text-foreground">
        Configuration
      </h2>

      <h3 id="basic-settings" className="mb-3 text-xl font-semibold text-foreground">
        Basic Settings
      </h3>
      <p className="mb-4 text-muted-foreground">
        Configure the fundamental behavior of your Support Crew:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Crew Name:</strong> A descriptive name for your support crew
        </li>
        <li>
          <strong>Response Tone:</strong> Choose from Professional, Friendly, or
          Technical
        </li>
        <li>
          <strong>Operating Hours:</strong> Define when the crew is active
        </li>
        <li>
          <strong>Default Language:</strong> Primary language for responses
        </li>
      </ul>

      <h3 id="response-templates" className="mb-3 text-xl font-semibold text-foreground">
        Response Templates
      </h3>
      <p className="mb-4 text-muted-foreground">
        Create templates for common support scenarios to ensure consistent responses:
      </p>
      <CodeBlock
        code={`Template: Product Information Request
Trigger Keywords: "pricing", "features", "plans"
Response:
"Thank you for your interest in [Product Name]!
We offer three plans to suit different needs:
- Starter: $29/month
- Professional: $99/month
- Enterprise: Custom pricing

Would you like to know more about a specific plan?"`}
        language="text"
        className="mb-6"
      />

      <h3 id="escalation-rules" className="mb-3 text-xl font-semibold text-foreground">
        Escalation Rules
      </h3>
      <p className="mb-4 text-muted-foreground">
        Define when and how conversations should be escalated to human agents:
      </p>
      <CodeBlock
        code={`Escalation Rule: Technical Issues
Triggers:
- Keywords: "bug", "error", "not working", "broken"
- Sentiment: Negative (score < 0.3)
- Complexity: High confidence < 0.7

Action: Assign to Technical Support Team
Priority: High`}
        language="text"
        className="mb-8"
      />

      <h2 id="integrations" className="mb-4 text-2xl font-semibold text-foreground">
        Integrations
      </h2>

      <h3 id="email-integration" className="mb-3 text-xl font-semibold text-foreground">
        Email Integration
      </h3>
      <p className="mb-4 text-muted-foreground">
        Connect your support email to let Support Crew handle incoming messages:
      </p>
      <ol className="mb-6 list-decimal space-y-2 pl-6 text-muted-foreground">
        <li>Navigate to Settings → Integrations → Email</li>
        <li>Click "Connect Email Account"</li>
        <li>Authorize AutoCrew to access your inbox</li>
        <li>Configure filtering rules for which emails to handle</li>
        <li>Set up signature and reply-to settings</li>
      </ol>

      <h3 id="chat-widget" className="mb-3 text-xl font-semibold text-foreground">
        Chat Widget Integration
      </h3>
      <p className="mb-4 text-muted-foreground">
        Add a live chat widget to your website:
      </p>
      <CodeBlock
        code={`<!-- Add this code to your website before </body> -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://autocrew.ai/widget.js';
    script.setAttribute('data-crew-id', 'YOUR_CREW_ID');
    document.body.appendChild(script);
  })();
</script>`}
        language="html"
        className="mb-8"
      />

      <h2 id="analytics" className="mb-4 text-2xl font-semibold text-foreground">
        Analytics & Monitoring
      </h2>

      <h3 id="performance-metrics" className="mb-3 text-xl font-semibold text-foreground">
        Performance Metrics
      </h3>
      <p className="mb-4 text-muted-foreground">
        Track key metrics to measure your Support Crew's effectiveness:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Response Time:</strong> Average time to first response
        </li>
        <li>
          <strong>Resolution Rate:</strong> % of inquiries resolved without
          escalation
        </li>
        <li>
          <strong>Customer Satisfaction:</strong> Average satisfaction score
        </li>
        <li>
          <strong>Volume Handled:</strong> Number of conversations per day/week/month
        </li>
        <li>
          <strong>Escalation Rate:</strong> % of conversations escalated to humans
        </li>
      </ul>

      <h3 id="conversation-insights" className="mb-3 text-xl font-semibold text-foreground">
        Conversation Insights
      </h3>
      <p className="mb-6 text-muted-foreground">
        Gain insights from customer interactions to improve your support:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Common questions and topics</li>
        <li>Sentiment trends over time</li>
        <li>Peak support hours and volume patterns</li>
        <li>Customer pain points and feature requests</li>
      </ul>

      <h2 id="best-practices" className="mb-4 text-2xl font-semibold text-foreground">
        Best Practices
      </h2>

      <Alert className="mb-6">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>Tip:</strong> Start with conservative escalation rules and adjust
          based on performance. It's better to escalate too often initially than to
          risk poor customer experiences.
        </AlertDescription>
      </Alert>

      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Review Conversations Regularly:</strong> Check escalated
          conversations to identify improvement opportunities
        </li>
        <li>
          <strong>Update Templates:</strong> Keep response templates current with
          product changes and new features
        </li>
        <li>
          <strong>Monitor Sentiment:</strong> Track customer sentiment trends to
          catch issues early
        </li>
        <li>
          <strong>Test Changes:</strong> Use test conversations to validate
          configuration changes before going live
        </li>
        <li>
          <strong>Collect Feedback:</strong> Ask customers to rate their support
          experience
        </li>
      </ul>

      <h2 id="common-use-cases" className="mb-4 text-2xl font-semibold text-foreground">
        Common Use Cases
      </h2>

      <h3 id="faq-automation" className="mb-3 text-xl font-semibold text-foreground">
        FAQ Automation
      </h3>
      <p className="mb-4 text-muted-foreground">
        Automatically answer frequently asked questions about your product, pricing,
        features, and policies.
      </p>

      <h3 id="order-status" className="mb-3 text-xl font-semibold text-foreground">
        Order Status Inquiries
      </h3>
      <p className="mb-4 text-muted-foreground">
        Handle order tracking requests by integrating with your order management
        system to provide real-time updates.
      </p>

      <h3 id="technical-triage" className="mb-3 text-xl font-semibold text-foreground">
        Technical Issue Triage
      </h3>
      <p className="mb-4 text-muted-foreground">
        Collect initial information about technical issues and route them to the
        appropriate support tier.
      </p>

      <h3 id="after-hours" className="mb-3 text-xl font-semibold text-foreground">
        After-Hours Support
      </h3>
      <p className="mb-8 text-muted-foreground">
        Provide immediate responses to customer inquiries outside business hours,
        with option to escalate urgent issues.
      </p>

      <DocNavigation />
    </div>
  )
}

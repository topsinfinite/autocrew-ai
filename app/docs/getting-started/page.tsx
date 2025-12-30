import { Alert, AlertDescription } from "@/components/ui/alert"
import { CodeBlock } from "@/components/docs/code-block"
import { DocNavigation } from "@/components/docs/doc-navigation"
import { CheckCircle, Info } from "lucide-react"

export default function GettingStartedPage() {
  return (
    <div>
      <h1 id="getting-started" className="mb-4 text-4xl font-bold text-foreground">
        Getting Started
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Get up and running with AutoCrew in just a few minutes. This guide will walk
        you through setting up your account and creating your first AI crew.
      </p>

      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertDescription>
          This is a UI demonstration using mock data. No actual account creation or
          backend integration is required.
        </AlertDescription>
      </Alert>

      <h2 id="step-1-create-account" className="mb-4 text-2xl font-semibold text-foreground">
        Step 1: Create Your Account
      </h2>
      <p className="mb-4 text-muted-foreground">
        Visit the AutoCrew homepage and click the "Get Started Free" button. You'll be
        guided through a simple signup process.
      </p>
      <div className="mb-8 space-y-2">
        <div className="flex items-start gap-2">
          <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
          <p className="text-muted-foreground">
            Enter your business email and company name
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
          <p className="text-muted-foreground">Choose your plan (Starter, Professional, or Enterprise)</p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
          <p className="text-muted-foreground">Verify your email address</p>
        </div>
      </div>

      <h2 id="step-2-access-dashboard" className="mb-4 text-2xl font-semibold text-foreground">
        Step 2: Access Your Dashboard
      </h2>
      <p className="mb-4 text-muted-foreground">
        Once your account is created, you'll be redirected to your personalized
        dashboard. Here you can:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>View your crew performance metrics</li>
        <li>Manage conversations and leads</li>
        <li>Configure crew settings</li>
        <li>Access analytics and reports</li>
      </ul>

      <h2 id="step-3-create-crew" className="mb-4 text-2xl font-semibold text-foreground">
        Step 3: Create Your First Crew
      </h2>
      <p className="mb-4 text-muted-foreground">
        Navigate to the Crews section and click "Create New Crew". You'll need to:
      </p>
      <ol className="mb-4 list-decimal space-y-2 pl-6 text-muted-foreground">
        <li>Choose your crew type (Support Crew or LeadGen Crew)</li>
        <li>Give your crew a descriptive name</li>
        <li>Configure the crew's behavior and response style</li>
        <li>Set up integration channels (email, chat, etc.)</li>
      </ol>

      <h2 id="step-4-configure-settings" className="mb-4 text-2xl font-semibold text-foreground">
        Step 4: Configure Crew Settings
      </h2>
      <p className="mb-4 text-muted-foreground">
        Customize your crew's behavior to match your business needs:
      </p>
      <div className="mb-8">
        <h3 className="mb-2 text-lg font-semibold text-foreground">Support Crew Settings</h3>
        <ul className="mb-4 list-disc space-y-1 pl-6 text-muted-foreground">
          <li>Response tone (Professional, Friendly, Technical)</li>
          <li>Auto-response triggers and keywords</li>
          <li>Escalation rules for complex issues</li>
          <li>Business hours and availability</li>
        </ul>

        <h3 className="mb-2 text-lg font-semibold text-foreground">LeadGen Crew Settings</h3>
        <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
          <li>Lead qualification criteria</li>
          <li>Scoring thresholds</li>
          <li>CRM integration settings</li>
          <li>Notification preferences</li>
        </ul>
      </div>

      <h2 id="step-5-test-crew" className="mb-4 text-2xl font-semibold text-foreground">
        Step 5: Test Your Crew
      </h2>
      <p className="mb-4 text-muted-foreground">
        Before going live, test your crew to ensure it behaves as expected:
      </p>
      <CodeBlock
        code={`# Test a support conversation
1. Navigate to the Conversations section
2. Click "New Test Conversation"
3. Send sample customer inquiries
4. Review crew responses and adjust settings as needed`}
        language="text"
        className="mb-8"
      />

      <h2 id="step-6-go-live" className="mb-4 text-2xl font-semibold text-foreground">
        Step 6: Go Live
      </h2>
      <p className="mb-4 text-muted-foreground">
        Once you're satisfied with your crew's configuration, activate it to start
        handling real conversations:
      </p>
      <div className="mb-8 space-y-2">
        <div className="flex items-start gap-2">
          <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
          <p className="text-muted-foreground">
            Review all settings one final time
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
          <p className="text-muted-foreground">
            Click the "Activate Crew" button
          </p>
        </div>
        <div className="flex items-start gap-2">
          <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
          <p className="text-muted-foreground">
            Monitor performance in the Analytics dashboard
          </p>
        </div>
      </div>

      <h2 id="next-steps" className="mb-4 text-2xl font-semibold text-foreground">
        Next Steps
      </h2>
      <p className="mb-4 text-muted-foreground">
        Now that your crew is active, explore these resources:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Read the complete User Guide for advanced features</li>
        <li>Learn about Support Crew capabilities in detail</li>
        <li>Discover how LeadGen Crew can boost your sales</li>
        <li>Check the FAQ for common questions and tips</li>
      </ul>

      <Alert className="mb-8">
        <Info className="h-4 w-4" />
        <AlertDescription>
          Need help? Our support team is available 24/7 to assist you with any
          questions or issues you may encounter.
        </AlertDescription>
      </Alert>

      <DocNavigation />
    </div>
  )
}

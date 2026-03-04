import type { Metadata } from "next"
import { DocNavigation } from "@/components/docs/doc-navigation"
import { CodeBlock } from "@/components/docs/code-block"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lightbulb } from "lucide-react"
import { DocsBreadcrumbSchema } from "@/components/seo/docs-breadcrumb-schema"

export const metadata: Metadata = {
  title: "Support Crew",
  description:
    "AI-powered customer support that works 24/7. Handle inquiries, resolve issues, escalate when needed. Learn how it works.",
  alternates: {
    canonical: "/docs/support-crew",
  },
}

export default function SupportCrewPage() {
  return (
    <div>
      <DocsBreadcrumbSchema currentPath="/docs/support-crew" currentTitle="Support Crew" />
      <h1 id="support-crew" className="mb-4 text-4xl font-bold text-foreground">
        Support Crew
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        AI-powered customer support accessible via phone calls and web voice widgets
        — with knowledge base search, smart escalation, and conversation memory.
      </p>

      <h2 id="overview" className="mb-4 text-2xl font-semibold text-foreground">
        Overview
      </h2>
      <p className="mb-4 text-muted-foreground">
        The Support Crew provides intelligent AI voice agents for customer support.
        Customers can call your business phone number or interact through a web
        voice widget embedded on your website. The agent searches your knowledge
        base to answer questions accurately and escalates to human teams when
        needed.
      </p>
      <p className="mb-8 text-muted-foreground">
        By combining voice AI with knowledge base retrieval and smart escalation,
        Support Crew delivers fast, accurate support around the clock while keeping
        your human team focused on high-value interactions.
      </p>

      <h2 id="multi-channel" className="mb-4 text-2xl font-semibold text-foreground">
        Multi-Channel Access
      </h2>
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-2 font-semibold">Phone Calls</h3>
          <p className="text-sm text-muted-foreground">
            Customers call your business phone number and interact with the AI voice
            agent through natural conversation. The telephony bridge handles
            real-time audio streaming.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h3 className="mb-2 font-semibold">Web Voice Widget</h3>
          <p className="text-sm text-muted-foreground">
            Embed a voice widget on your website. Customers click to talk and get
            immediate voice support through their browser — no app download needed.
          </p>
        </div>
      </div>

      <h2 id="key-features" className="mb-4 text-2xl font-semibold text-foreground">
        Key Features
      </h2>

      <h3 id="knowledge-base" className="mb-3 text-xl font-semibold text-foreground">
        Knowledge Base RAG
      </h3>
      <p className="mb-4 text-muted-foreground">
        The Support Crew uses Retrieval-Augmented Generation (RAG) to search your
        knowledge base and provide accurate answers:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Documents indexed with vector embeddings for semantic search</li>
        <li>Configurable top-K results and similarity threshold</li>
        <li>Supports multiple document formats (PDF, text, web content)</li>
        <li>AI synthesizes information into natural responses</li>
      </ul>

      <h3 id="smart-escalation" className="mb-3 text-xl font-semibold text-foreground">
        Smart Escalation
      </h3>
      <p className="mb-4 text-muted-foreground">
        When the agent cannot answer a question or when a customer requests human
        assistance, the system escalates with full context:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Email notifications sent to the configured escalation address</li>
        <li>Urgency levels based on conversation context</li>
        <li>Full conversation summary included for seamless handoff</li>
        <li>Session correlation for follow-up tracking</li>
      </ul>

      <h3 id="conversation-memory" className="mb-3 text-xl font-semibold text-foreground">
        Conversation Memory
      </h3>
      <p className="mb-8 text-muted-foreground">
        The agent maintains conversation context throughout the interaction,
        allowing for follow-up questions and seamless continuity.
      </p>

      <h2 id="how-it-works" className="mb-4 text-2xl font-semibold text-foreground">
        How It Works
      </h2>
      <CodeBlock
        code={`Customer asks a question (phone or widget)
    │
    ▼
AI agent receives the question
    │
    ▼
Knowledge base search (vector similarity)
    │
    ├── Relevant results found
    │       │
    │       ▼
    │   AI synthesizes response
    │       │
    │       ▼
    │   Customer receives answer
    │
    └── No results / Complex issue
            │
            ▼
        Smart escalation triggered
            │
            ▼
        Email sent with context`}
        language="text"
        className="mb-8"
      />

      <h2 id="configuration" className="mb-4 text-2xl font-semibold text-foreground">
        Configuration
      </h2>

      <h3 id="crew-settings" className="mb-3 text-xl font-semibold text-foreground">
        Crew Settings
      </h3>
      <p className="mb-4 text-muted-foreground">
        Configure the fundamental behavior of your Support Crew:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Crew Name:</strong> A descriptive name for your support crew
        </li>
        <li>
          <strong>Agent Name:</strong> The name the AI agent uses to introduce
          itself
        </li>
        <li>
          <strong>System Prompt:</strong> Custom instructions that guide the agent's
          behavior
        </li>
      </ul>

      <h3 id="kb-setup" className="mb-3 text-xl font-semibold text-foreground">
        Knowledge Base Setup
      </h3>
      <p className="mb-4 text-muted-foreground">
        Upload documents to build the agent's knowledge base. Documents are
        automatically indexed with vector embeddings for semantic search.
      </p>

      <h3 id="escalation-config" className="mb-3 text-xl font-semibold text-foreground">
        Escalation Configuration
      </h3>
      <p className="mb-8 text-muted-foreground">
        Set up escalation to route complex issues to your human team via email
        notifications with full context.
      </p>

      <h2 id="integration" className="mb-4 text-2xl font-semibold text-foreground">
        Integration
      </h2>

      <h3 id="voice-widget" className="mb-3 text-xl font-semibold text-foreground">
        Voice Widget Integration
      </h3>
      <p className="mb-4 text-muted-foreground">
        Embed the voice widget on your website to give customers instant voice
        support:
      </p>
      <CodeBlock
        code={`<!-- Add this code to your website before </body> -->
<script
  src="https://your-autocrew-domain/widget.js"
  data-crew-id="YOUR_CREW_ID"
  data-mode="voice"
></script>`}
        language="html"
        className="mb-6"
      />

      <h3 id="phone-integration" className="mb-3 text-xl font-semibold text-foreground">
        Phone Integration
      </h3>
      <p className="mb-8 text-muted-foreground">
        Connect a business phone number to let customers call and interact with the
        AI agent. The telephony bridge automatically routes incoming calls.
      </p>

      <h2 id="analytics" className="mb-4 text-2xl font-semibold text-foreground">
        Analytics & Monitoring
      </h2>
      <p className="mb-4 text-muted-foreground">
        Track key metrics to measure your Support Crew's effectiveness:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Conversation Volume:</strong> Total interactions
        </li>
        <li>
          <strong>Resolution Rate:</strong> Inquiries resolved without escalation
        </li>
        <li>
          <strong>Escalation Rate:</strong> Percentage escalated to humans
        </li>
        <li>
          <strong>Response Quality:</strong> AI confidence scores
        </li>
      </ul>

      <h2 id="best-practices" className="mb-4 text-2xl font-semibold text-foreground">
        Best Practices
      </h2>
      <Alert className="mb-6">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>Tip:</strong> Start with a focused knowledge base covering your
          most common support questions, then expand based on escalation patterns.
        </AlertDescription>
      </Alert>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Curate Your KB:</strong> Quality over quantity for better AI
          responses
        </li>
        <li>
          <strong>Review Escalations:</strong> Identify gaps in your knowledge base
        </li>
        <li>
          <strong>Customize Prompt:</strong> Define the agent's personality and
          boundaries
        </li>
        <li>
          <strong>Test Before Launch:</strong> Validate responses with test
          conversations
        </li>
      </ul>

      <DocNavigation />
    </div>
  )
}

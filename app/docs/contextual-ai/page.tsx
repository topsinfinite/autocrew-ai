import type { Metadata } from "next";
import Link from "next/link";
import { DocNavigation } from "@/components/docs/doc-navigation";
import { CodeBlock } from "@/components/docs/code-block";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { DocsBreadcrumbSchema } from "@/components/seo/docs-breadcrumb-schema";

export const metadata: Metadata = {
  title: "Contextual AI",
  description:
    "Configure the Contextual AI highlight-to-chat feature: enable or disable globally, per-session, or per-visitor, and opt elements out with a single attribute.",
  alternates: {
    canonical: "/docs/contextual-ai",
  },
};

const GLOBAL_DISABLE = `# .env.production or Vercel project settings
NEXT_PUBLIC_CONTEXTUAL_AI_ENABLED=false`;

const SESSION_DISABLE = `# Append to any URL
https://yoursite.com/pricing?contextual-ai=off

# Re-enable for the current navigation
https://yoursite.com/pricing?contextual-ai=on`;

const VISITOR_DISABLE = `// Run in the browser console (or trigger from an in-page setting)
localStorage.setItem('contextual-ai:disabled', '1');

// Re-enable
localStorage.removeItem('contextual-ai:disabled');`;

const ELEMENT_OPT_OUT = `<!-- Selections inside this element are ignored -->
<section data-contextual-ai="off">
  <h2>Pricing tiers</h2>
  <p>Highlighting text here will not show the popover.</p>
</section>`;

const ADAPTER_SNIPPET = `// Composed by lib/contextual-ai/adapter.ts on submit
window.AutoCrew.ask(message, { autoSend: true, mode: "chat" });`;

export default function ContextualAiDocsPage() {
  return (
    <div>
      <DocsBreadcrumbSchema
        currentPath="/docs/contextual-ai"
        currentTitle="Contextual AI"
      />
      <h1
        id="contextual-ai"
        className="mb-4 text-4xl font-bold text-foreground"
      >
        Contextual AI (Highlight-to-Chat)
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Turn any highlighted text on a page into a live AutoCrew conversation.
        Visitors select text, optionally type a follow-up, and the widget opens
        with the composed message already submitted.
      </p>

      <h2 id="overview" className="mb-4 text-2xl font-semibold text-foreground">
        Overview
      </h2>
      <p className="mb-4 text-muted-foreground">
        When a visitor highlights at least 15 characters of text on a page, a
        small popover appears near the selection. The visitor can optionally
        type a follow-up question and click <strong>Ask Sarah →</strong>. The
        widget opens with a single message containing both the quoted
        selection and their question, then Sarah answers.
      </p>
      <p className="mb-4 text-muted-foreground">
        The feature is intentionally suppressed in contexts where it would
        interfere with normal use:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Touch-primary devices (mobile and tablets)</li>
        <li>
          Inside code blocks, navigation elements, buttons, and links
        </li>
        <li>Selections shorter than 15 characters</li>
      </ul>

      <h2
        id="prerequisites"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Prerequisites
      </h2>
      <Alert className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          The AutoCrew widget must be embedded on the page first. Contextual
          AI calls{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            window.AutoCrew.ask()
          </code>{" "}
          internally — without the widget, the popover cannot dispatch
          messages.
        </AlertDescription>
      </Alert>
      <p className="mb-8 text-muted-foreground">
        Follow the{" "}
        <Link
          href="/docs/widget"
          className="text-primary underline-offset-4 hover:underline"
        >
          Embeddable Widget setup guide
        </Link>{" "}
        to add the embed snippet, then Contextual AI activates automatically
        on every page where the widget is loaded.
      </p>

      <h2
        id="enable-disable"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Enabling &amp; Disabling
      </h2>
      <p className="mb-6 text-muted-foreground">
        Three controls operate at different scopes — each overrides the one
        below it. URL overrides win, then per-visitor opt-outs, then the
        global env flag.
      </p>

      <h3
        id="global-disable"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        Global (env var)
      </h3>
      <p className="mb-3 text-muted-foreground">
        Set the build-time environment variable to disable Contextual AI for
        every visitor. The feature is on by default when the variable is
        unset.
      </p>
      <CodeBlock code={GLOBAL_DISABLE} language="bash" className="mb-3" />
      <Alert className="mb-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Changing this variable requires a production
          redeploy — it&rsquo;s baked in at build time, not read at runtime.
        </AlertDescription>
      </Alert>

      <h3
        id="session-disable"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        Per-session (URL parameter)
      </h3>
      <p className="mb-3 text-muted-foreground">
        Append <code className="rounded bg-muted px-1 py-0.5 text-xs">
          ?contextual-ai=off
        </code>{" "}
        (or{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">
          =on
        </code>
        ) to any URL. The override applies for the current navigation and
        resets when the visitor leaves the URL.
      </p>
      <CodeBlock code={SESSION_DISABLE} language="text" className="mb-8" />

      <h3
        id="visitor-disable"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        Per-visitor (localStorage)
      </h3>
      <p className="mb-3 text-muted-foreground">
        Disable Contextual AI for a single visitor across all sessions on this
        domain. Useful for in-product settings or accessibility preferences.
      </p>
      <CodeBlock code={VISITOR_DISABLE} language="javascript" className="mb-8" />

      <h2
        id="opting-out-elements"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Opting Elements Out
      </h2>
      <p className="mb-4 text-muted-foreground">
        Stamp{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          data-contextual-ai=&quot;off&quot;
        </code>{" "}
        on any HTML element. Selections that originate inside that element
        are ignored — useful for code samples, sensitive content, or anywhere
        the popover would be disruptive.
      </p>
      <CodeBlock code={ELEMENT_OPT_OUT} language="html" className="mb-8" />

      <h2
        id="javascript-api"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        JavaScript API
      </h2>
      <p className="mb-4 text-muted-foreground">
        On submit, the popover composes a message containing the section
        label, the quoted selection, and the visitor&rsquo;s prompt, then
        calls the widget API:
      </p>
      <CodeBlock code={ADAPTER_SNIPPET} language="javascript" className="mb-4" />
      <p className="mb-8 text-muted-foreground">
        See{" "}
        <Link
          href="/docs/widget#javascript-api"
          className="text-primary underline-offset-4 hover:underline"
        >
          Widget &middot; JavaScript API
        </Link>{" "}
        for the full method reference, including options like{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">mode</code> and{" "}
        <code className="rounded bg-muted px-1 py-0.5 text-xs">autoSend</code>.
      </p>

      <DocNavigation />
    </div>
  );
}

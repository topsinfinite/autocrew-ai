import type { Metadata } from "next";
import { DocNavigation } from "@/components/docs/doc-navigation";
import { CodeBlock } from "@/components/docs/code-block";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb } from "lucide-react";
import { DocsBreadcrumbSchema } from "@/components/seo/docs-breadcrumb-schema";

export const metadata: Metadata = {
  title: "Embeddable Widget",
  description:
    "Embed the AutoCrew widget on any site in three lines. Configure trigger surfaces, the JavaScript API, voice mode, and the pre-init queue.",
  alternates: {
    canonical: "/docs/widget",
  },
};

const EMBED_SNIPPET = `<!-- 1. Tell the widget which crew to load -->
<script>
  window.AutoCrewConfig = { crewCode: "YOUR-CREW-CODE" };
</script>

<!-- 2. Drop in the widget -->
<script src="https://app.autocrew-ai.com/widget.js" async></script>`;

const QUEUE_STUB = `<!-- Optional: buffer pre-init AutoCrew.ask() calls -->
<script>
  window.AutoCrew = window.AutoCrew || {
    q: [],
    ask: function () { (this.q = this.q || []).push(["ask", arguments]); },
    open: function () { (this.q = this.q || []).push(["open", arguments]); },
    close: function () { (this.q = this.q || []).push(["close", arguments]); },
    onReady: function () { (this.q = this.q || []).push(["onReady", arguments]); }
  };
</script>`;

const DECLARATIVE_SNIPPET = `<button data-autocrew-question="What are your hours?">
  See our hours
</button>`;

const URL_SNIPPET = `https://yoursite.com/?autocrew_q=Show%20me%20a%20demo&utm_source=email`;

const JS_API_SNIPPET = `// Wire to any in-page event
window.AutoCrew.ask("Help me with my account");

// Or check ready state first
window.AutoCrew.onReady(() => {
  console.log("widget v" + window.AutoCrew.version);
});`;

const SEARCH_ELEMENT_SNIPPET = `<autocrew-search
  placeholder="Search docs…"
  button-label="Ask"
  primary-color="#FF6B35"
></autocrew-search>`;

const VOICE_SNIPPET = `<button data-autocrew-open data-autocrew-mode="voice">
  Start a voice call
</button>`;

const VOICE_API_SNIPPET = `window.AutoCrew.ask("Tell me about pricing", { mode: "voice" });`;

export default function WidgetDocsPage() {
  return (
    <div>
      <DocsBreadcrumbSchema
        currentPath="/docs/widget"
        currentTitle="Embeddable Widget"
      />
      <h1
        id="embeddable-widget"
        className="mb-4 text-4xl font-bold text-foreground"
      >
        Embeddable Widget
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        Embed the AutoCrew widget on any website to turn pages, buttons, and
        links into live conversations with your AI crew. No forms, no SDK
        install, no build step.
      </p>

      <h2
        id="quick-start"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Quick Start
      </h2>
      <p className="mb-4 text-muted-foreground">
        Paste this snippet anywhere in your page&rsquo;s HTML. Replace{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          YOUR-CREW-CODE
        </code>{" "}
        with the crew code from your Autocrew dashboard. The widget loads
        async, picks up its config, and attaches the trigger listeners
        automatically.
      </p>
      <CodeBlock code={EMBED_SNIPPET} language="html" className="mb-8" />

      <h2
        id="trigger-surfaces"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Trigger Surfaces
      </h2>
      <p className="mb-6 text-muted-foreground">
        The widget exposes five ways to start a conversation. The same agent
        answers every one — pick the surfaces that match your existing site
        patterns.
      </p>

      <h3
        id="trigger-declarative"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        1. Declarative
      </h3>
      <p className="mb-3 text-muted-foreground">
        Add{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          data-autocrew-question
        </code>{" "}
        to any{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          &lt;button&gt;
        </code>{" "}
        or{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          &lt;a&gt;
        </code>
        . Click handlers bubble through nested elements; links don&rsquo;t
        navigate away when intercepted.
      </p>
      <CodeBlock code={DECLARATIVE_SNIPPET} language="html" className="mb-3" />
      <p className="mb-6 text-sm text-muted-foreground">
        <strong>Best for:</strong> FAQ pages, pricing-tier CTAs, footer
        quick-links — turn dead ends into conversations without writing
        JavaScript.
      </p>

      <h3
        id="trigger-url"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        2. URL Parameter
      </h3>
      <p className="mb-3 text-muted-foreground">
        Append{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          ?autocrew_q=&hellip;
        </code>{" "}
        to any URL. The widget opens on landing, sends the question, and
        strips the param so a refresh doesn&rsquo;t re-fire. Pair with UTM
        tags for full campaign attribution.
      </p>
      <CodeBlock code={URL_SNIPPET} language="text" className="mb-3" />
      <p className="mb-6 text-sm text-muted-foreground">
        <strong>Best for:</strong> Email campaigns, paid-ad landing URLs, and
        chatbot handoffs from other apps.
      </p>

      <h3
        id="trigger-js-api"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        3. JavaScript API
      </h3>
      <p className="mb-3 text-muted-foreground">
        Call{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          window.AutoCrew.ask()
        </code>{" "}
        from any in-page event. See the full method reference below.
      </p>
      <CodeBlock code={JS_API_SNIPPET} language="javascript" className="mb-3" />
      <p className="mb-6 text-sm text-muted-foreground">
        <strong>Best for:</strong> Post-form-submit handoff with prefilled
        context, idle-detection recovery, scroll-depth or exit-intent
        triggers.
      </p>

      <h3
        id="trigger-search-element"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        4. Search Element
      </h3>
      <p className="mb-3 text-muted-foreground">
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          &lt;autocrew-search&gt;
        </code>{" "}
        is a custom element with closed shadow DOM — no CSS conflicts, no host
        access to internals. Configure with{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          placeholder
        </code>
        ,{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          button-label
        </code>
        ,{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          primary-color
        </code>
        ,{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">mode</code>,
        and{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          auto-send
        </code>
        .
      </p>
      <CodeBlock
        code={SEARCH_ELEMENT_SNIPPET}
        language="html"
        className="mb-3"
      />
      <p className="mb-6 text-sm text-muted-foreground">
        <strong>Best for:</strong> Help-center search box, hero
        &ldquo;Ask&rdquo; CTAs, docs-site search replacement.
      </p>

      <h3
        id="trigger-voice"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        5. Voice Mode
      </h3>
      <p className="mb-3 text-muted-foreground">
        Add{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          data-autocrew-mode=&quot;voice&quot;
        </code>{" "}
        to any trigger. Falls back to chat if voice is disabled. Six visible
        states (Connecting / Listening / Thinking / Speaking / Muted / Error)
        with barge-in support.
      </p>
      <CodeBlock code={VOICE_SNIPPET} language="html" className="mb-3" />
      <p className="mb-8 text-sm text-muted-foreground">
        <strong>Best for:</strong> Mobile CTAs, healthcare intake/triage,
        hands-free contexts (warehouse, drive-through, kitchen).
      </p>

      <h2
        id="javascript-api"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        JavaScript API
      </h2>
      <p className="mb-4 text-muted-foreground">
        Five methods are exposed on{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          window.AutoCrew
        </code>{" "}
        once the widget loads:
      </p>
      <div className="mb-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Method</th>
              <th className="px-4 py-2 text-left font-semibold">Purpose</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-4 py-3 font-mono text-xs">
                .ask(message, options?)
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Open the widget and send a message. Options include{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  mode
                </code>{" "}
                (&quot;chat&quot; or &quot;voice&quot;) and{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  autoSend
                </code>
                .
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-xs">.open()</td>
              <td className="px-4 py-3 text-muted-foreground">
                Open the widget without sending a message.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-xs">.close()</td>
              <td className="px-4 py-3 text-muted-foreground">
                Close the widget if it&rsquo;s open.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-xs">.isReady()</td>
              <td className="px-4 py-3 text-muted-foreground">
                Synchronous boolean. Returns{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  undefined
                </code>{" "}
                (not{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  false
                </code>
                ) before{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  widget.js
                </code>{" "}
                loads — use{" "}
                <code className="rounded bg-muted px-1 py-0.5 text-xs">
                  .onReady()
                </code>{" "}
                for pre-init code.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-xs">
                .onReady(callback)
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                Run a callback once the widget is ready. Safe to call before
                the script loads when paired with the queue stub.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Alert className="mb-8">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>Tip:</strong> Calls to{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">.ask()</code>,{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">.open()</code>
          ,{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">.close()</code>
          , and{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            .onReady()
          </code>{" "}
          made before the script loads are buffered safely if the queue stub is
          present (see below).
        </AlertDescription>
      </Alert>

      <h2
        id="pre-init-queue"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Pre-Init Queue
      </h2>
      <p className="mb-4 text-muted-foreground">
        If you call{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          AutoCrew.ask()
        </code>{" "}
        before{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          widget.js
        </code>{" "}
        finishes loading, drop in this GA-style queue stub to buffer and
        replay calls. The widget drains the queue on init.
      </p>
      <CodeBlock code={QUEUE_STUB} language="html" className="mb-8" />

      <h2
        id="voice-vs-chat"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Voice vs Chat
      </h2>
      <p className="mb-4 text-muted-foreground">
        The widget supports two modes — chat (the default) and voice. Set the
        mode declaratively or programmatically:
      </p>
      <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Declarative:</strong> add{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            data-autocrew-mode=&quot;voice&quot;
          </code>{" "}
          (or{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            &quot;chat&quot;
          </code>
          ) to any trigger element.
        </li>
        <li>
          <strong>Programmatic:</strong> pass{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            { '{ mode: "voice" }' }
          </code>{" "}
          as the second argument to{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">.ask()</code>.
        </li>
      </ul>
      <CodeBlock code={VOICE_API_SNIPPET} language="javascript" className="mb-4" />
      <p className="mb-8 text-muted-foreground">
        Voice mode falls back to chat automatically if voice has been disabled
        in your dashboard or the visitor&rsquo;s browser blocks microphone
        access.
      </p>

      <h2
        id="configuration"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Configuration Reference
      </h2>
      <p className="mb-4 text-muted-foreground">
        The embed snippet exposes a single embed-time config key on{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-sm">
          window.AutoCrewConfig
        </code>
        :
      </p>
      <div className="mb-6 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">Key</th>
              <th className="px-4 py-2 text-left font-semibold">Type</th>
              <th className="px-4 py-2 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="px-4 py-3 font-mono text-xs">crewCode</td>
              <td className="px-4 py-3 font-mono text-xs">string</td>
              <td className="px-4 py-3 text-muted-foreground">
                Identifies which crew to load. Required. Find this in the
                Autocrew dashboard under your crew settings.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="mb-8 text-muted-foreground">
        All other settings — theme, position, suggested actions, voice
        availability, welcome message — are managed in the Autocrew dashboard
        and applied automatically when the widget loads. You don&rsquo;t need
        to specify them at embed time.
      </p>

      <DocNavigation />
    </div>
  );
}

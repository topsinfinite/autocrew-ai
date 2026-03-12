import type { Metadata } from "next";
import { DocNavigation } from "@/components/docs/doc-navigation";
import { CodeBlock } from "@/components/docs/code-block";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lightbulb, ShieldCheck } from "lucide-react";
import { DocsBreadcrumbSchema } from "@/components/seo/docs-breadcrumb-schema";

export const metadata: Metadata = {
  title: "Healthcare Crew",
  description:
    "HIPAA-aware AI voice agents for healthcare. EHR integration, patient identification, and secure health data management.",
  alternates: {
    canonical: "/docs/healthcare-crew",
  },
};

export default function HealthcareCrewPage() {
  return (
    <div>
      <DocsBreadcrumbSchema
        currentPath="/docs/healthcare-crew"
        currentTitle="Healthcare Crew"
      />
      <h1
        id="healthcare-crew"
        className="mb-4 text-4xl font-bold text-foreground"
      >
        Healthcare Crew
      </h1>
      <p className="mb-8 text-lg text-muted-foreground">
        HIPAA-aware AI voice agents that integrate with your EHR to help
        patients manage their healthcare — accessible via phone calls and web
        voice widgets.
      </p>

      <h2 id="overview" className="mb-4 text-2xl font-semibold text-foreground">
        Overview
      </h2>
      <p className="mb-4 text-muted-foreground">
        The Healthcare Crew provides AI-powered voice agents designed
        specifically for healthcare providers. Patients can call your practice
        phone number or use the web voice widget to check appointments,
        medications, refill status, and more — all through natural conversation.
      </p>
      <p className="mb-8 text-muted-foreground">
        The system integrates directly with your Electronic Health Record (EHR)
        via the FHIR standard, enabling real-time access to patient data. All
        interactions are logged with HIPAA-compliant audit trails, and sensitive
        data is encrypted at rest using AES-256-GCM.
      </p>

      <h2
        id="hipaa-compliance"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        HIPAA Compliance
      </h2>
      <p className="mb-4 text-muted-foreground">
        <strong>Security First:</strong> AutoCrew implements comprehensive
        HIPAA-aware safeguards across every layer of the healthcare workflow.
      </p>

      <div className="mb-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <ShieldCheck className="mb-2 h-6 w-6 text-green-500" />
          <h3 className="mb-2 font-semibold">Encryption at Rest</h3>
          <p className="text-sm text-muted-foreground">
            All sensitive data — including private keys, access tokens, and
            patient context tokens — is encrypted using AES-256-GCM before
            storage.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <ShieldCheck className="mb-2 h-6 w-6 text-green-500" />
          <h3 className="mb-2 font-semibold">No PHI in Logs</h3>
          <p className="text-sm text-muted-foreground">
            Application logs never contain Protected Health Information. Only
            safe identifiers are logged. Raw health data is sanitized.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <ShieldCheck className="mb-2 h-6 w-6 text-green-500" />
          <h3 className="mb-2 font-semibold">FHIR Audit Trail</h3>
          <p className="text-sm text-muted-foreground">
            Every health data access is logged in a comprehensive, immutable
            audit trail available for compliance review.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <ShieldCheck className="mb-2 h-6 w-6 text-green-500" />
          <h3 className="mb-2 font-semibold">Multi-Tenant Isolation</h3>
          <p className="text-sm text-muted-foreground">
            Each healthcare organization's data is fully isolated. Cross-tenant
            data access is strictly prevented.
          </p>
        </div>
      </div>

      <h2
        id="ehr-integration"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        EHR Integration
      </h2>
      <p className="mb-4 text-muted-foreground">
        AutoCrew connects to your EHR using the FHIR R4 standard with SMART
        Backend Services authorization. This enables secure, automated
        system-to-system communication.
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>FHIR R4 Standard:</strong> Industry-standard API for
          healthcare data exchange
        </li>
        <li>
          <strong>SMART Backend Services:</strong> Secure system-to-system
          authorization
        </li>
        <li>
          <strong>Token Caching:</strong> Minimized authentication overhead
        </li>
        <li>
          <strong>JWKS Endpoint:</strong> Verified JWT assertions
        </li>
      </ul>

      <h2
        id="patient-identification"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Patient Identification
      </h2>
      <p className="mb-4 text-muted-foreground">
        Before accessing health data, patients must be identified through
        natural conversation. The system requires two or more identifiers to
        ensure secure matching.
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>MRN:</strong> Unique medical record number
        </li>
        <li>
          <strong>Phone + Date of Birth:</strong> Match using verified phone and
          DOB
        </li>
        <li>
          <strong>Name + Date of Birth:</strong> Match using full name and DOB
        </li>
      </ul>

      <h2
        id="health-capabilities"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Health Data Capabilities
      </h2>
      <p className="mb-4 text-muted-foreground">
        Once identified, patients can ask about a growing range of health data
        categories:
      </p>
      <div className="mb-8 space-y-4">
        <div>
          <h3 className="font-semibold text-foreground">
            Patient Demographics
          </h3>
          <p className="text-muted-foreground">
            Access and verify personal information and contact details.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            Appointment Management
          </h3>
          <p className="text-muted-foreground">
            Check upcoming appointments, scheduling details, and reminders.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">
            Medication Information
          </h3>
          <p className="text-muted-foreground">
            Review active medications, refill status, and dispense history.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Visit History</h3>
          <p className="text-muted-foreground">
            Review past visits, encounter summaries, and care history.
          </p>
        </div>
      </div>

      <h2
        id="configuration"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Configuration
      </h2>
      <p className="mb-4 text-muted-foreground">
        Setting up a Healthcare Crew involves configuring your FHIR tenant
        connection:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>FHIR Tenant Config:</strong> EHR FHIR base URL and client
          credentials
        </li>
        <li>
          <strong>FHIR Scopes:</strong> Access control for specific resources
          (Patient, Appointment, etc.)
        </li>
        <li>
          <strong>Session Expiry:</strong> Configurable patient context duration
          (default 4 hours)
        </li>
        <li>
          <strong>Agent Persona:</strong> Customize the agent name, greeting,
          and tone
        </li>
      </ul>

      <h2
        id="security-architecture"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Security Architecture
      </h2>
      <CodeBlock
        code={`Patient Call/Widget
    │
    ▼
Voice Session JWT (1h expiry)
    │
    ▼
Patient Identification (2+ identifiers)
    │
    ▼
Patient Context JWT (4h expiry)
    │  ── Carries verified identity
    │
    ▼
SMART Backend Services
    │  ── System-to-system auth
    │
    ▼
FHIR R4 API
    │
    ▼
FHIR Audit Log`}
        language="text"
        className="mb-8"
      />

      <h2
        id="best-practices"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Best Practices
      </h2>
      <Alert className="mb-6">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>Tip:</strong> Start with a limited set of FHIR scopes and
          expand as you validate the workflow with your clinical team.
        </AlertDescription>
      </Alert>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Audit Regularly:</strong> Review FHIR audit logs for
          compliance
        </li>
        <li>
          <strong>Keep KB Updated:</strong> Maintain accurate clinic policies in
          the Knowledge Base
        </li>
        <li>
          <strong>Test Identification:</strong> Verify patient matching flows
          with test data
        </li>
        <li>
          <strong>Monitor Escalations:</strong> Track questions the agent cannot
          answer
        </li>
      </ul>

      <DocNavigation />
    </div>
  );
}

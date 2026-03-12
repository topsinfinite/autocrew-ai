import type { Metadata } from "next";
import { DocNavigation } from "@/components/docs/doc-navigation";

export const metadata: Metadata = {
  title: "Compliance",
  description:
    "AutoCrew's compliance with GDPR, CCPA/CPRA, SOC 2, ISO 27001, EU AI Act, and other regulatory frameworks.",
  alternates: { canonical: "/docs/compliance" },
};

export default function CompliancePage() {
  return (
    <div>
      <h1 id="compliance" className="mb-4 text-4xl font-bold text-foreground">
        Compliance
      </h1>
      <p className="mb-2 text-sm text-muted-foreground">
        Last Updated: March 4, 2026
      </p>
      <p className="mb-8 text-lg text-muted-foreground">
        AutoCrew is committed to meeting and exceeding regulatory requirements
        across the jurisdictions we operate in. This page outlines our
        compliance posture and the frameworks we adhere to.
      </p>

      {/* Compliance Overview */}
      <h2
        id="compliance-overview"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Compliance Overview
      </h2>
      <p className="mb-4 text-muted-foreground">
        As an AI-powered platform that processes business data on behalf of our
        customers, we take our regulatory obligations seriously. Our compliance
        program includes:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Continuous monitoring:</strong> Automated compliance
          monitoring tools that track our adherence to regulatory requirements
          in real time
        </li>
        <li>
          <strong>Regular assessments:</strong> Periodic internal audits and
          third-party assessments to validate our compliance posture
        </li>
        <li>
          <strong>Policy governance:</strong> A dedicated compliance team that
          maintains and updates policies as regulations evolve
        </li>
        <li>
          <strong>Transparency:</strong> Clear documentation of our practices so
          customers can assess our suitability for their compliance needs
        </li>
      </ul>

      {/* GDPR */}
      <h2 id="gdpr" className="mb-4 text-2xl font-semibold text-foreground">
        GDPR Compliance
      </h2>
      <p className="mb-4 text-muted-foreground">
        AutoCrew complies with the General Data Protection Regulation (GDPR) for
        all processing of personal data of individuals in the European Economic
        Area (EEA) and United Kingdom.
      </p>

      <h3
        id="gdpr-legal-basis"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        Legal Basis for Processing
      </h3>
      <p className="mb-4 text-muted-foreground">
        We process personal data under the following legal bases:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Contract performance:</strong> Processing necessary to deliver
          the AutoCrew platform and services you have subscribed to
        </li>
        <li>
          <strong>Legitimate interest:</strong> Processing for service
          improvement, security monitoring, and fraud prevention, balanced
          against data subject rights
        </li>
        <li>
          <strong>Consent:</strong> Marketing communications and optional
          analytics, where consent can be withdrawn at any time
        </li>
        <li>
          <strong>Legal obligation:</strong> Processing required to comply with
          applicable laws, such as tax reporting and regulatory requests
        </li>
      </ul>

      <h3
        id="gdpr-rights"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        Data Subject Rights
      </h3>
      <p className="mb-4 text-muted-foreground">
        AutoCrew supports the exercise of all GDPR data subject rights. We
        provide mechanisms for individuals to:
      </p>
      <ul className="mb-6 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>Access their personal data and obtain a copy</li>
        <li>Rectify inaccurate or incomplete personal data</li>
        <li>
          Request erasure of personal data (&quot;right to be forgotten&quot;)
        </li>
        <li>Restrict processing in certain circumstances</li>
        <li>Receive personal data in a portable, machine-readable format</li>
        <li>
          Object to processing based on legitimate interest or direct marketing
        </li>
        <li>
          Not be subject to solely automated decisions with legal or significant
          effects
        </li>
      </ul>
      <p className="mb-6 text-muted-foreground">
        Data subject requests can be submitted to{" "}
        <a
          href="mailto:support@autocrew-ai.com"
          className="text-primary hover:underline"
        >
          support@autocrew-ai.com
        </a>{" "}
        and are processed within 30 days.
      </p>

      <h3
        id="gdpr-by-design"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        Data Protection by Design
      </h3>
      <ul className="mb-6 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>
          Privacy impact assessments conducted for new features and processing
          activities
        </li>
        <li>
          Data minimization principles applied across all data collection points
        </li>
        <li>Pseudonymization capabilities for sensitive data processing</li>
        <li>Default privacy settings that prioritize data protection</li>
      </ul>

      <h3
        id="gdpr-transfers"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        International Transfers
      </h3>
      <p className="mb-8 text-muted-foreground">
        When personal data is transferred outside the EEA, we rely on Standard
        Contractual Clauses (SCCs) approved by the European Commission,
        supplemented by additional technical and organizational measures where
        appropriate. We monitor adequacy decisions and update our transfer
        mechanisms accordingly.
      </p>

      {/* CCPA */}
      <h2 id="ccpa" className="mb-4 text-2xl font-semibold text-foreground">
        CCPA/CPRA Compliance
      </h2>
      <p className="mb-4 text-muted-foreground">
        AutoCrew complies with the California Consumer Privacy Act (CCPA) as
        amended by the California Privacy Rights Act (CPRA) for California
        residents.
      </p>

      <h3
        id="ccpa-categories"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        Categories of Personal Information
      </h3>
      <p className="mb-4 text-muted-foreground">
        We may collect the following categories of personal information:
      </p>
      <ul className="mb-6 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>Identifiers (name, email address, account credentials)</li>
        <li>Commercial information (subscription plans, billing history)</li>
        <li>
          Internet activity (usage logs, feature interactions, IP addresses)
        </li>
        <li>Professional information (company name, job title)</li>
        <li>Inferences drawn from the above to improve our services</li>
      </ul>

      <h3
        id="ccpa-rights"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        Consumer Rights
      </h3>
      <p className="mb-4 text-muted-foreground">
        California residents have the right to:
      </p>
      <ul className="mb-6 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>
          Know what personal information is collected, used, and disclosed
        </li>
        <li>
          Delete personal information held by us and our service providers
        </li>
        <li>Correct inaccurate personal information</li>
        <li>Opt out of the sale or sharing of personal information</li>
        <li>Limit the use of sensitive personal information</li>
        <li>Non-discrimination for exercising their privacy rights</li>
      </ul>

      <h3
        id="ccpa-do-not-sell"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        &quot;Do Not Sell or Share&quot; Commitment
      </h3>
      <p className="mb-4 text-muted-foreground">
        AutoCrew does not sell personal information to third parties. We do not
        share personal information for cross-context behavioral advertising. Our
        data processing is limited to providing and improving our services.
      </p>

      <h3
        id="ccpa-service-provider"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        Service Provider Obligations
      </h3>
      <p className="mb-8 text-muted-foreground">
        When acting as a service provider on behalf of our customers, we process
        personal information only as directed by the customer and in accordance
        with our contractual obligations. We do not retain, use, or disclose
        personal information for purposes other than performing the services
        specified in the agreement.
      </p>

      {/* SOC 2 */}
      <h2 id="soc2" className="mb-4 text-2xl font-semibold text-foreground">
        SOC 2 Framework
      </h2>
      <p className="mb-4 text-muted-foreground">
        AutoCrew&apos;s security controls are aligned with the SOC 2 Trust
        Service Criteria established by the American Institute of Certified
        Public Accountants (AICPA).
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Security:</strong> Protection of systems and data against
          unauthorized access through access controls, encryption, and network
          security
        </li>
        <li>
          <strong>Availability:</strong> System availability maintained through
          redundancy, monitoring, and disaster recovery planning
        </li>
        <li>
          <strong>Processing Integrity:</strong> Data processed accurately,
          completely, and in a timely manner
        </li>
        <li>
          <strong>Confidentiality:</strong> Confidential information protected
          throughout its lifecycle
        </li>
        <li>
          <strong>Privacy:</strong> Personal information collected, used,
          retained, and disclosed in accordance with our privacy commitments
        </li>
      </ul>
      <p className="mb-8 text-muted-foreground">
        Enterprise customers can request our SOC 2 Type II report under NDA by
        contacting{" "}
        <a
          href="mailto:support@autocrew-ai.com"
          className="text-primary hover:underline"
        >
          support@autocrew-ai.com
        </a>
        .
      </p>

      {/* ISO 27001 */}
      <h2 id="iso27001" className="mb-4 text-2xl font-semibold text-foreground">
        ISO 27001 Alignment
      </h2>
      <p className="mb-4 text-muted-foreground">
        AutoCrew&apos;s Information Security Management System (ISMS) is aligned
        with the ISO/IEC 27001 standard:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Risk assessment:</strong> Systematic identification,
          evaluation, and treatment of information security risks
        </li>
        <li>
          <strong>Controls implementation:</strong> Security controls mapped to
          ISO 27001 Annex A covering areas including access control,
          cryptography, operations security, and supplier relationships
        </li>
        <li>
          <strong>Continuous improvement:</strong> Regular management reviews,
          internal audits, and corrective actions to strengthen our security
          posture
        </li>
        <li>
          <strong>Documentation:</strong> Comprehensive policies and procedures
          maintained and reviewed on a regular cycle
        </li>
      </ul>

      {/* AI Regulations */}
      <h2
        id="ai-regulations"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        AI-Specific Regulations
      </h2>

      <h3 id="eu-ai-act" className="mb-3 text-xl font-semibold text-foreground">
        EU AI Act Awareness
      </h3>
      <p className="mb-4 text-muted-foreground">
        AutoCrew monitors developments under the EU AI Act and proactively
        assesses our AI systems against its risk classification framework:
      </p>
      <ul className="mb-6 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>Classification of AI crew capabilities by risk level</li>
        <li>
          Transparency obligations — clear disclosure when users interact with
          AI systems
        </li>
        <li>Human oversight mechanisms for AI-driven decisions</li>
        <li>
          Technical documentation of AI system capabilities and limitations
        </li>
        <li>
          Ongoing monitoring for bias, accuracy, and robustness in AI outputs
        </li>
      </ul>

      <h3
        id="responsible-ai"
        className="mb-3 text-xl font-semibold text-foreground"
      >
        Responsible AI Practices
      </h3>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Bias monitoring:</strong> Regular evaluation of AI models for
          unintended bias across demographic groups and use cases
        </li>
        <li>
          <strong>Fairness assessments:</strong> Testing to ensure AI outputs do
          not disproportionately impact any group
        </li>
        <li>
          <strong>Explainability:</strong> AI decisions can be explained and
          reviewed, with audit trails of AI processing activities
        </li>
        <li>
          <strong>Model governance:</strong> Formal review and approval
          processes for AI model deployment and updates
        </li>
      </ul>

      {/* DPIA */}
      <h2 id="dpia" className="mb-4 text-2xl font-semibold text-foreground">
        Data Protection Impact Assessments
      </h2>
      <p className="mb-4 text-muted-foreground">
        AutoCrew conducts Data Protection Impact Assessments (DPIAs) for
        processing activities that are likely to result in a high risk to
        individuals:
      </p>
      <ul className="mb-8 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>
          DPIAs conducted before deploying new AI features or processing
          activities
        </li>
        <li>
          Assessments cover data flows, risk identification, and mitigation
          measures
        </li>
        <li>
          Regular reviews of existing DPIAs as processing activities evolve
        </li>
        <li>Summary findings available to enterprise customers upon request</li>
      </ul>

      {/* Subprocessors */}
      <h2
        id="subprocessors"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Subprocessor Management
      </h2>
      <p className="mb-4 text-muted-foreground">
        We maintain rigorous oversight of all subprocessors that process data on
        our behalf:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Due diligence:</strong> Security and privacy assessments
          conducted before engaging any new subprocessor
        </li>
        <li>
          <strong>Contractual requirements:</strong> Data Processing Agreements
          (DPAs) executed with all subprocessors, requiring equivalent data
          protection standards
        </li>
        <li>
          <strong>Change notification:</strong> Customers notified at least 30
          days before any material change to subprocessors that handle their
          data
        </li>
        <li>
          <strong>Ongoing monitoring:</strong> Regular reassessment of
          subprocessor compliance and security posture
        </li>
      </ul>

      {/* Certifications */}
      <h2
        id="certifications"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Certifications and Audits
      </h2>
      <p className="mb-4 text-muted-foreground">
        Our current compliance certifications and audit activities include:
      </p>
      <ul className="mb-6 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>SOC 2 Type II:</strong> Annual audit covering all five Trust
          Service Criteria
        </li>
        <li>
          <strong>ISO 27001:</strong> Information security management system
          alignment with planned certification
        </li>
        <li>
          <strong>Penetration testing:</strong> Annual third-party penetration
          testing by independent security firms
        </li>
        <li>
          <strong>Vulnerability assessments:</strong> Continuous automated
          vulnerability scanning across our infrastructure
        </li>
      </ul>
      <p className="mb-8 text-muted-foreground">
        Customers can request copies of audit reports, certifications, and
        security documentation by contacting our compliance team. For more
        information about our technical security controls, see our{" "}
        <a href="/docs/security" className="text-primary hover:underline">
          Security page
        </a>
        .
      </p>

      {/* Contact */}
      <h2
        id="contact-compliance"
        className="mb-4 text-2xl font-semibold text-foreground"
      >
        Contact Us
      </h2>
      <p className="mb-4 text-muted-foreground">
        If you have questions about our compliance practices or need to request
        compliance documentation, please contact us:
      </p>
      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <strong>Compliance Team:</strong> support@autocrew-ai.com
          </li>
          <li>
            <strong>Data Protection Officer:</strong> support@autocrew-ai.com
          </li>
          <li>
            <strong>Address:</strong> AutoCrew Inc., 123 AI Street, San
            Francisco, CA 94105
          </li>
        </ul>
      </div>

      <DocNavigation />
    </div>
  );
}

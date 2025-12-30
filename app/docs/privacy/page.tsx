import { DocNavigation } from "@/components/docs/doc-navigation"

export default function PrivacyPage() {
  return (
    <div>
      <h1 id="privacy-policy" className="mb-4 text-4xl font-bold text-foreground">
        Privacy Policy
      </h1>
      <p className="mb-2 text-sm text-muted-foreground">
        Last Updated: December 29, 2024
      </p>
      <p className="mb-8 text-lg text-muted-foreground">
        This Privacy Policy describes how AutoCrew collects, uses, and protects your
        personal information when you use our services.
      </p>

      <h2 id="information-collection" className="mb-4 text-2xl font-semibold text-foreground">
        Information We Collect
      </h2>
      <p className="mb-4 text-muted-foreground">
        We collect several types of information to provide and improve our services:
      </p>

      <h3 id="account-information" className="mb-3 text-xl font-semibold text-foreground">
        Account Information
      </h3>
      <p className="mb-4 text-muted-foreground">
        When you create an AutoCrew account, we collect:
      </p>
      <ul className="mb-6 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>Full name and email address</li>
        <li>Company name and business information</li>
        <li>Phone number (optional)</li>
        <li>Billing and payment information</li>
      </ul>

      <h3 id="usage-data" className="mb-3 text-xl font-semibold text-foreground">
        Usage Data
      </h3>
      <p className="mb-4 text-muted-foreground">
        We automatically collect information about how you use AutoCrew:
      </p>
      <ul className="mb-6 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>Log data including IP address, browser type, and device information</li>
        <li>Pages visited, features used, and actions taken</li>
        <li>Conversation data processed by AI crews</li>
        <li>Performance metrics and analytics data</li>
      </ul>

      <h3 id="customer-data" className="mb-3 text-xl font-semibold text-foreground">
        Customer Data
      </h3>
      <p className="mb-6 text-muted-foreground">
        When you use AutoCrew to interact with your customers, we process
        conversation data, customer contact information, and related metadata on your
        behalf. You retain ownership of this data.
      </p>

      <h2 id="information-use" className="mb-4 text-2xl font-semibold text-foreground">
        How We Use Your Information
      </h2>
      <p className="mb-4 text-muted-foreground">
        We use collected information for the following purposes:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Service Delivery:</strong> To provide, maintain, and improve
          AutoCrew features and functionality
        </li>
        <li>
          <strong>AI Processing:</strong> To train and improve our AI models for
          better customer support and lead generation
        </li>
        <li>
          <strong>Customer Support:</strong> To respond to your inquiries and provide
          technical assistance
        </li>
        <li>
          <strong>Analytics:</strong> To understand usage patterns and improve our
          services
        </li>
        <li>
          <strong>Communication:</strong> To send service updates, security alerts,
          and marketing communications (with consent)
        </li>
        <li>
          <strong>Security:</strong> To detect and prevent fraud, abuse, and security
          incidents
        </li>
      </ul>

      <h2 id="data-sharing" className="mb-4 text-2xl font-semibold text-foreground">
        Information Sharing and Disclosure
      </h2>
      <p className="mb-4 text-muted-foreground">
        We do not sell your personal information. We may share your information in
        the following circumstances:
      </p>

      <h3 id="service-providers" className="mb-3 text-xl font-semibold text-foreground">
        Service Providers
      </h3>
      <p className="mb-4 text-muted-foreground">
        We work with third-party service providers who assist in delivering our
        services:
      </p>
      <ul className="mb-6 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>Cloud hosting and infrastructure providers</li>
        <li>Payment processors for billing</li>
        <li>Analytics and monitoring tools</li>
        <li>Email delivery services</li>
      </ul>

      <h3 id="legal-requirements" className="mb-3 text-xl font-semibold text-foreground">
        Legal Requirements
      </h3>
      <p className="mb-6 text-muted-foreground">
        We may disclose your information if required by law, court order, or
        government regulation, or if we believe disclosure is necessary to protect
        our rights, your safety, or the safety of others.
      </p>

      <h3 id="business-transfers" className="mb-3 text-xl font-semibold text-foreground">
        Business Transfers
      </h3>
      <p className="mb-8 text-muted-foreground">
        In the event of a merger, acquisition, or sale of assets, your information
        may be transferred to the acquiring entity. We will notify you of any such
        change in ownership.
      </p>

      <h2 id="data-security" className="mb-4 text-2xl font-semibold text-foreground">
        Data Security
      </h2>
      <p className="mb-4 text-muted-foreground">
        We implement industry-standard security measures to protect your information:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>End-to-end encryption for data in transit</li>
        <li>Encryption at rest for stored data</li>
        <li>Regular security audits and penetration testing</li>
        <li>Access controls and authentication requirements</li>
        <li>Employee training on data protection and privacy</li>
        <li>Incident response procedures</li>
      </ul>

      <h2 id="data-retention" className="mb-4 text-2xl font-semibold text-foreground">
        Data Retention
      </h2>
      <p className="mb-4 text-muted-foreground">
        We retain your information for as long as necessary to provide our services
        and comply with legal obligations:
      </p>
      <ul className="mb-8 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>Account information: Retained while your account is active</li>
        <li>Conversation data: Retained according to your retention settings</li>
        <li>Usage logs: Typically retained for 90 days</li>
        <li>Billing records: Retained for 7 years for tax purposes</li>
      </ul>

      <h2 id="your-rights" className="mb-4 text-2xl font-semibold text-foreground">
        Your Privacy Rights
      </h2>
      <p className="mb-4 text-muted-foreground">
        Depending on your location, you may have the following rights:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Access:</strong> Request a copy of the personal information we hold
          about you
        </li>
        <li>
          <strong>Correction:</strong> Request correction of inaccurate or incomplete
          information
        </li>
        <li>
          <strong>Deletion:</strong> Request deletion of your personal information
        </li>
        <li>
          <strong>Portability:</strong> Request a copy of your data in a
          machine-readable format
        </li>
        <li>
          <strong>Objection:</strong> Object to certain processing of your
          information
        </li>
        <li>
          <strong>Restriction:</strong> Request restriction of processing in certain
          circumstances
        </li>
      </ul>

      <h2 id="cookies" className="mb-4 text-2xl font-semibold text-foreground">
        Cookies and Tracking
      </h2>
      <p className="mb-4 text-muted-foreground">
        We use cookies and similar tracking technologies to improve your experience:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Essential Cookies:</strong> Required for the service to function
          properly
        </li>
        <li>
          <strong>Analytics Cookies:</strong> Help us understand how you use AutoCrew
        </li>
        <li>
          <strong>Preference Cookies:</strong> Remember your settings and preferences
        </li>
        <li>
          <strong>Marketing Cookies:</strong> Track your activity for marketing
          purposes (with consent)
        </li>
      </ul>

      <h2 id="international-transfers" className="mb-4 text-2xl font-semibold text-foreground">
        International Data Transfers
      </h2>
      <p className="mb-8 text-muted-foreground">
        Your information may be transferred to and processed in countries other than
        your own. We ensure appropriate safeguards are in place for such transfers,
        including Standard Contractual Clauses approved by the European Commission.
      </p>

      <h2 id="children-privacy" className="mb-4 text-2xl font-semibold text-foreground">
        Children's Privacy
      </h2>
      <p className="mb-8 text-muted-foreground">
        AutoCrew is not intended for use by children under 16. We do not knowingly
        collect personal information from children. If you believe we have collected
        information from a child, please contact us immediately.
      </p>

      <h2 id="changes-policy" className="mb-4 text-2xl font-semibold text-foreground">
        Changes to This Policy
      </h2>
      <p className="mb-8 text-muted-foreground">
        We may update this Privacy Policy from time to time. We will notify you of
        any material changes by email or through a notice on our website. Your
        continued use of AutoCrew after such changes constitutes acceptance of the
        updated policy.
      </p>

      <h2 id="contact" className="mb-4 text-2xl font-semibold text-foreground">
        Contact Us
      </h2>
      <p className="mb-4 text-muted-foreground">
        If you have questions about this Privacy Policy or our data practices, please
        contact us:
      </p>
      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <strong>Email:</strong> privacy@autocrew.ai
          </li>
          <li>
            <strong>Address:</strong> AutoCrew Inc., 123 AI Street, San Francisco, CA
            94105
          </li>
          <li>
            <strong>Data Protection Officer:</strong> dpo@autocrew.ai
          </li>
        </ul>
      </div>

      <DocNavigation />
    </div>
  )
}

import type { Metadata } from "next"
import { DocNavigation } from "@/components/docs/doc-navigation"

export const metadata: Metadata = {
  title: "Security",
  description:
    "Learn about AutoCrew's security practices, infrastructure, encryption, access controls, and incident response procedures.",
}

export default function SecurityPage() {
  return (
    <div>
      <h1 id="security" className="mb-4 text-4xl font-bold text-foreground">
        Security
      </h1>
      <p className="mb-2 text-sm text-muted-foreground">
        Last Updated: March 4, 2026
      </p>
      <p className="mb-8 text-lg text-muted-foreground">
        At AutoCrew, security is foundational to everything we build. This page
        describes the technical and organizational measures we use to protect
        your data and ensure the integrity of our platform.
      </p>

      {/* Security Overview */}
      <h2 id="security-overview" className="mb-4 text-2xl font-semibold text-foreground">
        Security Overview
      </h2>
      <p className="mb-4 text-muted-foreground">
        AutoCrew is built with a security-first architecture designed to meet the
        demands of enterprise customers handling sensitive data. Our security
        program encompasses:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Defense in depth:</strong> Multiple layers of security controls
          across infrastructure, application, and data layers
        </li>
        <li>
          <strong>Zero-trust principles:</strong> Every request is authenticated
          and authorized regardless of origin
        </li>
        <li>
          <strong>Continuous monitoring:</strong> Real-time threat detection and
          automated incident response
        </li>
        <li>
          <strong>Regular auditing:</strong> Independent third-party security
          assessments and penetration testing
        </li>
      </ul>

      {/* Encryption */}
      <h2 id="encryption" className="mb-4 text-2xl font-semibold text-foreground">
        Encryption
      </h2>
      <p className="mb-4 text-muted-foreground">
        All customer data is encrypted both at rest and in transit using
        industry-leading cryptographic standards.
      </p>

      <h3 id="data-at-rest" className="mb-3 text-xl font-semibold text-foreground">
        Data at Rest
      </h3>
      <ul className="mb-6 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>AES-256 encryption for all stored data including databases, file storage, and backups</li>
        <li>Encrypted database volumes with provider-managed or customer-managed keys</li>
        <li>Encrypted backups stored in geographically separate regions</li>
        <li>Secure key storage using Hardware Security Modules (HSMs)</li>
      </ul>

      <h3 id="data-in-transit" className="mb-3 text-xl font-semibold text-foreground">
        Data in Transit
      </h3>
      <ul className="mb-6 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>TLS 1.3 enforced for all client-to-server and server-to-server communications</li>
        <li>HTTP Strict Transport Security (HSTS) with long-duration max-age directives</li>
        <li>Certificate pinning for API connections to critical services</li>
        <li>Forward secrecy enabled on all TLS connections</li>
      </ul>

      <h3 id="key-management" className="mb-3 text-xl font-semibold text-foreground">
        Key Management
      </h3>
      <ul className="mb-8 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>Encryption keys managed through dedicated Hardware Security Modules (HSMs)</li>
        <li>Automated key rotation on a 90-day cycle</li>
        <li>Strict separation between key management infrastructure and data storage</li>
        <li>Key access restricted to authorized security personnel with audit logging</li>
      </ul>

      {/* Infrastructure */}
      <h2 id="infrastructure" className="mb-4 text-2xl font-semibold text-foreground">
        Infrastructure and Architecture
      </h2>
      <p className="mb-4 text-muted-foreground">
        AutoCrew runs on enterprise-grade cloud infrastructure with multiple
        layers of protection:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Multi-region deployment:</strong> Infrastructure distributed
          across multiple availability zones for high availability and disaster
          recovery
        </li>
        <li>
          <strong>Network segmentation:</strong> Strict firewall rules and
          network policies isolate production, staging, and development
          environments
        </li>
        <li>
          <strong>DDoS protection:</strong> Enterprise-grade DDoS mitigation at
          the network and application layers
        </li>
        <li>
          <strong>Container isolation:</strong> Tenant workloads run in isolated
          containers with resource limits and security policies
        </li>
        <li>
          <strong>Disaster recovery:</strong> Defined Recovery Point Objective
          (RPO) and Recovery Time Objective (RTO) with automated failover
          procedures
        </li>
        <li>
          <strong>Immutable infrastructure:</strong> Infrastructure deployed as
          code with automated provisioning, reducing configuration drift and
          human error
        </li>
      </ul>

      {/* Access Control */}
      <h2 id="access-control" className="mb-4 text-2xl font-semibold text-foreground">
        Access Control
      </h2>

      <h3 id="rbac" className="mb-3 text-xl font-semibold text-foreground">
        Role-Based Access Control
      </h3>
      <ul className="mb-6 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>Granular, role-based permissions following the principle of least privilege</li>
        <li>Workspace-level access controls for team management</li>
        <li>API key scoping with fine-grained permission sets</li>
        <li>Regular access reviews and automated deprovisioning</li>
      </ul>

      <h3 id="authentication" className="mb-3 text-xl font-semibold text-foreground">
        Authentication
      </h3>
      <ul className="mb-6 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>Multi-factor authentication (MFA) enforced for all accounts</li>
        <li>Single Sign-On (SSO) support via SAML 2.0 and OpenID Connect (OIDC)</li>
        <li>Secure session management with configurable timeout policies</li>
        <li>Brute-force protection with progressive rate limiting and account lockout</li>
      </ul>

      <h3 id="admin-access" className="mb-3 text-xl font-semibold text-foreground">
        Administrative Access
      </h3>
      <ul className="mb-8 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>Just-in-time (JIT) privileged access — no standing admin credentials</li>
        <li>All administrative actions logged with immutable audit trails</li>
        <li>Separate authentication for production system access</li>
        <li>Mandatory peer approval for sensitive operations</li>
      </ul>

      {/* Incident Response */}
      <h2 id="incident-response" className="mb-4 text-2xl font-semibold text-foreground">
        Incident Response
      </h2>
      <p className="mb-4 text-muted-foreground">
        AutoCrew maintains a comprehensive incident response program to detect,
        contain, and remediate security events:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>24/7 monitoring:</strong> Dedicated security operations with
          around-the-clock threat monitoring and alerting
        </li>
        <li>
          <strong>Severity classification:</strong> Defined severity levels (P1
          through P4) with corresponding response SLAs and escalation procedures
        </li>
        <li>
          <strong>Customer notification:</strong> Affected customers notified
          within 72 hours of confirmed data breaches, in compliance with GDPR
          and applicable regulations
        </li>
        <li>
          <strong>Post-incident review:</strong> Root cause analysis and
          remediation tracking for every security incident, with findings
          incorporated into security controls
        </li>
        <li>
          <strong>Tabletop exercises:</strong> Regular incident response drills
          to test and improve response readiness
        </li>
      </ul>

      {/* Monitoring */}
      <h2 id="monitoring" className="mb-4 text-2xl font-semibold text-foreground">
        Monitoring and Logging
      </h2>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Centralized logging:</strong> All system, application, and
          security logs aggregated in a centralized platform with structured
          indexing
        </li>
        <li>
          <strong>SIEM integration:</strong> Security Information and Event
          Management system for correlation, alerting, and investigation
        </li>
        <li>
          <strong>Anomaly detection:</strong> Machine learning-based anomaly
          detection to identify suspicious patterns and potential threats
        </li>
        <li>
          <strong>Audit trail retention:</strong> Security-relevant logs retained
          for a minimum of 12 months with integrity protections
        </li>
        <li>
          <strong>Real-time alerting:</strong> Automated alerts for suspicious
          activities including unauthorized access attempts, configuration
          changes, and data exfiltration patterns
        </li>
      </ul>

      {/* Vulnerability Management */}
      <h2 id="vulnerability-management" className="mb-4 text-2xl font-semibold text-foreground">
        Vulnerability Management
      </h2>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Penetration testing:</strong> Annual third-party penetration
          tests supplemented by continuous automated vulnerability scanning
        </li>
        <li>
          <strong>Responsible disclosure:</strong> Public responsible disclosure
          program for security researchers to report vulnerabilities
        </li>
        <li>
          <strong>Patch management:</strong> Critical vulnerabilities patched
          within 24 hours; high-severity within 7 days; medium and low within 30
          days
        </li>
        <li>
          <strong>Dependency scanning:</strong> Automated dependency scanning
          integrated into CI/CD pipelines to catch vulnerable packages before
          deployment
        </li>
        <li>
          <strong>Static analysis:</strong> Automated static application security
          testing (SAST) as part of the development workflow
        </li>
      </ul>

      {/* Employee Security */}
      <h2 id="employee-security" className="mb-4 text-2xl font-semibold text-foreground">
        Employee Security
      </h2>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Background checks:</strong> Comprehensive background screening
          for all employees with access to customer data or production systems
        </li>
        <li>
          <strong>Security training:</strong> Mandatory security awareness
          training at onboarding and annually, with role-specific secure
          development training for engineers
        </li>
        <li>
          <strong>Endpoint protection:</strong> Company-managed devices with
          full-disk encryption, endpoint detection and response (EDR), and mobile
          device management (MDM)
        </li>
        <li>
          <strong>Offboarding:</strong> Immediate access revocation upon
          termination, with device recovery and credential rotation
        </li>
      </ul>

      {/* Third-Party Risk */}
      <h2 id="third-party" className="mb-4 text-2xl font-semibold text-foreground">
        Third-Party Risk Management
      </h2>
      <p className="mb-4 text-muted-foreground">
        We carefully evaluate and monitor all third-party vendors and
        subprocessors that interact with customer data:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Vendor assessments:</strong> Security questionnaires, SOC 2
          report reviews, and risk scoring for all vendors before onboarding
        </li>
        <li>
          <strong>Contractual requirements:</strong> Data Processing Agreements
          (DPAs) and security addenda required for all subprocessors
        </li>
        <li>
          <strong>Ongoing monitoring:</strong> Annual reassessment of vendor
          security posture with continuous monitoring for critical vendors
        </li>
        <li>
          <strong>Change notification:</strong> Customers notified of material
          changes to subprocessors that handle their data
        </li>
      </ul>

      {/* Data Handling */}
      <h2 id="data-handling" className="mb-4 text-2xl font-semibold text-foreground">
        Data Handling and Privacy Safeguards
      </h2>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Data classification:</strong> All data classified by
          sensitivity level (public, internal, confidential, restricted) with
          corresponding handling requirements
        </li>
        <li>
          <strong>Data minimization:</strong> We collect and retain only the data
          necessary to deliver our services
        </li>
        <li>
          <strong>Tenant isolation:</strong> Strict logical separation of
          customer data with tenant-scoped access controls at every layer
        </li>
        <li>
          <strong>Secure deletion:</strong> Cryptographic erasure and secure
          overwrite procedures when data is deleted or when a customer
          offboards
        </li>
        <li>
          <strong>Privacy safeguards:</strong> For detailed information about how
          we handle personal data, see our{" "}
          <a href="/docs/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
        </li>
      </ul>

      {/* Contact */}
      <h2 id="contact-security" className="mb-4 text-2xl font-semibold text-foreground">
        Contact Us
      </h2>
      <p className="mb-4 text-muted-foreground">
        If you have questions about our security practices or need to report a
        security concern, please contact us:
      </p>
      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <strong>Security Team:</strong> security@autocrew.ai
          </li>
          <li>
            <strong>Responsible Disclosure:</strong> security-reports@autocrew.ai
          </li>
          <li>
            <strong>Address:</strong> AutoCrew Inc., 123 AI Street, San
            Francisco, CA 94105
          </li>
        </ul>
      </div>

      <DocNavigation />
    </div>
  )
}

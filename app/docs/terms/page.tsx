import type { Metadata } from "next"
import { DocNavigation } from "@/components/docs/doc-navigation"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing your access to and use of AutoCrew's platform and services. Please read before using our product.",
}

export default function TermsPage() {
  return (
    <div>
      <h1 id="terms-of-service" className="mb-4 text-4xl font-bold text-foreground">
        Terms of Service
      </h1>
      <p className="mb-2 text-sm text-muted-foreground">
        Last Updated: December 29, 2024
      </p>
      <p className="mb-8 text-lg text-muted-foreground">
        These Terms of Service govern your access to and use of AutoCrew's platform
        and services. Please read them carefully.
      </p>

      <h2 id="acceptance" className="mb-4 text-2xl font-semibold text-foreground">
        Acceptance of Terms
      </h2>
      <p className="mb-8 text-muted-foreground">
        By accessing or using AutoCrew, you agree to be bound by these Terms of
        Service and all applicable laws and regulations. If you do not agree with any
        of these terms, you are prohibited from using our services.
      </p>

      <h2 id="definitions" className="mb-4 text-2xl font-semibold text-foreground">
        Definitions
      </h2>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>"Service"</strong> refers to the AutoCrew platform, including all
          features, AI crews, and related services
        </li>
        <li>
          <strong>"User"</strong> or <strong>"You"</strong> refers to any individual
          or entity using our Service
        </li>
        <li>
          <strong>"Content"</strong> refers to any data, text, information, or
          materials uploaded to or processed by the Service
        </li>
        <li>
          <strong>"AI Crew"</strong> refers to the artificial intelligence systems
          provided by AutoCrew
        </li>
      </ul>

      <h2 id="account-registration" className="mb-4 text-2xl font-semibold text-foreground">
        Account Registration
      </h2>

      <h3 id="eligibility" className="mb-3 text-xl font-semibold text-foreground">
        Eligibility
      </h3>
      <p className="mb-4 text-muted-foreground">
        To use AutoCrew, you must:
      </p>
      <ul className="mb-6 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>Be at least 18 years old</li>
        <li>Have the legal capacity to enter into a binding agreement</li>
        <li>Not be prohibited from using the Service under applicable laws</li>
        <li>Provide accurate and complete registration information</li>
      </ul>

      <h3 id="account-security" className="mb-3 text-xl font-semibold text-foreground">
        Account Security
      </h3>
      <p className="mb-8 text-muted-foreground">
        You are responsible for maintaining the confidentiality of your account
        credentials and for all activities that occur under your account. You must
        immediately notify us of any unauthorized use or security breach.
      </p>

      <h2 id="acceptable-use" className="mb-4 text-2xl font-semibold text-foreground">
        Acceptable Use Policy
      </h2>
      <p className="mb-4 text-muted-foreground">
        You agree not to use the Service to:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>Violate any applicable laws or regulations</li>
        <li>Infringe upon intellectual property rights of others</li>
        <li>Transmit harmful, offensive, or inappropriate content</li>
        <li>Engage in fraudulent or deceptive practices</li>
        <li>Interfere with or disrupt the Service or servers</li>
        <li>Attempt to gain unauthorized access to systems or data</li>
        <li>Use the Service for spam or unsolicited marketing</li>
        <li>Reverse engineer or attempt to extract source code</li>
        <li>Resell or redistribute the Service without authorization</li>
      </ul>

      <h2 id="service-plans" className="mb-4 text-2xl font-semibold text-foreground">
        Service Plans and Billing
      </h2>

      <h3 id="subscription-plans" className="mb-3 text-xl font-semibold text-foreground">
        Subscription Plans
      </h3>
      <p className="mb-4 text-muted-foreground">
        AutoCrew offers various subscription plans with different features and
        pricing. Details are available on our pricing page.
      </p>

      <h3 id="payment-terms" className="mb-3 text-xl font-semibold text-foreground">
        Payment Terms
      </h3>
      <ul className="mb-6 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>Subscriptions are billed in advance on a monthly or annual basis</li>
        <li>All fees are non-refundable except as required by law</li>
        <li>You authorize us to charge your payment method automatically</li>
        <li>Prices may change with 30 days' notice</li>
      </ul>

      <h3 id="cancellation" className="mb-3 text-xl font-semibold text-foreground">
        Cancellation and Termination
      </h3>
      <p className="mb-8 text-muted-foreground">
        You may cancel your subscription at any time. Cancellations take effect at
        the end of the current billing period. We reserve the right to suspend or
        terminate accounts that violate these Terms.
      </p>

      <h2 id="intellectual-property" className="mb-4 text-2xl font-semibold text-foreground">
        Intellectual Property Rights
      </h2>

      <h3 id="our-ip" className="mb-3 text-xl font-semibold text-foreground">
        AutoCrew's Intellectual Property
      </h3>
      <p className="mb-4 text-muted-foreground">
        The Service, including all software, designs, text, graphics, and other
        materials, is owned by AutoCrew and protected by intellectual property laws.
        You receive a limited, non-exclusive license to use the Service.
      </p>

      <h3 id="your-content" className="mb-3 text-xl font-semibold text-foreground">
        Your Content
      </h3>
      <p className="mb-8 text-muted-foreground">
        You retain ownership of all content you upload to the Service. By using
        AutoCrew, you grant us a limited license to process, store, and transmit your
        content solely to provide the Service. We will not use your content for any
        other purpose without your consent.
      </p>

      <h2 id="data-processing" className="mb-4 text-2xl font-semibold text-foreground">
        Data Processing and Privacy
      </h2>
      <p className="mb-4 text-muted-foreground">
        Our use of your personal information is governed by our Privacy Policy. By
        using AutoCrew, you consent to our data processing practices as described in
        the Privacy Policy.
      </p>

      <h3 id="data-controller" className="mb-3 text-xl font-semibold text-foreground">
        Data Controller and Processor
      </h3>
      <p className="mb-8 text-muted-foreground">
        For customer data processed through AI crews, you act as the data controller
        and we act as the data processor. You are responsible for ensuring you have
        the necessary rights and consents to process such data.
      </p>

      <h2 id="warranties" className="mb-4 text-2xl font-semibold text-foreground">
        Warranties and Disclaimers
      </h2>

      <h3 id="service-warranty" className="mb-3 text-xl font-semibold text-foreground">
        Service Availability
      </h3>
      <p className="mb-4 text-muted-foreground">
        While we strive for high availability, we do not guarantee that the Service
        will be uninterrupted or error-free. We reserve the right to modify,
        suspend, or discontinue any part of the Service at any time.
      </p>

      <h3 id="ai-limitations" className="mb-3 text-xl font-semibold text-foreground">
        AI Limitations
      </h3>
      <p className="mb-8 text-muted-foreground">
        AI Crews are provided "as is" without warranties of any kind. While our AI
        systems are designed to be accurate and helpful, they may make errors or
        produce unexpected results. You are responsible for reviewing and validating
        AI-generated responses.
      </p>

      <h2 id="liability" className="mb-4 text-2xl font-semibold text-foreground">
        Limitation of Liability
      </h2>
      <p className="mb-4 text-muted-foreground">
        To the maximum extent permitted by law:
      </p>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          AutoCrew shall not be liable for any indirect, incidental, special, or
          consequential damages
        </li>
        <li>
          Our total liability shall not exceed the amount you paid for the Service in
          the 12 months preceding the claim
        </li>
        <li>
          We are not liable for damages arising from unauthorized access, data loss,
          or service interruptions
        </li>
        <li>
          You agree to indemnify AutoCrew against claims arising from your use of the
          Service
        </li>
      </ul>

      <h2 id="service-level" className="mb-4 text-2xl font-semibold text-foreground">
        Service Level Agreement
      </h2>
      <p className="mb-4 text-muted-foreground">
        For Enterprise plan customers, we offer a Service Level Agreement with:
      </p>
      <ul className="mb-8 list-disc space-y-1 pl-6 text-muted-foreground">
        <li>99.9% uptime guarantee</li>
        <li>Priority support with defined response times</li>
        <li>Service credits for downtime exceeding the guarantee</li>
      </ul>

      <h2 id="modifications" className="mb-4 text-2xl font-semibold text-foreground">
        Modifications to Terms
      </h2>
      <p className="mb-8 text-muted-foreground">
        We reserve the right to modify these Terms at any time. We will notify you of
        material changes via email or through the Service. Your continued use after
        such notice constitutes acceptance of the modified Terms.
      </p>

      <h2 id="dispute-resolution" className="mb-4 text-2xl font-semibold text-foreground">
        Dispute Resolution
      </h2>

      <h3 id="governing-law" className="mb-3 text-xl font-semibold text-foreground">
        Governing Law
      </h3>
      <p className="mb-4 text-muted-foreground">
        These Terms shall be governed by the laws of the State of California, without
        regard to conflict of law provisions.
      </p>

      <h3 id="arbitration" className="mb-3 text-xl font-semibold text-foreground">
        Arbitration
      </h3>
      <p className="mb-8 text-muted-foreground">
        Any disputes shall be resolved through binding arbitration in accordance with
        the rules of the American Arbitration Association, except that you may bring
        claims in small claims court if they qualify.
      </p>

      <h2 id="general-provisions" className="mb-4 text-2xl font-semibold text-foreground">
        General Provisions
      </h2>
      <ul className="mb-8 list-disc space-y-2 pl-6 text-muted-foreground">
        <li>
          <strong>Entire Agreement:</strong> These Terms constitute the entire
          agreement between you and AutoCrew
        </li>
        <li>
          <strong>Severability:</strong> If any provision is found invalid, the
          remaining provisions continue in effect
        </li>
        <li>
          <strong>Waiver:</strong> Failure to enforce any provision does not
          constitute a waiver
        </li>
        <li>
          <strong>Assignment:</strong> You may not assign these Terms without our
          written consent
        </li>
        <li>
          <strong>Force Majeure:</strong> We are not liable for delays or failures
          due to circumstances beyond our control
        </li>
      </ul>

      <h2 id="contact-terms" className="mb-4 text-2xl font-semibold text-foreground">
        Contact Information
      </h2>
      <p className="mb-4 text-muted-foreground">
        If you have questions about these Terms of Service, please contact us:
      </p>
      <div className="mb-8 rounded-lg border border-border bg-card p-6">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>
            <strong>Email:</strong> legal@autocrew.ai
          </li>
          <li>
            <strong>Address:</strong> AutoCrew Inc., 123 AI Street, San Francisco, CA
            94105
          </li>
          <li>
            <strong>Phone:</strong> +1 (555) 123-4567
          </li>
        </ul>
      </div>

      <DocNavigation />
    </div>
  )
}

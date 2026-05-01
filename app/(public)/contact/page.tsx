import type { Metadata } from "next";
import { Mail, MessageSquare, Phone, MapPin } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/schemas";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Autocrew team. Send us a message about AI receptionists, customer support automation, or lead-generation crews — we respond within 24 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Autocrew",
    description:
      "Talk to the Autocrew team about AI receptionists, customer support automation, and lead-generation crews.",
    url: "/contact",
  },
};

const baseUrl = APP_CONFIG.url;

export default function ContactPage() {
  return (
    <div className="pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `${baseUrl}/` },
          { name: "Contact", url: `${baseUrl}/contact` },
        ])}
      />
      <JsonLd
        data={webPageSchema(
          `${baseUrl}/contact`,
          "Contact Autocrew",
          "2025-01-15",
          "2026-05-01",
        )}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-space-grotesk text-foreground mb-6 leading-[1.1]">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground font-geist leading-relaxed">
            Have questions? We&apos;d love to hear from you. Send us a message
            and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div className="bg-card border border-border rounded-3xl p-8">
            <h2 className="text-2xl font-semibold font-space-grotesk tracking-tight mb-6">
              Send us a message
            </h2>
            <ContactForm />
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold font-space-grotesk tracking-tight mb-6">
                Contact Information
              </h2>
              <p className="text-muted-foreground font-geist mb-8 leading-relaxed">
                Reach out to us through any of these channels, and our team will
                be happy to assist you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold font-space-grotesk mb-1">
                    Email
                  </h3>
                  <p className="text-muted-foreground font-geist">
                    {APP_CONFIG.supportEmail}
                  </p>
                  <p className="text-sm text-muted-foreground font-geist">
                    We&apos;ll respond within 24 hours
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold font-space-grotesk mb-1">
                    Phone
                  </h3>
                  <a
                    href={APP_CONFIG.supportPhoneTel}
                    className="text-muted-foreground font-geist hover:text-primary hover:underline underline-offset-2 transition-colors"
                  >
                    {APP_CONFIG.supportPhoneDisplay}
                  </a>
                  <p className="text-sm text-muted-foreground font-geist mt-1">
                    {APP_CONFIG.supportPhoneHours}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold font-space-grotesk mb-1">
                    Office
                  </h3>
                  <p className="text-muted-foreground font-geist">
                    123 AI Street
                  </p>
                  <p className="text-muted-foreground font-geist">
                    San Francisco, CA 94102
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold font-space-grotesk mb-1">
                    Live Chat
                  </h3>
                  <p className="text-muted-foreground font-geist">
                    Available 24/7
                  </p>
                  <p className="text-sm text-muted-foreground font-geist">
                    Click the chat icon in the bottom right
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

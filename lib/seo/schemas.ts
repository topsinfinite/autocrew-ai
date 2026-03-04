import { APP_CONFIG } from "@/lib/constants";
import type { FAQItem } from "@/lib/mock-data/docs-content";

const baseUrl = APP_CONFIG.url;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: APP_CONFIG.name,
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description: APP_CONFIG.description,
    contactPoint: {
      "@type": "ContactPoint",
      email: APP_CONFIG.supportEmail,
      contactType: "customer support",
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: APP_CONFIG.name,
    url: baseUrl,
    description: APP_CONFIG.description,
    publisher: {
      "@type": "Organization",
      name: APP_CONFIG.name,
    },
  };
}

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: APP_CONFIG.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description:
      "Deploy AI crews that automate customer support and lead generation 24/7. No code required.",
    url: baseUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free trial available",
    },
    featureList: [
      "HIPAA-Aware Healthcare Agents",
      "Multi-Channel Voice Access",
      "Knowledge Base RAG",
      "Smart Escalation",
      "Real-Time Analytics",
      "Enterprise Security",
    ],
  };
}

export function faqPageSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

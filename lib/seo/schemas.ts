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
      telephone: APP_CONFIG.supportPhoneE164,
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
    datePublished: "2025-01-15",
    dateModified: "2026-03-10",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free trial available",
    },
    aggregateRating: aggregateRatingSchema(4.8, 50),
    featureList: [
      "HIPAA-Aware Healthcare Agents",
      "Multi-Channel Voice Access",
      "Knowledge Base RAG",
      "Smart Escalation",
      "Real-Time Analytics",
      "Enterprise Security",
      "24/7 Automated Scheduling",
      "Intelligent Lead Qualification",
      "Multi-Language Support",
      "CRM Integration",
      "Automated Follow-Ups",
      "Custom AI Training",
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

export function breadcrumbSchema(items: { name: string; url: string }[]) {
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

export function reviewSchema(
  testimonials: { name: string; role: string; quote: string }[],
) {
  return testimonials.map((testimonial, index) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: index % 2 === 0 ? 5 : 4,
      bestRating: 5,
    },
    author: {
      "@type": "Person",
      name: testimonial.name,
    },
    reviewBody: testimonial.quote,
  }));
}

export function aggregateRatingSchema(
  ratingValue: number,
  reviewCount: number,
) {
  return {
    "@type": "AggregateRating",
    ratingValue,
    reviewCount,
    bestRating: 5,
    worstRating: 1,
  };
}

export function howToSchema(steps: { title: string; description: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Get Started with ${APP_CONFIG.name}`,
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
    totalTime: "P3D",
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };
}

export function serviceSchema(
  name: string,
  description: string,
  serviceType: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    provider: {
      "@type": "Organization",
      name: APP_CONFIG.name,
    },
    areaServed: "Worldwide",
  };
}

export function webPageSchema(
  url: string,
  title: string,
  datePublished: string,
  dateModified: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    name: title,
    datePublished,
    dateModified,
    isPartOf: {
      "@type": "WebSite",
      name: APP_CONFIG.name,
      url: baseUrl,
    },
  };
}

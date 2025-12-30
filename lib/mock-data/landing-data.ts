import { LucideIcon } from "lucide-react";

// Hero Section Data
export const heroData = {
  headline: "AI-Powered Automation for Your Business",
  subheadline: "Deploy intelligent AI crews that work 24/7 to handle customer support and generate high-quality leads automatically.",
  primaryCta: {
    text: "Get Started Free",
    href: "/login",
  },
  secondaryCta: {
    text: "Watch Demo",
    href: "#demo",
  },
};

// Features Data
export interface Feature {
  title: string;
  description: string;
  icon: string; // Icon name from lucide-react
}

export const featuresData: Feature[] = [
  {
    title: "24/7 Automated Support",
    description: "AI-powered support crews handle customer inquiries round the clock, providing instant responses and resolutions.",
    icon: "MessageCircle",
  },
  {
    title: "Intelligent Lead Generation",
    description: "Automated lead generation crews identify, engage, and qualify potential customers with personalized conversations.",
    icon: "Target",
  },
  {
    title: "Multi-Channel Integration",
    description: "Seamlessly integrate with your existing tools via n8n webhooks, Slack, email, and more.",
    icon: "Network",
  },
  {
    title: "Real-Time Analytics",
    description: "Track performance metrics, conversation sentiment, and lead quality with comprehensive dashboards.",
    icon: "BarChart3",
  },
  {
    title: "Easy Customization",
    description: "Configure your AI crews with custom prompts, workflows, and integrations without writing code.",
    icon: "Settings",
  },
  {
    title: "Enterprise Security",
    description: "Bank-level encryption, SOC 2 compliance, and role-based access control to protect your data.",
    icon: "Shield",
  },
];

// Services Data
export interface Service {
  type: "Support" | "LeadGen";
  title: string;
  description: string;
  features: string[];
  icon: string;
}

export const servicesData: Service[] = [
  {
    type: "Support",
    title: "Support Crew",
    description: "Automate customer support with AI agents that understand context, resolve issues, and escalate when needed.",
    features: [
      "Instant response to customer inquiries",
      "Multi-language support capabilities",
      "Sentiment analysis and routing",
      "Seamless handoff to human agents",
      "Knowledge base integration",
      "Ticket management automation",
    ],
    icon: "Headphones",
  },
  {
    type: "LeadGen",
    title: "LeadGen Crew",
    description: "Generate and qualify leads automatically with conversational AI that engages prospects naturally.",
    features: [
      "Proactive lead engagement",
      "Intelligent qualification questions",
      "CRM integration and data sync",
      "Appointment scheduling",
      "Follow-up automation",
      "Lead scoring and prioritization",
    ],
    icon: "Sparkles",
  },
];

// How It Works Data
export interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
}

export const howItWorksData: Step[] = [
  {
    number: 1,
    title: "Create Your Crew",
    description: "Set up your AI crew in minutes by defining its purpose, configuring settings, and connecting your tools.",
    icon: "Plus",
  },
  {
    number: 2,
    title: "Configure & Train",
    description: "Customize your crew's behavior, add your knowledge base, and set up automation workflows.",
    icon: "Brain",
  },
  {
    number: 3,
    title: "Deploy & Monitor",
    description: "Launch your crew and watch it handle conversations. Monitor performance in real-time.",
    icon: "Rocket",
  },
  {
    number: 4,
    title: "Optimize & Scale",
    description: "Use analytics insights to improve performance and scale your operations effortlessly.",
    icon: "TrendingUp",
  },
];

// Stats Data
export interface Stat {
  value: string;
  label: string;
  description: string;
}

export const statsData: Stat[] = [
  {
    value: "99.9%",
    label: "Uptime",
    description: "Enterprise-grade reliability",
  },
  {
    value: "< 2s",
    label: "Response Time",
    description: "Lightning-fast AI responses",
  },
  {
    value: "10M+",
    label: "Conversations",
    description: "Handled by our AI crews",
  },
  {
    value: "95%",
    label: "Satisfaction",
    description: "Customer satisfaction rate",
  },
];

// CTA Section Data
export const ctaData = {
  headline: "Ready to Automate Your Business?",
  subheadline: "Join hundreds of companies using AutoCrew to handle support and generate leads automatically.",
  primaryCta: {
    text: "Start Free Trial",
    href: "/login",
  },
  secondaryCta: {
    text: "Schedule a Demo",
    href: "/contact",
  },
  features: [
    "No credit card required",
    "14-day free trial",
    "Cancel anytime",
  ],
};

// Navigation Links
export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Docs", href: "/docs" },
  { label: "About", href: "/about" },
];

// Footer Data
export interface FooterSection {
  title: string;
  links: { label: string; href: string }[];
}

export const footerData: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Support Crew", href: "/docs/support-crew" },
      { label: "LeadGen Crew", href: "/docs/leadgen-crew" },
      { label: "Pricing", href: "#pricing" },
      { label: "Changelog", href: "#changelog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/docs" },
      { label: "Getting Started", href: "/docs/getting-started" },
      { label: "User Guide", href: "/docs/user-guide" },
      { label: "FAQ", href: "/docs/faq" },
      { label: "API Reference", href: "/docs/api" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/docs/privacy" },
      { label: "Terms of Service", href: "/docs/terms" },
      { label: "Security", href: "#security" },
      { label: "Compliance", href: "#compliance" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
    ],
  },
];

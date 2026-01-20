// Hero Section Data
export const heroData = {
  announcement: {
    text: "AutoCrew 2.0 is live",
    icon: "CircleDot",
  },
  headline: {
    prefix: "Deploy intelligent AI crews that",
    accent: "work 24/7",
  },
  subheadline: "Handle customer support and generate high-quality leads automatically. No code required.",
  primaryCta: {
    text: "Start for free",
    href: "/signup",
  },
  secondaryCta: {
    text: "Watch demo",
    href: "/#demo",
    icon: "PlayCircle",
  },
  trustText: "Trusted by modern teams of all sizes",
};

// Features Data - 6 Features Grid (not bento)
export interface Feature {
  title: string;
  description: string;
  icon: string;
}

export const featuresData: Feature[] = [
  {
    title: "24/7 Automated Support",
    description: "AI-powered support crews handle customer inquiries round the clock, providing instant responses and resolutions.",
    icon: "MessageSquare",
  },
  {
    title: "Intelligent Lead Gen",
    description: "Automated lead generation crews identify, engage, and qualify potential customers with personalized conversations.",
    icon: "Zap",
  },
  {
    title: "Multi-Channel Integration",
    description: "Seamlessly integrate with your existing tools via n8n webhooks, Slack, email, and more.",
    icon: "LayoutGrid",
  },
  {
    title: "Real-Time Analytics",
    description: "Track performance metrics, conversation sentiment, and lead quality with comprehensive dashboards.",
    icon: "TrendingUp",
  },
  {
    title: "Easy Customization",
    description: "Configure your AI crews with custom prompts, workflows, and integrations without writing code.",
    icon: "Settings2",
  },
  {
    title: "Enterprise Security",
    description: "Bank-level encryption, SOC 2 compliance, and role-based access control to protect your data.",
    icon: "ShieldCheck",
  },
];

// AI Crews Section Data
export interface AiCrew {
  badge: string;
  title: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaDisabled?: boolean;
}

export const aiCrewsData: AiCrew[] = [
  {
    badge: "Support",
    title: "Support Crew",
    description: "Automate customer support with AI agents that understand context, resolve issues, and escalate when needed.",
    features: [
      "Instant response to customer inquiries",
      "Multi-language support capabilities",
      "Sentiment analysis and routing",
      "Seamless handoff to human agents",
    ],
    ctaText: "Learn More",
    ctaDisabled: false,
  },
  {
    badge: "LeadGen",
    title: "LeadGen Crew",
    description: "Generate and qualify leads automatically with conversational AI that engages prospects naturally.",
    features: [
      "Proactive lead engagement",
      "Intelligent qualification questions",
      "CRM integration and data sync",
      "Appointment scheduling",
    ],
    ctaText: "Coming Soon",
    ctaDisabled: true,
  },
];

// Pricing Section Data
export interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
  ctaText: string;
  highlighted?: boolean;
  icon: string;
}

export const pricingData = {
  badge: "Flexible Pricing",
  title: "Big or Small?",
  subtitle: "We have a plan.",
  tiers: [
    {
      name: "Starter",
      price: 499,
      description: "Perfect for startups looking to automate core support functions with extraordinary value.",
      features: [
        "All templates unlocked",
        "Unlimited requests",
        "Basic Project management",
        "Access to core agents",
      ],
      ctaText: "Subscribe",
      highlighted: false,
      icon: "Zap",
    },
    {
      name: "Growth",
      price: 799,
      description: "Designed for scaling businesses needing advanced agent capabilities and higher throughput.",
      features: [
        "All templates unlocked",
        "Unlimited requests & revisions",
        "Dedicated Project Manager",
        "Access to all services",
      ],
      ctaText: "Subscribe Now",
      highlighted: true,
      icon: "Rocket",
    },
    {
      name: "Premium",
      price: 1299,
      description: "The ultimate package for corporate entities requiring premium support and custom API integration.",
      features: [
        "All templates unlocked",
        "Unlimited requests (Priority)",
        "Senior Project Manager",
        "Access to all services & API",
      ],
      ctaText: "Subscribe",
      highlighted: false,
      icon: "Crown",
    },
  ] as PricingTier[],
};

// How It Works Data - 4 Steps
export interface Step {
  number: string;
  title: string;
  description: string;
}

export const howItWorksData: Step[] = [
  {
    number: "01",
    title: "Create Your Crew",
    description: "Set up your AI crew in minutes by defining its purpose, configuring settings, and connecting your tools.",
  },
  {
    number: "02",
    title: "Configure & Train",
    description: "Customize your crew's behavior, add your knowledge base, and set up automation workflows.",
  },
  {
    number: "03",
    title: "Deploy & Monitor",
    description: "Launch your crew and watch it handle conversations. Monitor performance in real-time.",
  },
  {
    number: "04",
    title: "Optimize & Scale",
    description: "Use analytics insights to improve performance and scale your operations effortlessly.",
  },
];

// Why AutoCrew Section Data
export interface WhyFeature {
  title: string;
  description: string;
  icon: string;
}

export const whyAutocrewData = {
  badge: "Why AutoCrew",
  title: "Engineered for Autonomy & Impact",
  description: "We don't just automate tasks; we deploy intelligent digital workforces that scale your operations 24/7 without manual intervention.",
  ctaText: "Deploy Your Crew",
  features: [
    {
      title: "Instant Activation",
      description: "Launch fully trained AI crews in minutes. Our pre-built templates for Support and Sales eliminate setup fatigue.",
      icon: "Rocket",
    },
    {
      title: "Enterprise Trust",
      description: "SOC2 Type II compliant infrastructure ensures your customer data remains secure while your AI crews work 24/7.",
      icon: "ShieldCheck",
    },
    {
      title: "Limitless Scale",
      description: "Handle spikes in support tickets or lead volume instantly. Your digital workforce scales from zero to thousands automatically.",
      icon: "Maximize",
    },
    {
      title: "Native Integration",
      description: "Native connectors for your favorite tools. Seamlessly integrate with Slack, email, and CRM via webhooks.",
      icon: "Webhook",
    },
    {
      title: "Smart Handoff",
      description: "Smooth escalation protocols ensure complex queries reach human experts immediately. AI and humans in perfect harmony.",
      icon: "Headphones",
    },
  ] as WhyFeature[],
};

// CTA Section Data - Large Typography Design
export const ctaData = {
  headline: {
    line1: "Ready to build",
    line2: "something extraordinary?",
  },
  email: {
    label: "SEND US AN EMAIL",
    address: "hello@autocrew.com",
  },
  schedule: {
    label: "Schedule a Call",
    ctaText: "Book a Meeting",
  },
  tryIt: {
    label: "Try AutoCrew",
    ctaText: "Start for free",
  },
};

// Navigation Links
export const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/#pricing" },
];

// Footer Data (simplified - just copyright)
export const footerData = {
  copyright: "© 2026 AutoCrew Inc. All rights reserved.",
};

// Dashboard Preview Mock Data (kept for hero section)
export interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: string;
}

export interface LeadInfo {
  name: string;
  initials: string;
  status: string;
  role: string;
  company: string;
  location: string;
  industry: string;
  interestLevel: number;
}

export interface ActiveInstruction {
  number: string;
  text: string;
}

export interface Metric {
  label: string;
  value: string;
  highlighted?: boolean;
}

export interface CrewConfig {
  name: string;
  status: "active" | "inactive";
}

export const dashboardMockData = {
  systemStatus: {
    cpuUsage: 75,
    isOnline: true,
  },
  leadsChart: {
    title: "Inbound Leads (24h)",
    change: "+12%",
    bars: [30, 50, 40, 70, 60, 45, 80, 55, 35, 65],
  },
  activeInstructions: [
    { number: "01", text: "Prioritize lead qualification for enterprise clients" },
    { number: "02", text: "Offer demo scheduling if Interest > 80%" },
    { number: "03", text: "Escalate technical queries to Human Support" },
  ] as ActiveInstruction[],
  channels: ["MessageSquare", "Mail", "Globe", "Slack"],
  leadInfo: {
    name: "John Doe",
    initials: "JD",
    status: "Interested (High)",
    role: "CTO",
    company: "Acme Corp",
    location: "New York, USA",
    industry: "SaaS",
    interestLevel: 85,
  } as LeadInfo,
  securityStatus: [
    { text: "Enterprise Encryption Active", icon: "ShieldCheck" },
    { text: "SOC 2 Compliant", icon: "CheckCircle" },
  ],
  chatMessages: [
    {
      id: "msg-1",
      type: "user",
      content: "How can AutoCrew help automate my customer support?",
      timestamp: "10:23 AM",
    },
    {
      id: "msg-2",
      type: "bot",
      content: "Our Support Crew is designed to handle customer inquiries 24/7. It provides instant responses and resolutions, ensuring your customers are always taken care of without delay. It features multi-language support, sentiment analysis, and seamless handoff to human agents when needed.",
      timestamp: "10:23 AM",
    },
    {
      id: "msg-3",
      type: "user",
      content: "That sounds great. What about lead generation?",
      timestamp: "10:24 AM",
    },
    {
      id: "msg-4",
      type: "bot",
      content: "Our LeadGen Crew automates lead qualification by engaging prospects with personalized conversations. It identifies high-quality leads, schedules appointments, and integrates directly with your CRM. Would you like to deploy a LeadGen Crew now?",
      timestamp: "10:24 AM",
    },
  ] as ChatMessage[],
  quickActions: ["Inquiry", "Response", "Follow-up"],
  analytics: {
    sparklineTitle: "Active Conversations",
    metrics: [
      { label: "Uptime Reliability", value: "99.99%", highlighted: true },
      { label: "Response Time", value: "< 150ms", highlighted: false },
      { label: "Conversations Handled", value: "12,450", highlighted: false },
    ] as Metric[],
    crewConfig: [
      { name: "Support Crew", status: "active" },
      { name: "LeadGen Crew", status: "active" },
    ] as CrewConfig[],
    toneOfVoice: "Professional",
    satisfactionScore: 4.9,
    configOptions: [
      { label: "Configure Custom Prompts", icon: "ChevronRight" },
      { label: "Manage Knowledge Base", icon: "ChevronRight" },
    ],
  },
};

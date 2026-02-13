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

// ============================================
// Dashboard Preview V2 Mock Data
// ============================================

export type DashboardTabId = "chat" | "inbox" | "analytics" | "settings";

export type InquiryChannel = "Chat" | "Voice" | "Email" | "SMS";
export type InquiryStatus = "Resolved" | "In Progress" | "Awaiting";

export interface ChatMessageV2 {
  id: string;
  sender: "bot" | "user";
  content: string;
  timestamp: string;
  isVoiceClip?: boolean;
  voiceDuration?: string;
}

export interface InboxInquiry {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  channel: InquiryChannel;
  status: InquiryStatus;
  isActive: boolean;
  timeAgo: string;
  preview: string;
  agentName: string;
  agentRole: string;
}

export interface AnalyticsStat {
  label: string;
  value: string;
  change: string;
}

export interface BarChartDay {
  day: string;
  chatHeight: number;
  voiceHeight: number;
}

export interface ChannelBreakdown {
  channel: string;
  percentage: number;
  color: string;
}

export interface TopAgent {
  name: string;
  initial: string;
  avatarColor: string;
  conversations: number;
}

export interface SettingToggle {
  label: string;
  description: string;
  enabled: boolean;
}

export interface IntegrationItem {
  name: string;
  icon: string;
  connected: boolean;
}

export const dashboardPreviewData = {
  chat: {
    voicePanel: {
      crewName: "Support Crew",
      agentName: "Robin",
      agentRole: "Support Agent",
      transcripts: [
        "\"I can help you reschedule. Let me pull up your account...\"",
        "\"Your appointment has been moved to March 20th at 10 AM.\"",
        "\"Is there anything else I can help you with today?\"",
        "\"I'll send a confirmation email to your address on file.\"",
      ],
    },
    messages: [
      { id: "m1", sender: "bot", content: "Welcome! I'm Robin, your AI support crew. How can I help you today?", timestamp: "2:12 PM" },
      { id: "m2", sender: "user", content: "I need to reschedule my appointment for next week", timestamp: "2:12 PM" },
      { id: "m3", sender: "bot", content: "I found your appointment for March 15th at 10:00 AM. What date and time works better for you?", timestamp: "2:13 PM" },
      { id: "m4", sender: "user", content: "How about March 20th, same time?", timestamp: "2:13 PM" },
      { id: "m5", sender: "bot", content: "March 20th at 10:00 AM is available. I've rescheduled your appointment. \u2713", timestamp: "2:14 PM", isVoiceClip: true, voiceDuration: "0:04" },
    ] as ChatMessageV2[],
  },

  inbox: {
    inquiries: [
      { id: "i1", name: "Sarah Mitchell", initials: "SM", avatarColor: "from-blue-500 to-blue-600", channel: "Chat", status: "Resolved", isActive: false, timeAgo: "2m ago", preview: "I need to reschedule my appointment for next week, is March 20th available?", agentName: "Robin", agentRole: "Support Agent" },
      { id: "i2", name: "James Donovan", initials: "JD", avatarColor: "from-purple-500 to-purple-600", channel: "Voice", status: "In Progress", isActive: true, timeAgo: "Active", preview: "Calling about billing discrepancy on last month's invoice #INV-2847...", agentName: "Alex", agentRole: "Billing Agent" },
      { id: "i3", name: "Lisa Kowalski", initials: "LK", avatarColor: "from-pink-500 to-pink-600", channel: "Email", status: "Awaiting", isActive: false, timeAgo: "18m ago", preview: "RE: Product return request for order #ORD-9821 — damaged on arrival", agentName: "Robin", agentRole: "Support Agent" },
      { id: "i4", name: "Raj Patel", initials: "RP", avatarColor: "from-amber-500 to-amber-600", channel: "SMS", status: "Resolved", isActive: false, timeAgo: "34m ago", preview: "Can you confirm my subscription renewal date? Account #AC-4421", agentName: "Alex", agentRole: "Billing Agent" },
      { id: "i5", name: "Maria Chen", initials: "MC", avatarColor: "from-teal-500 to-teal-600", channel: "Chat", status: "Resolved", isActive: false, timeAgo: "1h ago", preview: "How do I integrate AutoCrew with my Salesforce CRM? Need API docs.", agentName: "Robin", agentRole: "Support Agent" },
      { id: "i6", name: "Tom Walker", initials: "TW", avatarColor: "from-rose-500 to-rose-600", channel: "Voice", status: "Resolved", isActive: false, timeAgo: "2h ago", preview: "Need to upgrade my plan from Starter to Professional — what's the process?", agentName: "Alex", agentRole: "Billing Agent" },
    ] as InboxInquiry[],
    stats: {
      totalInquiries: 6,
      activeCount: 1,
      avgResponse: "12s",
      csat: "98.2%",
    },
  },

  analytics: {
    stats: [
      { label: "Total Conversations", value: "1,847", change: "\u2191 12.3%" },
      { label: "Avg Response", value: "8.2s", change: "\u2191 24.1%" },
      { label: "Resolution Rate", value: "94.7%", change: "\u2191 3.2%" },
      { label: "CSAT Score", value: "4.9/5", change: "\u2191 0.2" },
    ] as AnalyticsStat[],
    barChart: [
      { day: "Mon", chatHeight: 60, voiceHeight: 40 },
      { day: "Tue", chatHeight: 75, voiceHeight: 35 },
      { day: "Wed", chatHeight: 55, voiceHeight: 45 },
      { day: "Thu", chatHeight: 90, voiceHeight: 30 },
      { day: "Fri", chatHeight: 80, voiceHeight: 38 },
      { day: "Sat", chatHeight: 45, voiceHeight: 50 },
      { day: "Sun", chatHeight: 70, voiceHeight: 42 },
    ] as BarChartDay[],
    channelBreakdown: [
      { channel: "Chat", percentage: 42, color: "#FF6B35" },
      { channel: "Voice", percentage: 28, color: "#10B981" },
      { channel: "Email", percentage: 19, color: "#0EA5E9" },
      { channel: "SMS", percentage: 11, color: "#8B5CF6" },
    ] as ChannelBreakdown[],
    topAgents: [
      { name: "Robin", initial: "R", avatarColor: "from-[#FF6B35] to-[#FF8C5A]", conversations: 847 },
      { name: "Alex", initial: "A", avatarColor: "from-blue-500 to-blue-600", conversations: 623 },
      { name: "Sam", initial: "S", avatarColor: "from-emerald-500 to-emerald-600", conversations: 377 },
    ] as TopAgent[],
  },

  settings: {
    crewConfig: {
      name: "Support Crew",
      type: "Customer Support",
      status: "active" as const,
      model: "GPT-4o",
      temperature: 0.7,
    },
    voiceSettings: {
      provider: "ElevenLabs",
      voice: "Robin — Warm Professional",
      speed: 1.0,
      enabled: true,
    },
    toggles: [
      { label: "Auto-escalation", description: "Route complex queries to humans", enabled: true },
      { label: "Sentiment Analysis", description: "Monitor conversation tone", enabled: true },
      { label: "Lead Scoring", description: "Auto-qualify prospects", enabled: false },
    ] as SettingToggle[],
    integrations: [
      { name: "Slack", icon: "MessageSquare", connected: true },
      { name: "Email", icon: "Mail", connected: true },
      { name: "CRM", icon: "Database", connected: false },
      { name: "Webhooks", icon: "Webhook", connected: true },
    ] as IntegrationItem[],
  },
};

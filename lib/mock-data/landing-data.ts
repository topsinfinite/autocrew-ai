// Hero Section Data
export const heroData = {
  announcement: {
    text: "Now Onboarding Healthcare Practices",
    icon: "ShieldCheck",
  },
  headline: {
    prefix: "Never Miss a",
    accent: "Patient Call Again",
  },
  subheadline:
    "AI voice agents answer every call, book appointments, and check records — HIPAA-aware and live in under a week.",
  primaryCta: {
    text: "Book a Demo",
    href: "https://app.autocrew-ai.com/signup",
  },
  secondaryCta: {
    text: "or watch a 2-min demo",
    href: "/#demo",
    icon: "PlayCircle",
  },
  trustText: "HIPAA Aware  |  EHR Integrated  |  Live in Days",
};

// Stats Data
export interface StatItem {
  value: string;
  label: string;
  sublabel: string;
}

export const statsData: StatItem[] = [
  {
    value: "99.9%",
    label: "Uptime",
    sublabel: "Across all deployments",
  },
  {
    value: "< 2s",
    label: "Response Time",
    sublabel: "Average across voice and chat",
  },
  {
    value: "1k+",
    label: "Conversations",
    sublabel: "Across active deployments",
  },
  {
    value: "95%",
    label: "Satisfaction",
    sublabel: "Post-interaction survey average",
  },
];

// Features Data - 6 Features Grid
export interface Feature {
  title: string;
  description: string;
  icon: string;
  extendedDescription?: string;
}

export const featuresData: Feature[] = [
  {
    title: "HIPAA-Aware Healthcare Agents",
    description:
      "AI voice agents with EHR integration, patient identification, and HIPAA-compliant audit trails for secure healthcare workflows.",
    icon: "Activity",
    extendedDescription:
      "Purpose-built for healthcare practices, our AI agents handle patient appointment scheduling, health record queries, and triage routing while maintaining full HIPAA compliance. Every interaction is encrypted and audit-logged. Integrates with major EHR systems including Epic, Cerner, and Athenahealth.",
  },
  {
    title: "Multi-Channel Voice Access",
    description:
      "Reach your AI agents via phone calls or web voice widgets — same intelligence, multiple touchpoints.",
    icon: "PhoneCall",
    extendedDescription:
      "Patients and customers can reach your AI crew via phone calls, web chat, SMS, or WhatsApp. Voice agents use natural language processing to understand intent and provide human-like responses. Supports call transfer to live agents with full context preservation.",
  },
  {
    title: "Knowledge Base RAG",
    description:
      "AI agents search your knowledge base with vector embeddings for accurate, context-aware responses.",
    icon: "Database",
    extendedDescription:
      "Upload your documentation, FAQs, and policies to create a custom knowledge base. Our retrieval-augmented generation system ensures AI responses are grounded in your actual content, reducing hallucinations and improving accuracy. Automatically stays current as you update your docs.",
  },
  {
    title: "Smart Escalation",
    description:
      "Automatic escalation to human teams with conversation context, urgency levels, and email notifications.",
    icon: "UserCheck",
    extendedDescription:
      "When an interaction exceeds AI capabilities, smart escalation routes the conversation to the right human agent with full context. Escalation rules are customizable by topic, sentiment, or customer tier. Reduces average handle time by providing agents with conversation summaries.",
  },
  {
    title: "Real-Time Analytics",
    description:
      "Track performance metrics, conversation sentiment, and agent effectiveness with comprehensive dashboards.",
    icon: "BarChart3",
    extendedDescription:
      "Monitor your AI crew performance with live dashboards showing resolution rates, response times, customer satisfaction scores, and conversation volumes. Set alerts for anomalies and export reports for stakeholder reviews.",
  },
  {
    title: "Enterprise Security",
    description:
      "AES-256-GCM encryption, JWT authentication, multi-tenant isolation, and comprehensive audit logging.",
    icon: "Shield",
    extendedDescription:
      "SOC 2 Type II compliant infrastructure with end-to-end encryption, role-based access controls, and SSO integration. Data residency options available for EU and APAC regions. Regular third-party penetration testing and vulnerability assessments.",
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
  ctaHref?: string;
}

export const aiCrewsData: AiCrew[] = [
  {
    badge: "Healthcare",
    title: "Healthcare Crew",
    description:
      "HIPAA-aware AI voice agents that integrate with your EHR to help patients check appointments, medications, refill status, and more.",
    features: [
      "EHR/FHIR integration",
      "Patient identification (MRN, DOB)",
      "Comprehensive health data queries",
      "HIPAA-compliant audit trail",
    ],
    ctaText: "Learn More",
    ctaDisabled: false,
    ctaHref: "/docs/healthcare-crew",
  },
  {
    badge: "Support",
    title: "Support Crew",
    description:
      "AI-powered customer support with voice and chat — agents search your knowledge base and escalate to humans when needed.",
    features: [
      "Voice agent via phone & web widget",
      "Knowledge base RAG search",
      "Smart escalation with context",
      "Multi-language support",
    ],
    ctaText: "Learn More",
    ctaDisabled: false,
    ctaHref: "/docs/support-crew",
  },
  {
    badge: "LeadGen",
    title: "LeadGen Crew",
    description:
      "Generate and qualify leads automatically with conversational AI that engages prospects naturally.",
    features: [
      "Proactive lead engagement",
      "Intelligent qualification questions",
      "CRM integration and data sync",
      "Appointment scheduling",
    ],
    ctaText: "Coming Soon",
    ctaDisabled: true,
    ctaHref: "/docs/leadgen-crew",
  },
];

// Contact Sales Data (Replaces Pricing)
export const contactSalesData = {
  badge: "Enterprise Ready",
  title: "Ready to transform your business?",
  description:
    "Whether you're a healthcare provider needing HIPAA compliance or a business scaling support, we have a solution for you.",
  primaryCta: { text: "Contact Sales", href: "/contact" },
  secondaryCta: { text: "View Documentation", href: "/docs" },
  features: [
    "Custom implementation support",
    "SLA guarantees",
    "Dedicated success manager",
    "On-premise deployment options",
  ],
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
    description:
      "Set up your AI crew in minutes by defining its purpose, configuring settings, and connecting your tools.",
  },
  {
    number: "02",
    title: "Configure & Train",
    description:
      "Customize your crew's behavior, add your knowledge base, and set up automation workflows.",
  },
  {
    number: "03",
    title: "Deploy & Monitor",
    description:
      "Launch your crew and watch it handle conversations. Monitor performance in real-time.",
  },
  {
    number: "04",
    title: "Optimize & Scale",
    description:
      "Use analytics insights to improve performance and scale your operations effortlessly.",
  },
];

// Why Autocrew Section Data
// NOTE: Replaced by Stats Section in functionality, but keeping data structure if needed for legacy compatibility
export interface WhyFeature {
  title: string;
  description: string;
  icon: string;
}

export const whyAutocrewData = {
  badge: "Why Autocrew",
  title: "Engineered for Autonomy & Impact",
  description:
    "We don't just automate tasks; we deploy intelligent digital workforces that scale your operations 24/7 without manual intervention.",
  ctaText: "Deploy Your Crew",
  features: [
    {
      title: "Instant Activation",
      description:
        "Launch fully trained AI crews in minutes. Our pre-built templates for Support and Sales eliminate setup fatigue.",
      icon: "Rocket",
    },
    {
      title: "Enterprise Trust",
      description:
        "SOC2 Type II compliant infrastructure ensures your customer data remains secure while your AI crews work 24/7.",
      icon: "ShieldCheck",
    },
    {
      title: "Limitless Scale",
      description:
        "Handle spikes in support tickets or lead volume instantly. Your digital workforce scales from zero to thousands automatically.",
      icon: "Maximize",
    },
    {
      title: "Native Integration",
      description:
        "Native connectors for your favorite tools. Seamlessly integrate with Slack, email, and CRM via webhooks.",
      icon: "Webhook",
    },
    {
      title: "Smart Handoff",
      description:
        "Smooth escalation protocols ensure complex queries reach human experts immediately. AI and humans in perfect harmony.",
      icon: "Headphones",
    },
  ] as WhyFeature[],
};

// CTA Section Data
export const ctaData = {
  headline: {
    line1: "Never Miss Another",
    line2: "Patient Call",
  },
  subheadline:
    "Join healthcare practices using Autocrew for HIPAA-aware patient engagement and 24/7 intelligent support.",
  email: {
    label: "SEND US AN EMAIL",
    address: "support@autocrew-ai.com",
  },
  schedule: {
    label: "Schedule a Demo",
    ctaText: "Book a Demo",
  },
  tryIt: {
    label: "Try Autocrew",
    ctaText: "Request Access",
  },
};

// Navigation Links
export type NavLinkItem =
  | { label: string; href: string }
  | { label: string; children: { label: string; href: string }[] };

export function isDropdownLink(
  link: NavLinkItem,
): link is { label: string; children: { label: string; href: string }[] } {
  return "children" in link;
}

export const navLinks: NavLinkItem[] = [
  { label: "Features", href: "/#features" },
  { label: "Solutions", href: "/#solutions" },
  {
    label: "Industry",
    children: [
      { label: "Coaching", href: "/industry/coaching" },
      { label: "Restaurant", href: "/industry/restaurant" },
      { label: "Legal", href: "/industry/legal" },
      { label: "Healthcare", href: "/industry/healthcare" },
    ],
  },
  { label: "Pricing", href: "/#contact-sales" },
];

// Footer Data (simplified - just copyright)
export const footerData = {
  copyright: "© 2026 Autocrew. All rights reserved.",
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
  avatarUrl?: string;
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
  emailHeight: number;
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
  avatarUrl?: string;
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
      avatarUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face",
      transcripts: [
        '"I can help you reschedule. Let me pull up your account..."',
        '"Your appointment has been moved to March 20th at 10 AM."',
        '"Is there anything else I can help you with today?"',
        '"I\'ll send a confirmation email to your address on file."',
      ],
    },
    messages: [
      {
        id: "m1",
        sender: "bot",
        content:
          "Welcome! I'm Robin, your AI support crew. How can I help you today?",
        timestamp: "2:12 PM",
      },
      {
        id: "m2",
        sender: "user",
        content: "I need to reschedule my appointment for next week",
        timestamp: "2:12 PM",
      },
      {
        id: "m3",
        sender: "bot",
        content:
          "I found your appointment for March 15th at 10:00 AM. What date and time works better for you?",
        timestamp: "2:13 PM",
      },
      {
        id: "m4",
        sender: "user",
        content: "How about March 20th, same time?",
        timestamp: "2:13 PM",
      },
      {
        id: "m5",
        sender: "bot",
        content:
          "March 20th at 10:00 AM is available. I've rescheduled your appointment. \u2713",
        timestamp: "2:14 PM",
        isVoiceClip: true,
        voiceDuration: "0:04",
      },
    ] as ChatMessageV2[],
  },

  inbox: {
    inquiries: [
      {
        id: "i1",
        name: "Sarah Mitchell",
        initials: "SM",
        avatarColor: "from-blue-500 to-blue-600",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
        channel: "Chat",
        status: "Resolved",
        isActive: false,
        timeAgo: "2m ago",
        preview:
          "I need to reschedule my appointment for next week, is March 20th available?",
        agentName: "Robin",
        agentRole: "Support Agent",
      },
      {
        id: "i2",
        name: "James Donovan",
        initials: "JD",
        avatarColor: "from-purple-500 to-purple-600",
        avatarUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
        channel: "Voice",
        status: "In Progress",
        isActive: true,
        timeAgo: "Active",
        preview:
          "Calling about billing discrepancy on last month's invoice #INV-2847...",
        agentName: "Alex",
        agentRole: "Billing Agent",
      },
      {
        id: "i3",
        name: "Lisa Kowalski",
        initials: "LK",
        avatarColor: "from-pink-500 to-pink-600",
        avatarUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
        channel: "Email",
        status: "Awaiting",
        isActive: false,
        timeAgo: "18m ago",
        preview:
          "RE: Product return request for order #ORD-9821 — damaged on arrival",
        agentName: "Robin",
        agentRole: "Support Agent",
      },
      {
        id: "i4",
        name: "Raj Patel",
        initials: "RP",
        avatarColor: "from-amber-500 to-amber-600",
        avatarUrl:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop&crop=face",
        channel: "SMS",
        status: "Resolved",
        isActive: false,
        timeAgo: "34m ago",
        preview:
          "Can you confirm my subscription renewal date? Account #AC-4421",
        agentName: "Alex",
        agentRole: "Billing Agent",
      },
      {
        id: "i5",
        name: "Maria Chen",
        initials: "MC",
        avatarColor: "from-teal-500 to-teal-600",
        avatarUrl:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face",
        channel: "Chat",
        status: "Resolved",
        isActive: false,
        timeAgo: "1h ago",
        preview:
          "How do I integrate Autocrew with my Salesforce CRM? Need API docs.",
        agentName: "Robin",
        agentRole: "Support Agent",
      },
      {
        id: "i6",
        name: "Tom Walker",
        initials: "TW",
        avatarColor: "from-rose-500 to-rose-600",
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
        channel: "Voice",
        status: "Resolved",
        isActive: false,
        timeAgo: "2h ago",
        preview:
          "Need to upgrade my plan from Starter to Professional — what's the process?",
        agentName: "Alex",
        agentRole: "Billing Agent",
      },
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
      { day: "Mon", chatHeight: 60, voiceHeight: 40, emailHeight: 25 },
      { day: "Tue", chatHeight: 75, voiceHeight: 35, emailHeight: 18 },
      { day: "Wed", chatHeight: 55, voiceHeight: 45, emailHeight: 30 },
      { day: "Thu", chatHeight: 90, voiceHeight: 30, emailHeight: 22 },
      { day: "Fri", chatHeight: 80, voiceHeight: 38, emailHeight: 28 },
      { day: "Sat", chatHeight: 45, voiceHeight: 50, emailHeight: 15 },
      { day: "Sun", chatHeight: 70, voiceHeight: 42, emailHeight: 20 },
    ] as BarChartDay[],
    channelBreakdown: [
      { channel: "Chat", percentage: 42, color: "#FF6B35" },
      { channel: "Voice", percentage: 28, color: "#10B981" },
      { channel: "Email", percentage: 19, color: "#0EA5E9" },
      { channel: "SMS", percentage: 11, color: "#8B5CF6" },
    ] as ChannelBreakdown[],
    topAgents: [
      {
        name: "Robin",
        initial: "R",
        avatarColor: "from-[#FF6B35] to-[#FF8C5A]",
        avatarUrl:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face",
        conversations: 847,
      },
      {
        name: "Alex",
        initial: "A",
        avatarColor: "from-blue-500 to-blue-600",
        avatarUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face",
        conversations: 623,
      },
      {
        name: "Sam",
        initial: "S",
        avatarColor: "from-emerald-500 to-emerald-600",
        avatarUrl:
          "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=80&h=80&fit=crop&crop=face",
        conversations: 377,
      },
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
      {
        label: "Auto-escalation",
        description: "Route complex queries to humans",
        enabled: true,
      },
      {
        label: "Sentiment Analysis",
        description: "Monitor conversation tone",
        enabled: true,
      },
      {
        label: "Lead Scoring",
        description: "Auto-qualify prospects",
        enabled: false,
      },
    ] as SettingToggle[],
    integrations: [
      { name: "Slack", icon: "MessageSquare", connected: true },
      { name: "Email", icon: "Mail", connected: true },
      { name: "CRM", icon: "Database", connected: false },
      { name: "Webhooks", icon: "Webhook", connected: true },
    ] as IntegrationItem[],
  },
};

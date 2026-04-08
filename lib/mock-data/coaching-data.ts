import type { StatItem, Step } from "@/lib/mock-data/landing-data";
import type { FAQItem } from "@/lib/mock-data/docs-content";

// Coaching Hero Data
export const coachingHeroData = {
  badge: "For Coaching Professionals",
  headline: {
    prefix: "Scale Your Impact",
    accent: "Without Scaling Yourself",
  },
  subheadline:
    "AI-powered automation handles scheduling, follow-ups, and client intake — so you can focus on the transformational work only you can do.",
  primaryCta: {
    text: "Start Free Trial",
    href: "https://app.autocrew-ai.com/signup",
  },
  secondaryCta: {
    text: "See how it works",
    href: "#how-it-works",
  },
  trustText: "10+ Hours Saved Weekly  ·  35% More Clients  ·  Setup in Days",
  workflowSteps: [
    { label: "Client Books", icon: "CalendarPlus" },
    { label: "AI Confirms", icon: "BotMessageSquare" },
    { label: "You Coach", icon: "Heart" },
  ],
};

// Pain Points Data
export interface CoachingPainPoint {
  title: string;
  description: string;
  icon: string;
}

export const coachingPainPointsData = {
  badge: "The Coaching Challenge",
  headline: "Great Coaches Shouldn't Be Buried in Admin",
  subheadline:
    "The average coach spends 10+ hours per week on scheduling, follow-ups, and client management instead of coaching.",
  items: [
    {
      title: "Scheduling Chaos",
      description:
        "Back-and-forth emails, no-shows, timezone confusion. Your calendar runs your life instead of the other way around.",
      icon: "CalendarX2",
    },
    {
      title: "Leads That Go Cold",
      description:
        "Potential clients reach out but don't hear back for hours. By then, they've found someone else.",
      icon: "UserX",
    },
    {
      title: "Admin Burnout",
      description:
        "Intake forms, follow-up reminders, progress tracking — the admin work scales linearly while your energy doesn't.",
      icon: "Clock",
    },
  ] as CoachingPainPoint[],
};

// Features Data (3 Pillars)
export interface CoachingFeature {
  title: string;
  description: string;
  icon: string;
  bullets: string[];
}

export const coachingFeaturesData = {
  badge: "Your AI-Powered Crew",
  headline: {
    prefix: "Automation That Understands",
    accent: "the Coaching Business",
  },
  items: [
    {
      title: "24/7 Smart Scheduling",
      description:
        "An AI booking agent that handles timezone detection, availability checks, rescheduling, and no-show follow-ups automatically.",
      icon: "Calendar",
      bullets: [
        "Automatic timezone detection",
        "Smart rescheduling",
        "No-show follow-ups",
        "Calendar sync (Google, Outlook)",
      ],
    },
    {
      title: "Automated Client Intake",
      description:
        "AI intake forms that qualify leads, collect information, and prepare you before the first session.",
      icon: "UserCheck",
      bullets: [
        "Custom intake questionnaires",
        "Automatic lead qualification",
        "Pre-session briefing docs",
        "CRM data sync",
      ],
    },
    {
      title: "Intelligent Follow-Ups",
      description:
        "AI that sends personalized follow-ups, tracks client progress, and re-engages dormant clients.",
      icon: "MessageSquare",
      bullets: [
        "Post-session check-ins",
        "Progress milestone nudges",
        "Re-engagement for dormant clients",
        "Content recommendations",
      ],
    },
  ] as CoachingFeature[],
};

// Metrics Data
export const coachingMetrics: StatItem[] = [
  {
    value: "10+",
    label: "Hours Saved",
    sublabel: "Per week on admin tasks",
  },
  {
    value: "35%",
    label: "More Clients",
    sublabel: "Without increasing burnout",
  },
  {
    value: "$3.50",
    label: "ROI per $1",
    sublabel: "Average return on investment",
  },
  {
    value: "30",
    label: "Day Results",
    sublabel: "See measurable impact fast",
  },
];

// How It Works Steps
export const coachingSteps: Step[] = [
  {
    number: "01",
    title: "Tell Us About Your Practice",
    description:
      "Share your coaching style, services, and availability. We configure your AI crew to match your brand voice.",
  },
  {
    number: "02",
    title: "Connect Your Tools",
    description:
      "Link your calendar, email, and CRM. Autocrew integrates with Google Calendar, Outlook, Calendly, and more.",
  },
  {
    number: "03",
    title: "Go Live in Days",
    description:
      "Your AI crew starts handling bookings, intake, and follow-ups. You focus on coaching.",
  },
  {
    number: "04",
    title: "Grow With Confidence",
    description:
      "Use analytics to see what's working. Scale your client base without scaling your hours.",
  },
];

// Testimonials Data
export interface CoachingTestimonial {
  quote: string;
  name: string;
  role: string;
  initials: string;
  avatarColor: string;
}

export const coachingTestimonialsData = {
  badge: "Trusted by Coaches",
  headline: "Coaches Who've Made the Shift",
  items: [
    {
      quote:
        "I went from 15 clients to 22 without hiring an assistant. Autocrew handles all my scheduling and follow-ups.",
      name: "Sarah M.",
      role: "Life Coach",
      initials: "SM",
      avatarColor: "from-[#FF6B35] to-[#FF8C5A]",
    },
    {
      quote:
        "My intake process used to take 45 minutes of admin per client. Now it's fully automated and clients love the experience.",
      name: "David K.",
      role: "Executive Coach",
      initials: "DK",
      avatarColor: "from-blue-500 to-blue-600",
    },
    {
      quote:
        "The follow-up engine is a game-changer. My client retention improved by 40% in the first quarter.",
      name: "Priya R.",
      role: "Health & Wellness Coach",
      initials: "PR",
      avatarColor: "from-emerald-500 to-emerald-600",
    },
  ] as CoachingTestimonial[],
};

// FAQ Data
export const coachingFaqItems: FAQItem[] = [
  {
    question: "Will Autocrew replace the personal touch in my coaching?",
    answer:
      "Not at all. Autocrew handles the administrative side — scheduling, intake forms, follow-up reminders — so you can be more present and focused during actual coaching sessions. AI enhances your practice, it never replaces you.",
  },
  {
    question: "How long does setup take?",
    answer:
      "Most coaches are fully live within 3–5 days. Our team handles the configuration and walks you through connecting your tools. No technical expertise required.",
  },
  {
    question: "What tools does it integrate with?",
    answer:
      "Autocrew integrates with Google Calendar, Outlook, Calendly, Zoom, and major CRMs like HubSpot and Salesforce. We're adding new integrations regularly.",
  },
  {
    question: "Can I customize the client intake questions?",
    answer:
      "Yes, fully customizable. Build questionnaires that match your methodology, coaching style, and the specific information you need before a first session.",
  },
  {
    question: "What happens if a client needs to reach me directly?",
    answer:
      "Smart escalation routes urgent messages to you immediately via your preferred channel — email, SMS, or push notification. You stay in control of what gets escalated.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Yes. We offer a 14-day free trial with full feature access. No credit card required. Start automating your practice today and see the difference.",
  },
];

// CTA Data
export const coachingCtaData = {
  headline: {
    line1: "Stop Doing Admin.",
    line2: "Start Coaching More.",
  },
  subheadline:
    "Join coaches who've reclaimed 10+ hours per week. Start your free trial today.",
  primaryCta: {
    text: "Start Free Trial",
    href: "https://app.autocrew-ai.com/signup",
  },
  secondaryCta: {
    text: "Book a Demo",
    href: "/contact",
  },
};

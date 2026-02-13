export interface DocNavigationItem {
  title: string
  href: string
  items?: DocNavigationItem[]
}

export const docsNavigation: DocNavigationItem[] = [
  {
    title: "Getting Started",
    href: "/docs/getting-started",
  },
  {
    title: "User Guide",
    href: "/docs/user-guide",
  },
  {
    title: "AI Crews",
    href: "#",
    items: [
      {
        title: "Support Crew",
        href: "/docs/support-crew",
      },
      {
        title: "LeadGen Crew",
        href: "/docs/leadgen-crew",
      },
    ],
  },
  {
    title: "FAQ",
    href: "/docs/faq",
  },
  {
    title: "Legal",
    href: "#",
    items: [
      {
        title: "Privacy Policy",
        href: "/docs/privacy",
      },
      {
        title: "Terms of Service",
        href: "/docs/terms",
      },
    ],
  },
]

export interface FAQItem {
  question: string
  answer: string
}

export const faqData: FAQItem[] = [
  {
    question: "What is AutoCrew?",
    answer:
      "AutoCrew is an AI-powered automation platform that provides 24/7 intelligent support and lead generation capabilities for businesses. Our AI crews work around the clock to handle customer inquiries and identify potential leads.",
  },
  {
    question: "How does the Support Crew work?",
    answer:
      "The Support Crew is an AI-powered customer support system that monitors your communication channels, understands customer inquiries, and provides intelligent responses. It can handle common questions, escalate complex issues, and maintain conversation context for seamless interactions.",
  },
  {
    question: "What is the LeadGen Crew?",
    answer:
      "The LeadGen Crew is an AI system designed to identify and qualify potential leads from your customer interactions. It analyzes conversations to detect buying signals, assess lead quality, and automatically captures lead information for your sales team.",
  },
  {
    question: "Can I customize the AI crews for my business?",
    answer:
      "Yes! AutoCrew allows you to customize crew behavior, response templates, and qualification criteria to match your business needs. You can configure tone, language, industry-specific terminology, and integration preferences.",
  },
  {
    question: "What integrations does AutoCrew support?",
    answer:
      "AutoCrew integrates with popular communication platforms including email, live chat, Slack, and more. We also support CRM integrations to sync lead data and customer information seamlessly.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We employ enterprise-grade security measures including end-to-end encryption, secure data storage, and compliance with industry standards. Your data is never shared with third parties, and you maintain full ownership and control.",
  },
  {
    question: "What pricing plans are available?",
    answer:
      "AutoCrew offers three tiers: Starter (basic features for small teams), Professional (advanced features for growing businesses), and Enterprise (full customization and dedicated support for large organizations). Contact our sales team for detailed pricing.",
  },
  {
    question: "How quickly can I get started?",
    answer:
      "You can get started in minutes! Simply sign up, configure your first crew, and connect your communication channels. Our quick start guide walks you through the entire setup process, and our support team is available to help.",
  },
  {
    question: "Do I need technical expertise to use AutoCrew?",
    answer:
      "No technical expertise required! AutoCrew is designed with a user-friendly interface that makes it easy for anyone to set up and manage AI crews. Our comprehensive documentation and support team ensure you can get the most out of the platform.",
  },
  {
    question: "Can I try AutoCrew before committing?",
    answer:
      "Yes! We offer a free trial that gives you access to core features so you can experience AutoCrew's capabilities firsthand. No credit card required to start your trial.",
  },
]

export interface TableOfContentsItem {
  id: string
  title: string
  level: number
}

// Helper function to create a flat route map for navigation
export const getDocRoutes = (): string[] => {
  const routes: string[] = []

  const traverse = (items: DocNavigationItem[]) => {
    items.forEach((item) => {
      if (item.href && item.href !== "#") {
        routes.push(item.href)
      }
      if (item.items) {
        traverse(item.items)
      }
    })
  }

  traverse(docsNavigation)
  return routes
}

// Get a flat map of route paths to page titles
export const getDocTitleMap = (): Record<string, string> => {
  const map: Record<string, string> = {}

  const traverse = (items: DocNavigationItem[]) => {
    items.forEach((item) => {
      if (item.href && item.href !== "#") {
        map[item.href] = item.title
      }
      if (item.items) {
        traverse(item.items)
      }
    })
  }

  traverse(docsNavigation)
  return map
}

// Get previous and next routes for navigation
export const getAdjacentRoutes = (currentPath: string) => {
  const routes = getDocRoutes()
  const currentIndex = routes.indexOf(currentPath)

  return {
    previous: currentIndex > 0 ? routes[currentIndex - 1] : null,
    next: currentIndex < routes.length - 1 ? routes[currentIndex + 1] : null,
  }
}

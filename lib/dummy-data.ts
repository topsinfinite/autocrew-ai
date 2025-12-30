import { Crew, Conversation, Lead, DashboardStats } from "@/types";

// Dummy Crews (distributed across clients)
export const dummyCrews: Crew[] = [
  {
    id: "crew-1",
    clientId: "client-1", // Acme Corporation
    userId: "user-1",
    name: "Customer Support Crew",
    type: "Support",
    n8nWebhookUrl: "https://n8n.example.com/webhook/support-crew-1",
    status: "active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-12-20"),
  },
  {
    id: "crew-2",
    clientId: "client-1", // Acme Corporation
    userId: "user-1",
    name: "Lead Generation Crew - Tech",
    type: "LeadGen",
    n8nWebhookUrl: "https://n8n.example.com/webhook/leadgen-crew-2",
    status: "active",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-12-22"),
  },
  {
    id: "crew-3",
    clientId: "client-1", // Acme Corporation
    userId: "user-1",
    name: "Product Support Crew",
    type: "Support",
    n8nWebhookUrl: "https://n8n.example.com/webhook/support-crew-3",
    status: "active",
    createdAt: new Date("2024-03-10"),
    updatedAt: new Date("2024-12-25"),
  },
  {
    id: "crew-4",
    clientId: "client-2", // TechStart Inc
    userId: "user-1",
    name: "Sales Outreach Crew",
    type: "LeadGen",
    n8nWebhookUrl: "https://n8n.example.com/webhook/leadgen-crew-4",
    status: "active",
    createdAt: new Date("2024-06-15"),
    updatedAt: new Date("2024-11-01"),
  },
  {
    id: "crew-5",
    clientId: "client-2", // TechStart Inc
    userId: "user-1",
    name: "Technical Support Crew",
    type: "Support",
    n8nWebhookUrl: "https://n8n.example.com/webhook/support-crew-5",
    status: "active",
    createdAt: new Date("2024-08-20"),
    updatedAt: new Date("2024-12-28"),
  },
  {
    id: "crew-6",
    clientId: "client-3", // RetailCo
    userId: "user-1",
    name: "Retail Support Crew",
    type: "Support",
    n8nWebhookUrl: "https://n8n.example.com/webhook/support-crew-6",
    status: "active",
    createdAt: new Date("2024-11-10"),
    updatedAt: new Date("2024-12-29"),
  },
  {
    id: "crew-7",
    clientId: "client-4", // FinanceHub
    userId: "user-1",
    name: "Finance Support Crew",
    type: "Support",
    n8nWebhookUrl: "https://n8n.example.com/webhook/support-crew-7",
    status: "active",
    createdAt: new Date("2024-06-08"),
    updatedAt: new Date("2024-12-15"),
  },
  {
    id: "crew-8",
    clientId: "client-4", // FinanceHub
    userId: "user-1",
    name: "Finance LeadGen Crew",
    type: "LeadGen",
    n8nWebhookUrl: "https://n8n.example.com/webhook/leadgen-crew-8",
    status: "active",
    createdAt: new Date("2024-06-15"),
    updatedAt: new Date("2024-12-16"),
  },
  {
    id: "crew-9",
    clientId: "client-5", // HealthTech
    userId: "user-1",
    name: "Healthcare Support Crew",
    type: "Support",
    n8nWebhookUrl: "https://n8n.example.com/webhook/support-crew-9",
    status: "active",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-12-27"),
  },
  {
    id: "crew-10",
    clientId: "client-5", // HealthTech
    userId: "user-1",
    name: "Patient Outreach Crew",
    type: "LeadGen",
    n8nWebhookUrl: "https://n8n.example.com/webhook/leadgen-crew-10",
    status: "active",
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-12-28"),
  },
];

// Dummy Conversations (with client context)
export const dummyConversations: Conversation[] = [
  {
    id: "conv-1",
    clientId: "client-1", // Acme Corporation
    crewId: "crew-1",
    userId: "user-1",
    transcript: [
      {
        role: "user",
        content: "Hi, I'm having trouble logging into my account.",
        timestamp: new Date("2024-12-28T10:30:00"),
      },
      {
        role: "assistant",
        content: "I'd be happy to help you with that. Can you tell me what error message you're seeing?",
        timestamp: new Date("2024-12-28T10:30:15"),
      },
      {
        role: "user",
        content: "It says 'Invalid credentials' but I'm sure my password is correct.",
        timestamp: new Date("2024-12-28T10:31:00"),
      },
      {
        role: "assistant",
        content: "Let me help you reset your password. I'll send a reset link to your registered email address.",
        timestamp: new Date("2024-12-28T10:31:30"),
      },
      {
        role: "user",
        content: "Great, I received it and reset my password. I can log in now. Thank you!",
        timestamp: new Date("2024-12-28T10:35:00"),
      },
    ],
    metadata: {
      customerName: "John Smith",
      customerEmail: "john.smith@example.com",
      sentiment: "positive",
      resolved: true,
      duration: 300,
    },
    createdAt: new Date("2024-12-28T10:30:00"),
  },
  {
    id: "conv-2",
    clientId: "client-1", // Acme Corporation
    crewId: "crew-1",
    userId: "user-1",
    transcript: [
      {
        role: "user",
        content: "Your service is terrible! I've been waiting for a response for hours!",
        timestamp: new Date("2024-12-27T14:20:00"),
      },
      {
        role: "assistant",
        content: "I sincerely apologize for the delay. I'm here to help you now. What issue are you experiencing?",
        timestamp: new Date("2024-12-27T14:20:30"),
      },
      {
        role: "user",
        content: "My subscription was charged twice this month!",
        timestamp: new Date("2024-12-27T14:21:00"),
      },
      {
        role: "assistant",
        content: "I understand your frustration. Let me check your billing history and process a refund for the duplicate charge right away.",
        timestamp: new Date("2024-12-27T14:21:45"),
      },
    ],
    metadata: {
      customerName: "Sarah Johnson",
      customerEmail: "sarah.j@example.com",
      sentiment: "negative",
      resolved: true,
      duration: 180,
    },
    createdAt: new Date("2024-12-27T14:20:00"),
  },
  {
    id: "conv-3",
    clientId: "client-1", // Acme Corporation
    crewId: "crew-2",
    userId: "user-1",
    transcript: [
      {
        role: "assistant",
        content: "Hi! I noticed you've been browsing our enterprise solutions. Would you like to schedule a demo?",
        timestamp: new Date("2024-12-26T09:15:00"),
      },
      {
        role: "user",
        content: "Yes, I'm interested. What features do you offer for teams of 50+?",
        timestamp: new Date("2024-12-26T09:16:00"),
      },
      {
        role: "assistant",
        content: "We offer advanced analytics, SSO, custom integrations, and dedicated support. Can I get your email to send you our enterprise package details?",
        timestamp: new Date("2024-12-26T09:16:30"),
      },
      {
        role: "user",
        content: "Sure, it's michael.brown@techcorp.com",
        timestamp: new Date("2024-12-26T09:17:00"),
      },
    ],
    metadata: {
      customerName: "Michael Brown",
      customerEmail: "michael.brown@techcorp.com",
      sentiment: "positive",
      resolved: false,
      duration: 120,
    },
    createdAt: new Date("2024-12-26T09:15:00"),
  },
  {
    id: "conv-4",
    clientId: "client-1", // Acme Corporation
    crewId: "crew-3",
    userId: "user-1",
    transcript: [
      {
        role: "user",
        content: "How do I export my data?",
        timestamp: new Date("2024-12-25T16:45:00"),
      },
      {
        role: "assistant",
        content: "You can export your data from Settings > Data Management > Export. What format would you prefer?",
        timestamp: new Date("2024-12-25T16:45:20"),
      },
      {
        role: "user",
        content: "CSV would be perfect.",
        timestamp: new Date("2024-12-25T16:46:00"),
      },
      {
        role: "assistant",
        content: "Great! Click the CSV option and your download will start immediately.",
        timestamp: new Date("2024-12-25T16:46:15"),
      },
    ],
    metadata: {
      customerName: "Emily Davis",
      customerEmail: "emily.d@example.com",
      sentiment: "neutral",
      resolved: true,
      duration: 90,
    },
    createdAt: new Date("2024-12-25T16:45:00"),
  },
  {
    id: "conv-5",
    clientId: "client-1", // Acme Corporation
    crewId: "crew-2",
    userId: "user-1",
    transcript: [
      {
        role: "assistant",
        content: "Hi! Are you looking for a solution to streamline your workflow?",
        timestamp: new Date("2024-12-24T11:00:00"),
      },
      {
        role: "user",
        content: "Yes, we're a startup looking for affordable project management tools.",
        timestamp: new Date("2024-12-24T11:01:00"),
      },
      {
        role: "assistant",
        content: "Perfect! We have a startup plan that's 50% off for the first year. Would you like to learn more?",
        timestamp: new Date("2024-12-24T11:01:30"),
      },
    ],
    metadata: {
      customerName: "David Wilson",
      customerEmail: "david.w@startup.io",
      sentiment: "positive",
      resolved: false,
      duration: 90,
    },
    createdAt: new Date("2024-12-24T11:00:00"),
  },
  {
    id: "conv-6",
    clientId: "client-1", // Acme Corporation
    crewId: "crew-1",
    userId: "user-1",
    transcript: [
      {
        role: "user",
        content: "The mobile app keeps crashing when I try to upload files.",
        timestamp: new Date("2024-12-23T13:30:00"),
      },
      {
        role: "assistant",
        content: "I'm sorry to hear that. What type of files are you trying to upload and how large are they?",
        timestamp: new Date("2024-12-23T13:30:30"),
      },
      {
        role: "user",
        content: "PDF files, around 5MB each.",
        timestamp: new Date("2024-12-23T13:31:00"),
      },
      {
        role: "assistant",
        content: "Try updating to the latest version of the app (v2.1.3). This issue was fixed in the recent update.",
        timestamp: new Date("2024-12-23T13:31:45"),
      },
      {
        role: "user",
        content: "That worked! Thanks!",
        timestamp: new Date("2024-12-23T13:35:00"),
      },
    ],
    metadata: {
      customerName: "Lisa Anderson",
      customerEmail: "lisa.a@example.com",
      sentiment: "positive",
      resolved: true,
      duration: 300,
    },
    createdAt: new Date("2024-12-23T13:30:00"),
  },
];

// Dummy Leads (with client context)
export const dummyLeads: Lead[] = [
  {
    id: "lead-1",
    clientId: "client-1", // Acme Corporation
    crewId: "crew-2",
    email: "michael.brown@techcorp.com",
    name: "Michael Brown",
    data: {
      phone: "+1-555-0123",
      company: "TechCorp Inc",
      position: "CTO",
      interest: "Enterprise Solutions",
      source: "Website Chat",
    },
    status: "qualified",
    createdAt: new Date("2024-12-26T09:17:00"),
  },
  {
    id: "lead-2",
    clientId: "client-1", // Acme Corporation
    crewId: "crew-2",
    email: "david.w@startup.io",
    name: "David Wilson",
    data: {
      phone: "+1-555-0124",
      company: "Startup.io",
      position: "Founder",
      interest: "Startup Plan",
      source: "Website Chat",
    },
    status: "new",
    createdAt: new Date("2024-12-24T11:01:30"),
  },
  {
    id: "lead-3",
    clientId: "client-2", // TechStart Inc
    crewId: "crew-4",
    email: "jennifer.lee@design.com",
    name: "Jennifer Lee",
    data: {
      phone: "+1-555-0125",
      company: "Design Co",
      position: "Design Director",
      interest: "Creative Tools",
      source: "Email Campaign",
    },
    status: "contacted",
    createdAt: new Date("2024-12-22T15:30:00"),
  },
  {
    id: "lead-4",
    clientId: "client-1", // Acme Corporation
    crewId: "crew-2",
    email: "robert.taylor@finance.com",
    name: "Robert Taylor",
    data: {
      phone: "+1-555-0126",
      company: "Finance Solutions",
      position: "VP Operations",
      interest: "API Integration",
      source: "Webinar",
    },
    status: "qualified",
    createdAt: new Date("2024-12-21T10:00:00"),
  },
  {
    id: "lead-5",
    clientId: "client-1", // Acme Corporation
    crewId: "crew-2",
    email: "amanda.garcia@retail.com",
    name: "Amanda Garcia",
    data: {
      phone: "+1-555-0127",
      company: "Retail Plus",
      position: "IT Manager",
      interest: "E-commerce Integration",
      source: "Google Ads",
    },
    status: "converted",
    createdAt: new Date("2024-12-20T14:20:00"),
  },
  {
    id: "lead-6",
    clientId: "client-2", // TechStart Inc
    crewId: "crew-4",
    email: "james.martinez@consulting.com",
    name: "James Martinez",
    data: {
      phone: "+1-555-0128",
      company: "Martinez Consulting",
      position: "Senior Consultant",
      interest: "Professional Services",
      source: "LinkedIn",
    },
    status: "new",
    createdAt: new Date("2024-12-19T09:45:00"),
  },
];

// Dashboard Stats with time-series data
export const dummyDashboardStats: DashboardStats = {
  totalCrews: dummyCrews.length,
  activeCrews: dummyCrews.filter((c) => c.status === "active").length,
  totalConversations: dummyConversations.length,
  totalLeads: dummyLeads.length,
  conversationVolume: [
    { date: "2024-12-19", count: 8 },
    { date: "2024-12-20", count: 12 },
    { date: "2024-12-21", count: 15 },
    { date: "2024-12-22", count: 10 },
    { date: "2024-12-23", count: 14 },
    { date: "2024-12-24", count: 9 },
    { date: "2024-12-25", count: 7 },
    { date: "2024-12-26", count: 18 },
    { date: "2024-12-27", count: 16 },
    { date: "2024-12-28", count: 20 },
  ],
  leadsGenerated: [
    { date: "2024-12-19", count: 2 },
    { date: "2024-12-20", count: 3 },
    { date: "2024-12-21", count: 1 },
    { date: "2024-12-22", count: 2 },
    { date: "2024-12-23", count: 0 },
    { date: "2024-12-24", count: 1 },
    { date: "2024-12-25", count: 0 },
    { date: "2024-12-26", count: 4 },
    { date: "2024-12-27", count: 2 },
    { date: "2024-12-28", count: 1 },
  ],
};

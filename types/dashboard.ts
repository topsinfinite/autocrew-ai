// Dashboard statistics and analytics types

export interface DashboardStats {
  totalCrews: number;
  activeCrews: number;
  totalConversations: number;
  totalLeads: number;
  conversationVolume: {
    date: string;
    count: number;
  }[];
  leadsGenerated: {
    date: string;
    count: number;
  }[];
}

// Conversation and message types

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export type ConversationStatus = "pending" | "completed";

export interface Conversation {
  id: string;
  clientId: string; // Multi-tenant support
  crewId: string;
  userId: string;
  transcript: ConversationMessage[];
  metadata: {
    customerName?: string;
    customerEmail?: string;
    sentiment?: "positive" | "neutral" | "negative";
    status?: ConversationStatus;
    resolved?: boolean;
    duration?: number; // in seconds
  };
  createdAt: Date;
}

export type MessageRole = "user" | "assistant";
export type ConversationSentiment = "positive" | "neutral" | "negative";

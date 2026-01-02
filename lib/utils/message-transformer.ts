import type { ConversationMessage } from '@/types';

// n8n message format from histories table
interface N8nMessage {
  type: 'human' | 'ai' | 'system';
  content: string;
  additional_kwargs?: Record<string, unknown>;
  response_metadata?: Record<string, unknown>;
}

interface HistoriesRow {
  id: number;
  session_id: string;
  message: N8nMessage;
  created_at: Date;
}

/**
 * Transform n8n message to ConversationMessage
 * Maps: 'human' -> 'user', 'ai' -> 'assistant'
 */
export function transformN8nMessage(
  message: N8nMessage,
  timestamp: Date
): ConversationMessage {
  return {
    role: message.type === 'human' ? 'user' : 'assistant',
    content: message.content,
    timestamp,
  };
}

/**
 * Transform histories rows to transcript
 */
export function transformHistoriesToTranscript(
  rows: HistoriesRow[]
): ConversationMessage[] {
  return rows
    .map((row) => transformN8nMessage(row.message, row.created_at))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
}

/**
 * Calculate conversation duration (in seconds)
 */
export function calculateDuration(transcript: ConversationMessage[]): number {
  if (transcript.length < 2) return 0;
  const first = transcript[0].timestamp.getTime();
  const last = transcript[transcript.length - 1].timestamp.getTime();
  return Math.floor((last - first) / 1000);
}

/**
 * Analyze sentiment from transcript
 * Uses keyword-based analysis for now
 */
export function analyzeSentiment(
  transcript: ConversationMessage[]
): 'positive' | 'neutral' | 'negative' {
  const content = transcript.map((m) => m.content.toLowerCase()).join(' ');

  const positive = ['thank', 'great', 'excellent', 'perfect', 'amazing', 'helpful', 'appreciate', 'wonderful'];
  const negative = ['terrible', 'awful', 'bad', 'horrible', 'useless', 'disappointed', 'frustrated', 'angry'];

  const posCount = positive.filter((k) => content.includes(k)).length;
  const negCount = negative.filter((k) => content.includes(k)).length;

  if (posCount > negCount) return 'positive';
  if (negCount > posCount) return 'negative';
  return 'neutral';
}

/**
 * Extract customer email from transcript
 */
export function extractCustomerEmail(transcript: ConversationMessage[]): string | undefined {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  for (const msg of transcript) {
    if (msg.role === 'user') {
      const emails = msg.content.match(emailRegex);
      if (emails?.[0]) return emails[0];
    }
  }
  return undefined;
}

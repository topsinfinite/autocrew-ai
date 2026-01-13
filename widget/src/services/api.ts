/**
 * n8n webhook communication service
 */

import type { ChatRequest, ChatResponse, ChatMetadata } from '../types';

/**
 * Send a message to the n8n Chat Trigger webhook
 */
export async function sendMessage(
  webhookUrl: string,
  sessionId: string,
  message: string,
  metadata?: ChatMetadata
): Promise<string> {
  const request: ChatRequest = {
    action: 'sendMessage',
    sessionId,
    chatInput: message,
    ...(metadata && { metadata }),
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  // Handle different response formats
  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    const data: ChatResponse = await response.json();

    // n8n Chat Trigger returns { output: "message" }
    if (typeof data.output === 'string') {
      return data.output;
    }

    // Handle array response (some n8n configurations)
    if (Array.isArray(data)) {
      const firstItem = data[0];
      if (firstItem?.output) {
        return firstItem.output;
      }
    }

    // Fallback: stringify the response
    return JSON.stringify(data);
  }

  // Plain text response
  return response.text();
}

/**
 * Retry configuration
 */
const RETRY_CONFIG = {
  maxRetries: 2,
  baseDelay: 1000,
};

/**
 * Send message with retry logic
 */
export async function sendMessageWithRetry(
  webhookUrl: string,
  sessionId: string,
  message: string,
  metadata?: ChatMetadata
): Promise<string> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= RETRY_CONFIG.maxRetries; attempt++) {
    try {
      return await sendMessage(webhookUrl, sessionId, message, metadata);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on client errors (4xx)
      if (lastError.message.includes('4')) {
        throw lastError;
      }

      // Wait before retrying
      if (attempt < RETRY_CONFIG.maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, RETRY_CONFIG.baseDelay * (attempt + 1))
        );
      }
    }
  }

  throw lastError || new Error('Failed to send message');
}

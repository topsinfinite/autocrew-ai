/**
 * Session ID generation utility
 */

/**
 * Generate a unique session ID
 * Format: ac_<timestamp>_<random>
 */
export function generateSessionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `ac_${timestamp}_${random}`;
}

/**
 * Generate a unique message ID
 */
export function generateMessageId(): string {
  return `msg_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
}

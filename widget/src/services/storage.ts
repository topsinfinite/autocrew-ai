/**
 * localStorage management service
 */

import type { Message, StoredSession } from '../types';
import { WIDGET_DEFAULTS } from '../types';
import { generateSessionId } from '../utils/session';

const STORAGE_PREFIX = 'autocrew_';

/**
 * Get storage key for a crew
 */
function getStorageKey(crewCode: string): string {
  return `${STORAGE_PREFIX}${crewCode}`;
}

/**
 * Get visited key for first launch tracking
 */
function getVisitedKey(crewCode: string): string {
  return `${STORAGE_PREFIX}visited_${crewCode}`;
}

/**
 * Load session from localStorage
 */
export function loadSession(crewCode: string): StoredSession | null {
  try {
    const data = localStorage.getItem(getStorageKey(crewCode));
    if (!data) return null;

    const session: StoredSession = JSON.parse(data);

    // Check if session has expired
    if (Date.now() - session.createdAt > WIDGET_DEFAULTS.SESSION_MAX_AGE) {
      localStorage.removeItem(getStorageKey(crewCode));
      return null;
    }

    return session;
  } catch {
    // localStorage might be disabled or corrupted
    return null;
  }
}

/**
 * Save session to localStorage
 */
export function saveSession(session: StoredSession): void {
  try {
    localStorage.setItem(getStorageKey(session.crewCode), JSON.stringify(session));
  } catch {
    // localStorage might be full or disabled - continue without persistence
    console.warn('[AutoCrew] Unable to save session to localStorage');
  }
}

/**
 * Get or create a session for a crew
 */
export function getOrCreateSession(crewCode: string): StoredSession {
  const existing = loadSession(crewCode);
  if (existing) {
    return existing;
  }

  const newSession: StoredSession = {
    sessionId: generateSessionId(),
    crewCode,
    messages: [],
    createdAt: Date.now(),
  };

  saveSession(newSession);
  return newSession;
}

/**
 * Add a message to the session
 */
export function addMessageToSession(crewCode: string, message: Message): void {
  const session = loadSession(crewCode);
  if (!session) return;

  session.messages.push(message);

  // Limit stored messages to prevent localStorage overflow
  const MAX_STORED_MESSAGES = 50;
  if (session.messages.length > MAX_STORED_MESSAGES) {
    session.messages = session.messages.slice(-MAX_STORED_MESSAGES);
  }

  saveSession(session);
}

/**
 * Clear session for a crew
 */
export function clearSession(crewCode: string): void {
  try {
    localStorage.removeItem(getStorageKey(crewCode));
  } catch {
    // Ignore errors
  }
}

/**
 * Check if this is the first visit for a crew
 */
export function isFirstVisit(crewCode: string): boolean {
  try {
    return !localStorage.getItem(getVisitedKey(crewCode));
  } catch {
    return true;
  }
}

/**
 * Mark crew as visited
 */
export function markAsVisited(crewCode: string): void {
  try {
    localStorage.setItem(getVisitedKey(crewCode), 'true');
  } catch {
    // Ignore errors
  }
}

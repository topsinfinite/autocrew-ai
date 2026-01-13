/**
 * Message bubble component
 */

import { createElement, nl2br } from '../utils/dom';
import type { Message } from '../types';

/**
 * Format timestamp for display
 */
function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Create a message bubble element
 */
export function createMessageBubble(message: Message): HTMLElement {
  const container = createElement('div', {
    className: `ac-message ${message.role}`,
    'data-message-id': message.id,
  });

  const bubble = createElement('div', { className: 'ac-message-bubble' });
  bubble.innerHTML = nl2br(message.content);

  const time = createElement('div', { className: 'ac-message-time' }, [
    formatTime(message.timestamp),
  ]);

  container.appendChild(bubble);
  container.appendChild(time);

  return container;
}

/**
 * Render all messages to container
 */
export function renderMessages(
  container: HTMLElement,
  messages: Message[]
): void {
  // Clear existing messages
  container.innerHTML = '';

  // Add all messages
  messages.forEach((message) => {
    const bubble = createMessageBubble(message);
    container.appendChild(bubble);
  });
}

/**
 * Append a single message to container
 */
export function appendMessage(
  container: HTMLElement,
  message: Message
): void {
  const bubble = createMessageBubble(message);
  container.appendChild(bubble);
}

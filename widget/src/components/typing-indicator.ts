/**
 * Typing indicator component
 */

import { createElement } from '../utils/dom';

/**
 * Create the typing indicator element
 */
export function createTypingIndicator(): HTMLElement {
  const container = createElement('div', {
    className: 'ac-typing',
    role: 'status',
    'aria-label': 'Assistant is typing',
  });

  for (let i = 0; i < 3; i++) {
    const dot = createElement('div', { className: 'ac-typing-dot' });
    container.appendChild(dot);
  }

  return container;
}

/**
 * Show typing indicator in messages container
 */
export function showTypingIndicator(container: HTMLElement): HTMLElement {
  const indicator = createTypingIndicator();
  container.appendChild(indicator);
  return indicator;
}

/**
 * Remove typing indicator
 */
export function hideTypingIndicator(indicator: HTMLElement | null): void {
  if (indicator && indicator.parentNode) {
    indicator.parentNode.removeChild(indicator);
  }
}

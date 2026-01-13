/**
 * Greeting bubble component
 */

import { createElement, escapeHtml } from '../utils/dom';

export interface GreetingBubbleCallbacks {
  onClick: () => void;
  onClose: () => void;
}

/**
 * Create the greeting bubble element
 */
export function createGreetingBubble(
  message: string,
  callbacks: GreetingBubbleCallbacks
): HTMLElement {
  const container = createElement('div', {
    className: 'ac-greeting',
    role: 'button',
    'aria-label': 'Open chat',
    tabindex: '0',
  });

  const text = createElement('p', { className: 'ac-greeting-text' });
  text.innerHTML = escapeHtml(message);

  const closeBtn = createElement('button', {
    className: 'ac-greeting-close',
    'aria-label': 'Dismiss greeting',
  });
  closeBtn.textContent = '×';

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    callbacks.onClose();
  });

  container.addEventListener('click', () => {
    callbacks.onClick();
  });

  container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callbacks.onClick();
    }
  });

  container.appendChild(text);
  container.appendChild(closeBtn);

  return container;
}

/**
 * Remove greeting bubble
 */
export function removeGreetingBubble(bubble: HTMLElement | null): void {
  if (bubble && bubble.parentNode) {
    bubble.parentNode.removeChild(bubble);
  }
}

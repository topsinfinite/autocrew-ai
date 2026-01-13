/**
 * Floating chat button component
 */

import { createElement } from '../utils/dom';

// Chat icon SVG
const CHAT_ICON = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12z"/>
    <path d="M7 9h10v2H7zm0-3h10v2H7zm0 6h7v2H7z"/>
  </svg>
`;

// Close icon SVG
const CLOSE_ICON = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
`;

export interface ChatButtonCallbacks {
  onToggle: () => void;
}

/**
 * Create the floating chat button
 */
export function createChatButton(callbacks: ChatButtonCallbacks): HTMLButtonElement {
  const button = createElement('button', {
    className: 'ac-button',
    'aria-label': 'Open chat',
    'aria-expanded': 'false',
  });

  button.innerHTML = CHAT_ICON;

  button.addEventListener('click', () => {
    callbacks.onToggle();
  });

  return button;
}

/**
 * Update button state (open/closed)
 */
export function updateChatButton(button: HTMLButtonElement, isOpen: boolean): void {
  button.innerHTML = isOpen ? CLOSE_ICON : CHAT_ICON;
  button.setAttribute('aria-expanded', String(isOpen));
  button.setAttribute('aria-label', isOpen ? 'Close chat' : 'Open chat');
  button.classList.toggle('open', isOpen);
}

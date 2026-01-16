/**
 * Main chat window component
 */

import { createElement } from '../utils/dom';

// Close icon SVG
const CLOSE_ICON = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
  </svg>
`;

// Send icon SVG
const SEND_ICON = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
  </svg>
`;

// New chat icon SVG (refresh/restart)
const NEW_CHAT_ICON = `
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
  </svg>
`;

export interface ChatWindowCallbacks {
  onClose: () => void;
  onSend: (message: string) => void;
  onNewChat: () => void;
}

export interface ChatWindowElements {
  window: HTMLElement;
  messagesContainer: HTMLElement;
  actionsContainer: HTMLElement;
  disclaimerContainer: HTMLElement;
  input: HTMLTextAreaElement;
  sendButton: HTMLButtonElement;
}

/**
 * Create the chat window
 */
export function createChatWindow(
  title: string,
  subtitle: string,
  callbacks: ChatWindowCallbacks
): ChatWindowElements {
  // Create main window container
  const windowEl = createElement('div', { className: 'ac-window' });

  // Header
  const header = createElement('div', { className: 'ac-header' });

  const headerContent = createElement('div', { className: 'ac-header-content' });
  const titleEl = createElement('h2', { className: 'ac-header-title' }, [title]);
  headerContent.appendChild(titleEl);

  if (subtitle) {
    const subtitleEl = createElement('p', { className: 'ac-header-subtitle' }, [subtitle]);
    headerContent.appendChild(subtitleEl);
  }

  // Header buttons container
  const headerButtons = createElement('div', { className: 'ac-header-buttons' });

  const newChatBtn = createElement('button', {
    className: 'ac-new-chat-btn',
    'aria-label': 'Start new chat',
    title: 'Start new chat',
  });
  newChatBtn.innerHTML = NEW_CHAT_ICON;
  newChatBtn.addEventListener('click', callbacks.onNewChat);

  const closeBtn = createElement('button', {
    className: 'ac-close-btn',
    'aria-label': 'Close chat',
  });
  closeBtn.innerHTML = CLOSE_ICON;
  closeBtn.addEventListener('click', callbacks.onClose);

  headerButtons.appendChild(newChatBtn);
  headerButtons.appendChild(closeBtn);

  header.appendChild(headerContent);
  header.appendChild(headerButtons);

  // Messages container
  const messagesContainer = createElement('div', {
    className: 'ac-messages',
    role: 'log',
    'aria-live': 'polite',
    'aria-label': 'Chat messages',
  });

  // Actions container (for suggested action buttons)
  const actionsContainer = createElement('div', {
    className: 'ac-actions-wrapper',
  });

  // Disclaimer container
  const disclaimerContainer = createElement('div', {
    className: 'ac-disclaimer',
  });

  // Input area
  const inputArea = createElement('div', { className: 'ac-input-area' });

  const inputWrapper = createElement('div', { className: 'ac-input-wrapper' });

  const input = document.createElement('textarea');
  input.className = 'ac-input';
  input.placeholder = 'Type a message...';
  input.rows = 1;
  input.setAttribute('aria-label', 'Message input');

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  // Handle Enter key (send on Enter, new line on Shift+Enter)
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const message = input.value.trim();
      if (message) {
        callbacks.onSend(message);
        input.value = '';
        input.style.height = 'auto';
      }
    }
  });

  inputWrapper.appendChild(input);

  const sendButton = createElement('button', {
    className: 'ac-send-btn',
    'aria-label': 'Send message',
  }) as HTMLButtonElement;
  sendButton.innerHTML = SEND_ICON;
  sendButton.addEventListener('click', () => {
    const message = input.value.trim();
    if (message) {
      callbacks.onSend(message);
      input.value = '';
      input.style.height = 'auto';
    }
  });

  inputArea.appendChild(inputWrapper);
  inputArea.appendChild(sendButton);

  // Assemble window
  windowEl.appendChild(header);
  windowEl.appendChild(messagesContainer);
  windowEl.appendChild(actionsContainer);
  windowEl.appendChild(disclaimerContainer);
  windowEl.appendChild(inputArea);

  // Handle Escape key
  windowEl.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      callbacks.onClose();
    }
  });

  return {
    window: windowEl,
    messagesContainer,
    actionsContainer,
    disclaimerContainer,
    input: input as HTMLTextAreaElement,
    sendButton: sendButton,
  };
}

/**
 * Update window visibility
 */
export function updateChatWindow(windowEl: HTMLElement, isOpen: boolean): void {
  windowEl.classList.toggle('open', isOpen);
}

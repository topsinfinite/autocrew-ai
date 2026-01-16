/**
 * All widget styles aggregated
 */

import { generateCSSVariables } from './variables';
import type { WidgetTheme, WidgetPosition } from '../types';

/**
 * Generate all CSS for the widget
 */
export function generateStyles(
  primaryColor: string,
  theme: WidgetTheme,
  position: WidgetPosition
): string {
  const variables = generateCSSVariables(primaryColor, theme);
  const positionStyles = position === 'bottom-left' ? 'left: 20px;' : 'right: 20px;';

  return `
    ${variables}

    /* Reset */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Chat Button */
    .ac-button {
      position: fixed;
      bottom: 20px;
      ${positionStyles}
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--ac-primary);
      border: none;
      cursor: pointer;
      box-shadow: var(--ac-shadow);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s ease, background 0.2s ease;
      z-index: 9999;
    }

    .ac-button:hover {
      background: var(--ac-primary-hover);
      transform: scale(1.05);
    }

    .ac-button:focus {
      outline: 2px solid var(--ac-primary);
      outline-offset: 2px;
    }

    .ac-button svg {
      width: 28px;
      height: 28px;
      fill: var(--ac-primary-text);
      transition: transform 0.2s ease;
    }

    .ac-button.open svg {
      transform: rotate(90deg);
    }

    /* Chat Window */
    .ac-window {
      position: fixed;
      bottom: 90px;
      ${positionStyles}
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 520px;
      max-height: calc(100vh - 120px);
      background: var(--ac-bg);
      border-radius: 16px;
      box-shadow: var(--ac-shadow);
      display: none;
      flex-direction: column;
      overflow: hidden;
      z-index: 9998;
      border: 1px solid var(--ac-border);
    }

    .ac-window.open {
      display: flex;
      animation: slideUp 0.3s ease;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Header */
    .ac-header {
      padding: 16px;
      background: var(--ac-primary);
      color: var(--ac-primary-text);
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
    }

    .ac-header-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .ac-header-title {
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }

    .ac-header-subtitle {
      font-size: 12px;
      opacity: 0.9;
      margin: 0;
    }

    .ac-header-buttons {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .ac-new-chat-btn,
    .ac-close-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.2s ease;
    }

    .ac-new-chat-btn:hover,
    .ac-close-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .ac-new-chat-btn svg,
    .ac-close-btn svg {
      width: 20px;
      height: 20px;
      fill: var(--ac-primary-text);
    }

    .ac-new-chat-btn svg {
      width: 18px;
      height: 18px;
    }

    /* Messages Area */
    .ac-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: var(--ac-bg-secondary);
    }

    .ac-messages::-webkit-scrollbar {
      width: 6px;
    }

    .ac-messages::-webkit-scrollbar-track {
      background: transparent;
    }

    .ac-messages::-webkit-scrollbar-thumb {
      background: var(--ac-border);
      border-radius: 3px;
    }

    /* Message Bubble */
    .ac-message {
      display: flex;
      flex-direction: column;
      max-width: 85%;
    }

    .ac-message.user {
      align-self: flex-end;
    }

    .ac-message.assistant {
      align-self: flex-start;
    }

    .ac-message-bubble {
      padding: 10px 14px;
      border-radius: 16px;
      word-wrap: break-word;
      white-space: pre-wrap;
    }

    .ac-message.user .ac-message-bubble {
      background: var(--ac-user-bubble);
      color: var(--ac-user-text);
      border-bottom-right-radius: 4px;
    }

    .ac-message.assistant .ac-message-bubble {
      background: var(--ac-bot-bubble);
      color: var(--ac-bot-text);
      border-bottom-left-radius: 4px;
    }

    .ac-message-time {
      font-size: 10px;
      color: var(--ac-text-muted);
      margin-top: 4px;
      padding: 0 4px;
    }

    .ac-message.user .ac-message-time {
      text-align: right;
    }

    /* Typing Indicator */
    .ac-typing {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 12px 16px;
      background: var(--ac-bot-bubble);
      border-radius: 16px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
    }

    .ac-typing-dot {
      width: 8px;
      height: 8px;
      background: var(--ac-text-muted);
      border-radius: 50%;
      animation: typingBounce 1.4s ease-in-out infinite;
    }

    .ac-typing-dot:nth-child(1) { animation-delay: 0s; }
    .ac-typing-dot:nth-child(2) { animation-delay: 0.2s; }
    .ac-typing-dot:nth-child(3) { animation-delay: 0.4s; }

    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-6px); }
    }

    /* Actions Wrapper */
    .ac-actions-wrapper {
      flex-shrink: 0;
    }

    /* Suggested Actions */
    .ac-suggested-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding: 12px 16px;
      background: var(--ac-bg-secondary);
      border-top: 1px solid var(--ac-border);
    }

    .ac-action-btn {
      padding: 8px 16px;
      border-radius: 20px;
      border: 1px solid var(--ac-border);
      background: var(--ac-bg);
      color: var(--ac-text);
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
    }

    .ac-action-btn:hover {
      border-color: var(--ac-primary);
      color: var(--ac-primary);
      background: var(--ac-bg);
    }

    .ac-action-btn:focus {
      outline: 2px solid var(--ac-primary);
      outline-offset: 2px;
    }

    .ac-action-btn:active {
      transform: scale(0.98);
    }

    /* Disclaimer */
    .ac-disclaimer {
      padding: 8px 16px;
      background: var(--ac-bg-secondary);
      text-align: center;
      flex-shrink: 0;
    }

    .ac-disclaimer:empty {
      display: none;
    }

    .ac-disclaimer p {
      font-size: 11px;
      line-height: 1.4;
      color: var(--ac-text-muted);
      margin: 0;
    }

    /* Input Area */
    .ac-input-area {
      padding: 12px 16px;
      background: var(--ac-bg);
      border-top: 1px solid var(--ac-border);
      display: flex;
      gap: 8px;
      align-items: flex-end;
      flex-shrink: 0;
    }

    .ac-input-wrapper {
      flex: 1;
      position: relative;
    }

    .ac-input {
      width: 100%;
      padding: 10px 14px;
      border: 1px solid var(--ac-input-border);
      border-radius: 20px;
      background: var(--ac-input-bg);
      color: var(--ac-text);
      font-size: 14px;
      font-family: inherit;
      resize: none;
      max-height: 100px;
      outline: none;
      transition: border-color 0.2s ease;
    }

    .ac-input:focus {
      border-color: var(--ac-input-focus);
    }

    .ac-input::placeholder {
      color: var(--ac-text-muted);
    }

    .ac-send-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--ac-primary);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s ease, opacity 0.2s ease;
      flex-shrink: 0;
    }

    .ac-send-btn:hover:not(:disabled) {
      background: var(--ac-primary-hover);
    }

    .ac-send-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .ac-send-btn svg {
      width: 18px;
      height: 18px;
      fill: var(--ac-primary-text);
    }

    /* Greeting Bubble */
    .ac-greeting {
      position: fixed;
      bottom: 90px;
      ${positionStyles}
      max-width: 280px;
      padding: 12px 16px;
      background: var(--ac-bg);
      border-radius: 16px;
      border-bottom-right-radius: ${position === 'bottom-left' ? '16px' : '4px'};
      border-bottom-left-radius: ${position === 'bottom-left' ? '4px' : '16px'};
      box-shadow: var(--ac-shadow);
      z-index: 9997;
      cursor: pointer;
      transition: transform 0.2s ease;
      animation: slideIn 0.3s ease;
      border: 1px solid var(--ac-border);
    }

    .ac-greeting:hover {
      transform: scale(1.02);
    }

    .ac-greeting-text {
      color: var(--ac-text);
      font-size: 14px;
      margin: 0;
    }

    .ac-greeting-close {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: var(--ac-bg-tertiary);
      border: 1px solid var(--ac-border);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: var(--ac-text-muted);
    }

    .ac-greeting-close:hover {
      background: var(--ac-border);
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(10px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Error Message */
    .ac-error {
      padding: 10px 14px;
      background: #fee2e2;
      color: #dc2626;
      border-radius: 8px;
      font-size: 13px;
      text-align: center;
      margin: 8px 0;
    }

    /* Mobile Responsive */
    @media (max-width: 420px) {
      .ac-window {
        width: calc(100vw - 20px);
        height: calc(100vh - 100px);
        bottom: 80px;
        left: 10px;
        right: 10px;
        border-radius: 12px;
      }

      .ac-button {
        width: 56px;
        height: 56px;
      }

      .ac-greeting {
        left: 10px;
        right: 70px;
        max-width: none;
      }
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .ac-window.open,
      .ac-greeting,
      .ac-button,
      .ac-button svg {
        animation: none;
        transition: none;
      }

      .ac-typing-dot {
        animation: none;
      }
    }
  `;
}

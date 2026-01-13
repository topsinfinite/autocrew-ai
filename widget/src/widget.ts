/**
 * Main AutoCrew Widget Class
 */

import type { AutoCrewConfig, WidgetState, Message, ChatMetadata } from './types';
import { WIDGET_DEFAULTS } from './types';
import { generateStyles } from './styles';
import { createChatButton, updateChatButton } from './components/chat-button';
import { createChatWindow, updateChatWindow, ChatWindowElements } from './components/chat-window';
import { renderMessages, appendMessage } from './components/message-bubble';
import { showTypingIndicator, hideTypingIndicator } from './components/typing-indicator';
import { createGreetingBubble, removeGreetingBubble } from './components/greeting-bubble';
import { sendMessageWithRetry } from './services/api';
import {
  getOrCreateSession,
  addMessageToSession,
  isFirstVisit,
  markAsVisited,
} from './services/storage';
import { generateMessageId } from './utils/session';
import { scrollToBottom } from './utils/dom';

export class AutoCrewWidget {
  private config: Required<Omit<AutoCrewConfig, 'metadata' | 'agentName'>> & {
    metadata: ChatMetadata;
    agentName: string;
  };
  private container: HTMLElement;
  private shadowRoot: ShadowRoot;
  private state: WidgetState;

  // UI Elements
  private button: HTMLButtonElement | null = null;
  private windowElements: ChatWindowElements | null = null;
  private greetingBubble: HTMLElement | null = null;
  private typingIndicator: HTMLElement | null = null;

  constructor(config: AutoCrewConfig) {
    // Build metadata (use provided or generate from crewCode/clientId)
    const metadata: ChatMetadata = config.metadata || {
      client_id: config.clientId,
      crew_code: config.crewCode,
      agent_name: config.agentName,
      environment: typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'development'
        : 'production',
    };

    // Merge with defaults
    this.config = {
      webhookUrl: config.webhookUrl,
      crewCode: config.crewCode,
      clientId: config.clientId,
      metadata,
      agentName: config.agentName || config.metadata?.agent_name || '',
      primaryColor: config.primaryColor || WIDGET_DEFAULTS.PRIMARY_COLOR,
      position: config.position || WIDGET_DEFAULTS.POSITION,
      theme: config.theme || WIDGET_DEFAULTS.THEME,
      title: config.title || WIDGET_DEFAULTS.TITLE,
      subtitle: config.subtitle || WIDGET_DEFAULTS.SUBTITLE,
      welcomeMessage: config.welcomeMessage || WIDGET_DEFAULTS.WELCOME_MESSAGE,
      firstLaunchAction: config.firstLaunchAction || WIDGET_DEFAULTS.FIRST_LAUNCH_ACTION,
      greetingDelay: config.greetingDelay ?? WIDGET_DEFAULTS.GREETING_DELAY,
    };

    // Load or create session
    const session = getOrCreateSession(this.config.crewCode);

    // Initialize state
    this.state = {
      isOpen: false,
      isLoading: false,
      messages: session.messages,
      sessionId: session.sessionId,
      error: null,
    };

    // Create container and shadow DOM
    this.container = document.createElement('div');
    this.container.id = 'autocrew-widget';
    this.shadowRoot = this.container.attachShadow({ mode: 'closed' });

    // Initialize
    this.injectStyles();
    this.render();
    this.attachToDOM();
    this.handleFirstLaunch();
    this.setupThemeListener();
  }

  /**
   * Inject styles into shadow DOM
   */
  private injectStyles(): void {
    const styleEl = document.createElement('style');
    styleEl.textContent = generateStyles(
      this.config.primaryColor,
      this.config.theme,
      this.config.position
    );
    this.shadowRoot.appendChild(styleEl);
  }

  /**
   * Render the widget UI
   */
  private render(): void {
    // Create chat button
    this.button = createChatButton({
      onToggle: () => this.toggle(),
    });

    // Create chat window
    this.windowElements = createChatWindow(
      this.config.title,
      this.config.subtitle,
      {
        onClose: () => this.close(),
        onSend: (message) => this.handleSendMessage(message),
      }
    );

    // Add welcome message if no messages exist
    if (this.state.messages.length === 0 && this.config.welcomeMessage) {
      const welcomeMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: this.config.welcomeMessage,
        timestamp: Date.now(),
      };
      this.state.messages.push(welcomeMessage);
      addMessageToSession(this.config.crewCode, welcomeMessage);
    }

    // Render existing messages
    renderMessages(this.windowElements.messagesContainer, this.state.messages);

    // Append to shadow DOM
    this.shadowRoot.appendChild(this.button);
    this.shadowRoot.appendChild(this.windowElements.window);
  }

  /**
   * Attach widget to document body
   */
  private attachToDOM(): void {
    document.body.appendChild(this.container);
  }

  /**
   * Handle first launch behaviors
   */
  private handleFirstLaunch(): void {
    if (!isFirstVisit(this.config.crewCode)) {
      return;
    }

    markAsVisited(this.config.crewCode);

    switch (this.config.firstLaunchAction) {
      case 'auto-open':
        setTimeout(() => this.open(), 500);
        break;

      case 'show-greeting':
        setTimeout(() => this.showGreeting(), this.config.greetingDelay);
        break;

      case 'none':
      default:
        // Do nothing
        break;
    }
  }

  /**
   * Setup theme change listener for auto theme
   */
  private setupThemeListener(): void {
    if (this.config.theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      this.updateStyles();
    });
  }

  /**
   * Update styles (for theme changes)
   */
  private updateStyles(): void {
    const styleEl = this.shadowRoot.querySelector('style');
    if (styleEl) {
      styleEl.textContent = generateStyles(
        this.config.primaryColor,
        this.config.theme,
        this.config.position
      );
    }
  }

  /**
   * Toggle widget open/closed
   */
  public toggle(): void {
    if (this.state.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  /**
   * Open the chat window
   */
  public open(): void {
    this.state.isOpen = true;

    // Hide greeting bubble if showing
    if (this.greetingBubble) {
      removeGreetingBubble(this.greetingBubble);
      this.greetingBubble = null;
    }

    // Update UI
    if (this.button) {
      updateChatButton(this.button, true);
    }
    if (this.windowElements) {
      updateChatWindow(this.windowElements.window, true);
      // Focus input
      setTimeout(() => {
        this.windowElements?.input.focus();
      }, 100);
      // Scroll to bottom
      scrollToBottom(this.windowElements.messagesContainer);
    }
  }

  /**
   * Close the chat window
   */
  public close(): void {
    this.state.isOpen = false;

    if (this.button) {
      updateChatButton(this.button, false);
      this.button.focus();
    }
    if (this.windowElements) {
      updateChatWindow(this.windowElements.window, false);
    }
  }

  /**
   * Show greeting bubble
   */
  private showGreeting(): void {
    if (this.state.isOpen || this.greetingBubble) return;

    this.greetingBubble = createGreetingBubble(this.config.welcomeMessage, {
      onClick: () => {
        removeGreetingBubble(this.greetingBubble);
        this.greetingBubble = null;
        this.open();
      },
      onClose: () => {
        removeGreetingBubble(this.greetingBubble);
        this.greetingBubble = null;
      },
    });

    this.shadowRoot.appendChild(this.greetingBubble);
  }

  /**
   * Handle sending a message
   */
  private async handleSendMessage(content: string): Promise<void> {
    if (!content.trim() || this.state.isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: generateMessageId(),
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
    };

    this.state.messages.push(userMessage);
    addMessageToSession(this.config.crewCode, userMessage);

    if (this.windowElements) {
      appendMessage(this.windowElements.messagesContainer, userMessage);
      scrollToBottom(this.windowElements.messagesContainer);
    }

    // Show loading state
    this.state.isLoading = true;
    this.state.error = null;
    this.updateInputState();

    if (this.windowElements) {
      this.typingIndicator = showTypingIndicator(this.windowElements.messagesContainer);
      scrollToBottom(this.windowElements.messagesContainer);
    }

    try {
      // Send to webhook with metadata
      const response = await sendMessageWithRetry(
        this.config.webhookUrl,
        this.state.sessionId,
        content.trim(),
        this.config.metadata
      );

      // Hide typing indicator
      hideTypingIndicator(this.typingIndicator);
      this.typingIndicator = null;

      // Add assistant message
      const assistantMessage: Message = {
        id: generateMessageId(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      this.state.messages.push(assistantMessage);
      addMessageToSession(this.config.crewCode, assistantMessage);

      if (this.windowElements) {
        appendMessage(this.windowElements.messagesContainer, assistantMessage);
        scrollToBottom(this.windowElements.messagesContainer);
      }
    } catch (error) {
      // Hide typing indicator
      hideTypingIndicator(this.typingIndicator);
      this.typingIndicator = null;

      // Show error
      this.state.error = error instanceof Error ? error.message : 'Failed to send message';
      this.showError(this.state.error);
    } finally {
      this.state.isLoading = false;
      this.updateInputState();
    }
  }

  /**
   * Update input field state (enabled/disabled)
   */
  private updateInputState(): void {
    if (this.windowElements) {
      this.windowElements.input.disabled = this.state.isLoading;
      this.windowElements.sendButton.disabled = this.state.isLoading;
    }
  }

  /**
   * Show an error message in the chat
   */
  private showError(message: string): void {
    if (!this.windowElements) return;

    const errorEl = document.createElement('div');
    errorEl.className = 'ac-error';
    errorEl.textContent = `Error: ${message}. Please try again.`;
    this.windowElements.messagesContainer.appendChild(errorEl);
    scrollToBottom(this.windowElements.messagesContainer);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (errorEl.parentNode) {
        errorEl.parentNode.removeChild(errorEl);
      }
    }, 5000);
  }

  /**
   * Destroy the widget
   */
  public destroy(): void {
    if (this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

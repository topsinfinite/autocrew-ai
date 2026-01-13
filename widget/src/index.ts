/**
 * AutoCrew Chat Widget Entry Point
 *
 * This is the main entry point for the embeddable chat widget.
 * It reads configuration from window.AutoCrewConfig and initializes the widget.
 *
 * Usage:
 * <script>
 *   window.AutoCrewConfig = {
 *     webhookUrl: 'https://your-n8n-webhook-url',
 *     crewCode: 'CREW-001',
 *     clientId: 'CLIENT-001',
 *     // Optional customization...
 *   };
 * </script>
 * <script src="https://widget.autocrew.ai/widget.js" async></script>
 */

import { AutoCrewWidget } from './widget';
import type { AutoCrewConfig } from './types';

/**
 * Validate the configuration object
 */
function validateConfig(config: unknown): config is AutoCrewConfig {
  if (!config || typeof config !== 'object') {
    return false;
  }

  const c = config as Record<string, unknown>;

  // Required fields
  if (typeof c.webhookUrl !== 'string' || !c.webhookUrl) {
    console.error('[AutoCrew Widget] Missing required field: webhookUrl');
    return false;
  }

  if (typeof c.crewCode !== 'string' || !c.crewCode) {
    console.error('[AutoCrew Widget] Missing required field: crewCode');
    return false;
  }

  if (typeof c.clientId !== 'string' || !c.clientId) {
    console.error('[AutoCrew Widget] Missing required field: clientId');
    return false;
  }

  // Validate optional fields if provided
  if (c.primaryColor !== undefined && typeof c.primaryColor !== 'string') {
    console.warn('[AutoCrew Widget] Invalid primaryColor, using default');
  }

  if (c.position !== undefined && !['bottom-right', 'bottom-left'].includes(c.position as string)) {
    console.warn('[AutoCrew Widget] Invalid position, using default');
  }

  if (c.theme !== undefined && !['light', 'dark', 'auto'].includes(c.theme as string)) {
    console.warn('[AutoCrew Widget] Invalid theme, using default');
  }

  if (c.firstLaunchAction !== undefined && !['none', 'auto-open', 'show-greeting'].includes(c.firstLaunchAction as string)) {
    console.warn('[AutoCrew Widget] Invalid firstLaunchAction, using default');
  }

  return true;
}

/**
 * Initialize the widget
 */
function initWidget(config: AutoCrewConfig): AutoCrewWidget {
  const widget = new AutoCrewWidget(config);

  // Expose widget instance for debugging (only in development)
  if (process.env.NODE_ENV === 'development') {
    (window as unknown as Record<string, unknown>).__autocrewWidget = widget;
  }

  return widget;
}

/**
 * Main initialization
 */
(function () {
  // Prevent double initialization
  if (window.__autocrewWidgetInitialized) {
    console.warn('[AutoCrew Widget] Already initialized');
    return;
  }

  // Get configuration
  const config = window.AutoCrewConfig;

  if (!config) {
    console.error('[AutoCrew Widget] No configuration found. Please set window.AutoCrewConfig before loading the widget.');
    return;
  }

  // Validate configuration
  if (!validateConfig(config)) {
    console.error('[AutoCrew Widget] Invalid configuration. Widget not loaded.');
    return;
  }

  // Initialize when DOM is ready
  const init = () => {
    try {
      initWidget(config);
      window.__autocrewWidgetInitialized = true;
      console.log('[AutoCrew Widget] Initialized successfully');
    } catch (error) {
      console.error('[AutoCrew Widget] Failed to initialize:', error);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

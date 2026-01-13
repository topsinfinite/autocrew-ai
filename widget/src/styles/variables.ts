/**
 * CSS Variable generation for themes
 */

import { darken } from '../utils/color';
import type { WidgetTheme } from '../types';

/**
 * Resolve theme based on system preference
 */
export function resolveTheme(theme: WidgetTheme): 'light' | 'dark' {
  if (theme !== 'auto') return theme;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/**
 * Generate CSS variables based on config
 */
export function generateCSSVariables(primaryColor: string, theme: WidgetTheme): string {
  const resolvedTheme = resolveTheme(theme);
  const primaryHover = darken(primaryColor, 10);

  if (resolvedTheme === 'dark') {
    return `
      :host {
        --ac-primary: ${primaryColor};
        --ac-primary-hover: ${primaryHover};
        --ac-primary-text: #ffffff;
        --ac-bg: #1e293b;
        --ac-bg-secondary: #334155;
        --ac-bg-tertiary: #475569;
        --ac-text: #f1f5f9;
        --ac-text-muted: #94a3b8;
        --ac-border: #475569;
        --ac-user-bubble: ${primaryColor};
        --ac-user-text: #ffffff;
        --ac-bot-bubble: #334155;
        --ac-bot-text: #f1f5f9;
        --ac-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5);
        --ac-input-bg: #334155;
        --ac-input-border: #475569;
        --ac-input-focus: ${primaryColor};
      }
    `;
  }

  // Light theme
  return `
    :host {
      --ac-primary: ${primaryColor};
      --ac-primary-hover: ${primaryHover};
      --ac-primary-text: #ffffff;
      --ac-bg: #ffffff;
      --ac-bg-secondary: #f8fafc;
      --ac-bg-tertiary: #f1f5f9;
      --ac-text: #1e293b;
      --ac-text-muted: #64748b;
      --ac-border: #e2e8f0;
      --ac-user-bubble: ${primaryColor};
      --ac-user-text: #ffffff;
      --ac-bot-bubble: #f1f5f9;
      --ac-bot-text: #1e293b;
      --ac-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15);
      --ac-input-bg: #ffffff;
      --ac-input-border: #e2e8f0;
      --ac-input-focus: ${primaryColor};
    }
  `;
}

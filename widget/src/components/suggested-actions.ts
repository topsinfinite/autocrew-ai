/**
 * Suggested actions component
 * Renders quick action buttons below the welcome message
 */

import { createElement } from '../utils/dom';
import type { SuggestedAction } from '../types';

export interface SuggestedActionsCallbacks {
  onActionClick: (action: SuggestedAction) => void;
}

export interface SuggestedActionsElements {
  container: HTMLElement;
  hide: () => void;
  show: () => void;
}

/**
 * Create the suggested actions container with buttons
 */
export function createSuggestedActions(
  actions: SuggestedAction[],
  callbacks: SuggestedActionsCallbacks
): SuggestedActionsElements {
  const container = createElement('div', {
    className: 'ac-suggested-actions',
    role: 'group',
    'aria-label': 'Suggested actions',
  });

  // Create buttons for each action
  actions.forEach((action) => {
    const button = createElement('button', {
      className: 'ac-action-btn',
      type: 'button',
    }, [action.label]);

    button.addEventListener('click', () => {
      callbacks.onActionClick(action);
    });

    container.appendChild(button);
  });

  return {
    container,
    hide: () => {
      container.style.display = 'none';
    },
    show: () => {
      container.style.display = 'flex';
    },
  };
}

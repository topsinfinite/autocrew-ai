/**
 * DOM manipulation utilities
 */

/**
 * Create an element with attributes and children
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: Record<string, string>,
  children?: (Node | string)[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);

  if (attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'className') {
        el.className = value;
      } else if (key.startsWith('data-')) {
        el.setAttribute(key, value);
      } else {
        el.setAttribute(key, value);
      }
    });
  }

  if (children) {
    children.forEach((child) => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    });
  }

  return el;
}

/**
 * Escape HTML to prevent XSS
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Convert newlines to <br> tags (safely)
 */
export function nl2br(text: string): string {
  return escapeHtml(text).replace(/\n/g, '<br>');
}

/**
 * Scroll element to bottom
 */
export function scrollToBottom(element: HTMLElement): void {
  element.scrollTop = element.scrollHeight;
}

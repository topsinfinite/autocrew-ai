/**
 * Global Type Declarations
 *
 * This file extends the Window interface with third-party library globals.
 */

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized?: boolean;
      init?: () => void;
    };
  }
}

export {};

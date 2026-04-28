"use client";
import { createContext, useContext, useMemo } from "react";
import { ACCENT_TOKENS, DISPLAY_STYLES, type AccentToken, type DisplayStyle } from "@/lib/deck/tokens";

type DeckTheme = {
  accent: AccentToken;
  displayStyle: DisplayStyle;
};

const DeckThemeContext = createContext<DeckTheme>({ accent: "green", displayStyle: "serif-italic" });

export function DeckThemeProvider({
  accent,
  displayStyle,
  children,
}: DeckTheme & { children: React.ReactNode }) {
  const value = useMemo(() => ({ accent, displayStyle }), [accent, displayStyle]);
  const accentHex = ACCENT_TOKENS[accent].hex;
  const display = DISPLAY_STYLES[displayStyle];

  return (
    <DeckThemeContext.Provider value={value}>
      <div
        style={
          {
            "--deck-accent": accentHex,
            "--deck-display-family": display.family,
            "--deck-display-style": display.style,
            "--deck-display-weight": display.weight,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </DeckThemeContext.Provider>
  );
}

export function useDeckTheme(): DeckTheme {
  return useContext(DeckThemeContext);
}

"use client";

import { useEffect, useState } from "react";
import { ThemeContext, type Theme } from "@/lib/contexts/theme-context";
import { useLocalStorage } from "@/lib/hooks/use-local-storage";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "dark",
}: ThemeProviderProps) {
  const [theme, setTheme] = useLocalStorage<Theme>("theme", defaultTheme);
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("dark");

  // Determine the effective theme based on system preference
  useEffect(() => {
    const updateEffectiveTheme = () => {
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        setEffectiveTheme(systemTheme);
      } else {
        setEffectiveTheme(theme);
      }
    };

    updateEffectiveTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        updateEffectiveTheme();
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Apply theme attribute
    root.setAttribute("data-theme", effectiveTheme);
  }, [effectiveTheme]);

  // Clean up legacy mockUser data from localStorage (one-time cleanup)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Remove old mock user data that was used before Better Auth integration
      localStorage.removeItem('mockUser');
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

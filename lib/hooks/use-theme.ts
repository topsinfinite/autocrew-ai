"use client";

import { useThemeContext } from "@/lib/contexts/theme-context";

export function useTheme() {
  return useThemeContext();
}

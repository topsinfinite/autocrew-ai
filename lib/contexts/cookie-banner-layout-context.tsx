"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

export type CookieBannerLayoutContextValue = {
  fabStackBottomPx: number | null;
  setFabStackBottomPx: Dispatch<SetStateAction<number | null>>;
};

const CookieBannerLayoutContext =
  createContext<CookieBannerLayoutContextValue | null>(null);

export function CookieBannerLayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fabStackBottomPx, setFabStackBottomPx] = useState<number | null>(null);

  const value = useMemo(
    () => ({ fabStackBottomPx, setFabStackBottomPx }),
    [fabStackBottomPx],
  );

  return (
    <CookieBannerLayoutContext.Provider value={value}>
      {children}
    </CookieBannerLayoutContext.Provider>
  );
}

export function useCookieBannerLayout() {
  const ctx = useContext(CookieBannerLayoutContext);
  if (!ctx) {
    throw new Error(
      "useCookieBannerLayout must be used within CookieBannerLayoutProvider",
    );
  }
  return ctx;
}

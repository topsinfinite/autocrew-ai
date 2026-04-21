"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";
import Link from "next/link";
import { useConsent } from "@/lib/hooks/use-consent";
import { useCookieBannerLayout } from "@/lib/contexts/cookie-banner-layout-context";
import { Button } from "@/components/ui/button";

const FAB_GAP_ABOVE_BANNER_PX = 12;

export function CookieBanner() {
  const { hasConsented, acceptAll, openPreferences } = useConsent();
  const { setFabStackBottomPx } = useCookieBannerLayout();
  const [visible, setVisible] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (hasConsented) return;
    const timer = setTimeout(() => setVisible(true), 1000);
    return () => clearTimeout(timer);
  }, [hasConsented]);

  const bannerShown = !hasConsented && visible;

  useLayoutEffect(() => {
    if (!bannerShown) {
      setFabStackBottomPx(null);
      return;
    }

    const el = bannerRef.current;
    if (!el) {
      setFabStackBottomPx(null);
      return;
    }

    const update = () => {
      const top = el.getBoundingClientRect().top;
      setFabStackBottomPx(
        Math.max(0, window.innerHeight - top + FAB_GAP_ABOVE_BANNER_PX),
      );
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      setFabStackBottomPx(null);
    };
  }, [bannerShown, setFabStackBottomPx]);

  if (hasConsented || !visible) return null;

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-label="Cookie consent"
      data-contextual-ai="off"
      className="fixed bottom-4 left-4 right-4 sm:right-auto sm:left-6 sm:bottom-6 z-[90] sm:max-w-sm rounded-xl bg-card/80 backdrop-blur-xl border border-border/50 p-4 shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-4 fade-in duration-500"
    >
      <p className="text-sm text-muted-foreground leading-relaxed">
        We use cookies to improve your experience.{" "}
        <Link
          href="/docs/privacy"
          className="text-primary hover:underline underline-offset-2"
        >
          Learn more
        </Link>
      </p>
      <div className="flex items-center justify-end gap-2 mt-3">
        <Button variant="ghost" size="sm" onClick={openPreferences}>
          Manage
        </Button>
        <Button variant="pill" size="pill-sm" onClick={acceptAll}>
          Accept All
        </Button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { APP_CONFIG } from "@/lib/constants";
import { useCookieBannerLayout } from "@/lib/contexts/cookie-banner-layout-context";
import { cn } from "@/lib/utils";

export function PhoneCallFab() {
  const { fabStackBottomPx } = useCookieBannerLayout();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  const useStackOffset = hydrated && fabStackBottomPx != null;

  return (
    <div
      data-contextual-ai="off"
      className={cn(
        "lg:hidden fixed z-[80] max-w-[calc(100vw-2rem)] transition-[bottom,left] duration-300 ease-out",
        useStackOffset
          ? "left-4 sm:left-6"
          : "bottom-5 left-4 sm:bottom-6 sm:left-6",
      )}
      style={useStackOffset ? { bottom: fabStackBottomPx } : undefined}
    >
      <div className="relative inline-flex max-w-full">
        <span className="phone-fab-ripple absolute inset-0 z-0" aria-hidden />
        <span
          className="phone-fab-ripple phone-fab-ripple-delay absolute inset-0 z-0"
          aria-hidden
        />
        <Link
          href={APP_CONFIG.supportPhoneTel}
          className={cn(
            "relative z-[1] flex min-h-[52px] items-center gap-2.5 rounded-full pl-3.5 pr-4 py-2",
            "bg-primary text-primary-foreground shadow-lg shadow-primary/30",
            "hover:bg-primary/90 active:scale-[0.98] transition-transform",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          )}
          aria-label={`Speak to Sarah, ${APP_CONFIG.speakToSarahSubtitle}, call us`}
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
            <Phone className="h-5 w-5" aria-hidden />
          </span>
          <span className="flex min-w-0 flex-col items-start text-left leading-tight">
            <span className="font-space-grotesk text-sm font-semibold tracking-tight">
              Speak to Sarah
            </span>
            <span className="font-geist text-[10px] font-normal opacity-90 max-w-[9.5rem] leading-snug">
              {APP_CONFIG.speakToSarahSubtitle}
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}

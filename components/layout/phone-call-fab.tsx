"use client";

import Link from "next/link";
import { Phone } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { useConsent } from "@/lib/hooks/use-consent";
import { cn } from "@/lib/utils";

export function PhoneCallFab() {
  const { hasConsented } = useConsent();

  return (
    <Link
      href={APP_CONFIG.supportPhoneTel}
      className={cn(
        "lg:hidden fixed left-4 z-[80] flex h-14 w-14 min-h-[56px] min-w-[56px] items-center justify-center rounded-full",
        "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
        "hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "transition-[bottom] duration-300",
        hasConsented ? "bottom-4 sm:bottom-6" : "bottom-44 sm:bottom-40",
      )}
      aria-label="Speak to Autocrew, call us"
    >
      <Phone className="h-6 w-6 shrink-0" aria-hidden />
    </Link>
  );
}

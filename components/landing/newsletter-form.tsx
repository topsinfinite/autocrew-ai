"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type UtmParams = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
};

function getUtmParams(): UtmParams {
  if (typeof window === "undefined") {
    return {
      utm_source: "autocrew-ai",
      utm_medium: "signup-form",
      utm_campaign: "launch",
    };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "autocrew-ai",
    utm_medium: params.get("utm_medium") || "signup-form",
    utm_campaign: params.get("utm_campaign") || "launch",
  };
}

export function NewsletterForm({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const utmRef = useRef<UtmParams | null>(null);

  useEffect(() => {
    const utms = getUtmParams();
    utmRef.current = utms;
    const hasCustomUtms = Object.entries(utms).some(
      ([key, value]) =>
        (key === "utm_source" && value !== "autocrew-ai") ||
        (key === "utm_medium" && value !== "signup-form") ||
        (key === "utm_campaign" && value !== "launch"),
    );
    if (hasCustomUtms) {
      try {
        sessionStorage.setItem("autocrew_utms", JSON.stringify(utms));
      } catch {}
    } else {
      try {
        const stored = sessionStorage.getItem("autocrew_utms");
        if (stored) utmRef.current = JSON.parse(stored);
      } catch {}
    }
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          ...(utmRef.current ?? {}),
        }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error || "Something went wrong. Please try again.",
        );
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Unable to sign up. Please try again.",
      );
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/20 px-6 py-3.5",
          className,
        )}
      >
        <CheckCircle2 className="w-5 h-5 text-[#FF6B35] shrink-0" />
        <span className="text-sm font-medium text-foreground font-geist">
          You&apos;re on the list! We&apos;ll reach out before launch.
        </span>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-md", className)}>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          disabled={status === "submitting"}
          className="flex-1 min-w-0 h-12 rounded-full border border-border bg-background/50 dark:bg-input/30 px-5 text-sm font-geist text-foreground placeholder:text-muted-foreground outline-none focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 transition-all disabled:opacity-50"
        />
        <Button
          type="submit"
          variant="pill"
          disabled={status === "submitting"}
          className="h-12 px-6 shrink-0"
        >
          {status === "submitting" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Get Early Access
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
      {status === "error" && errorMessage && (
        <p className="mt-2 text-sm text-red-400 font-geist pl-5">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

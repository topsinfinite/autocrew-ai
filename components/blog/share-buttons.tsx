"use client";

import { useState } from "react";
import { Linkedin, Twitter, Mail, Link2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  title: string;
  url: string;
  /** "inline" — compact icon row (header). "block" — labeled row with prompt (bottom). */
  variant?: "inline" | "block";
  className?: string;
}

function buildShareUrl(platform: string, url: string) {
  const params = new URLSearchParams({
    utm_source: platform,
    utm_medium: "share",
    utm_campaign: "blog",
  });
  // Preserve any existing hash but replace/add query string
  try {
    const u = new URL(url);
    // Merge existing params with utm overrides
    const existing = new URLSearchParams(u.search);
    params.forEach((v, k) => existing.set(k, v));
    u.search = existing.toString();
    return u.toString();
  } catch {
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}${params.toString()}`;
  }
}

export function ShareButtons({ title, url, variant = "inline", className }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(buildShareUrl("linkedin", url))}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(buildShareUrl("twitter", url))}&text=${encodeURIComponent(title)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${title}\n\n${buildShareUrl("email", url)}`)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl("copy-link", url));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = buildShareUrl("copy-link", url);
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // give up silently
      }
      document.body.removeChild(textarea);
    }
  };

  const iconBase =
    "inline-flex items-center justify-center w-9 h-9 border border-[rgba(26,20,16,0.18)] text-[hsl(25,10%,32%)] transition-colors hover:text-[hsl(16,100%,50%)] hover:border-[hsl(16,100%,50%)]";

  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <a
          href={linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className={iconBase}
        >
          <Linkedin className="w-4 h-4" strokeWidth={1.5} aria-hidden />
        </a>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className={iconBase}
        >
          <Twitter className="w-4 h-4" strokeWidth={1.5} aria-hidden />
        </a>
        <a
          href={emailUrl}
          aria-label="Share via email"
          className={iconBase}
        >
          <Mail className="w-4 h-4" strokeWidth={1.5} aria-hidden />
        </a>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "Link copied" : "Copy link"}
          className={cn(
            iconBase,
            copied && "text-[hsl(16,100%,50%)] border-[hsl(16,100%,50%)]",
          )}
        >
          {copied ? (
            <Check className="w-4 h-4" strokeWidth={1.5} aria-hidden />
          ) : (
            <Link2 className="w-4 h-4" strokeWidth={1.5} aria-hidden />
          )}
        </button>
      </div>
    );
  }

  // variant === "block" — labeled row with prompt for bottom of article
  const buttonBase =
    "inline-flex items-center gap-2 px-4 py-2.5 border border-[rgba(26,20,16,0.18)] text-[13px] font-sans text-[hsl(25,10%,32%)] transition-colors hover:text-[hsl(16,100%,50%)] hover:border-[hsl(16,100%,50%)]";

  return (
    <div className={cn("border-y border-[rgba(26,20,16,0.12)] py-8 my-12", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <p className="font-display text-lg font-semibold text-[hsl(20,26%,8%)] tracking-tight">
            Found this useful?
          </p>
          <p className="font-sans text-sm text-[hsl(25,10%,45%)] mt-1">
            Share it with someone who needs to read it.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonBase}
          >
            <Linkedin className="w-4 h-4" strokeWidth={1.5} aria-hidden />
            <span>LinkedIn</span>
          </a>
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonBase}
          >
            <Twitter className="w-4 h-4" strokeWidth={1.5} aria-hidden />
            <span>X</span>
          </a>
          <a href={emailUrl} className={buttonBase}>
            <Mail className="w-4 h-4" strokeWidth={1.5} aria-hidden />
            <span>Email</span>
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className={cn(
              buttonBase,
              copied && "text-[hsl(16,100%,50%)] border-[hsl(16,100%,50%)]",
            )}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" strokeWidth={1.5} aria-hidden />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Link2 className="w-4 h-4" strokeWidth={1.5} aria-hidden />
                <span>Copy link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

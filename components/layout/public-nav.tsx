"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { navLinks } from "@/lib/mock-data/landing-data";
import { cn } from "@/lib/utils";

export function PublicNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
      <nav
        className={cn(
          "max-w-5xl mx-auto rounded-full px-6 py-3",
          "border",
          "glass-nav",
          "relative overflow-hidden"
        )}
      >
        <div className="relative z-10 flex items-center justify-between">
          {/* Logo with status indicator */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-medium font-space tracking-tight text-foreground">
              AutoCrew
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors duration-300 font-geist rounded-full py-2 px-4 hover:text-foreground hover:bg-foreground/[0.05]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button - toggles to X when open */}
            <button
              className="inline-flex md:hidden p-2 -mr-2 rounded-full transition-colors text-muted-foreground hover:bg-foreground/[0.08]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Sign In button - desktop only */}
            <Link href="/login" className="hidden md:block">
              <button
                className={cn(
                  "text-xs font-medium font-space rounded-full py-2.5 px-5",
                  "border text-muted-foreground hover:text-foreground",
                  "bg-foreground/[0.05] hover:bg-foreground/[0.08]",
                  "border-border hover:border-border",
                  "transition-colors"
                )}
              >
                Sign In
              </button>
            </Link>

            {/* Primary CTA - desktop only */}
            <Link href="/signup" className="hidden md:block">
              <button
                className={cn(
                  "text-xs font-medium text-black font-space",
                  "rounded-full px-5 py-2.5",
                  "bg-[#FF6B35] hover:bg-[#FF6B35]/90",
                  "transition-colors"
                )}
              >
                Start for free
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay - outside nav so not clipped by rounded-full */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-60 md:hidden"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          role="dialog"
        >
          <button
            type="button"
            className="absolute inset-0 z-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
            tabIndex={-1}
          />
          <div
            className={cn(
              "relative z-10 mx-4 mt-4 rounded-2xl border glass-nav p-6",
              "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Menu
              </span>
              <button
                type="button"
                className="p-2 -mr-2 rounded-full transition-colors text-muted-foreground hover:bg-foreground/[0.08]"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-4 text-sm font-medium font-geist rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-foreground/[0.05]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-border">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <button
                  type="button"
                  className={cn(
                    "w-full text-sm font-medium font-space rounded-full py-3 px-5",
                    "border text-muted-foreground hover:text-foreground",
                    "bg-foreground/[0.05] hover:bg-foreground/[0.08]",
                    "border-border hover:border-border",
                    "transition-colors"
                  )}
                >
                  Sign In
                </button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <button
                  type="button"
                  className={cn(
                    "w-full text-sm font-medium text-black font-space",
                    "rounded-full px-5 py-3",
                    "bg-[#FF6B35] hover:bg-[#FF6B35]/90",
                    "transition-colors"
                  )}
                >
                  Start for free
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

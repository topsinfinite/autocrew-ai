"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/mock-data/landing-data";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";

const docsLinks = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "Getting Started", href: "/docs/getting-started" },
  { label: "FAQ", href: "/docs/faq" },
];

interface PublicNavProps {
  variant?: "default" | "docs";
}

export function PublicNav({ variant = "default" }: PublicNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const links = variant === "docs" ? docsLinks : navLinks;
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

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

  // Focus trap and Escape key for mobile menu
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeMobileMenu();
        return;
      }
      if (e.key === "Tab") {
        const focusable = menuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const firstFocusable = menuRef.current?.querySelector<HTMLElement>(
      'a[href], button:not([tabindex="-1"])'
    );
    firstFocusable?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen, closeMobileMenu]);

  return (
    <header className="relative p-4 lg:p-6">
      <nav
        className={cn(
          "max-w-5xl mx-auto rounded-full px-6 py-3",
          "border",
          "glass-nav",
          "relative overflow-hidden"
        )}
      >
        <div className="relative z-10 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Logo height={19} className="text-foreground" />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-1 text-sm font-medium text-muted-foreground">
            {links.map((link) => (
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
              ref={menuButtonRef}
              className="inline-flex lg:hidden p-2 -mr-2 rounded-full transition-colors text-muted-foreground hover:bg-foreground/[0.08]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
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
            <Button
              variant="pill-outline"
              size="pill-sm"
              className="hidden lg:inline-flex"
              asChild
            >
              <Link href="https://app.autocrew-ai.com/login">
                Sign In
              </Link>
            </Button>

            {/* Primary CTA - desktop only */}
            <Button
              variant="pill"
              size="pill-sm"
              className="hidden lg:inline-flex"
              asChild
            >
              <Link href="https://app.autocrew-ai.com/signup">
                Start for free
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay - outside nav so not clipped by rounded-full */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-60 lg:hidden"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          role="dialog"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 z-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <div
            ref={menuRef}
            className={cn(
              "relative z-10 mx-4 mt-4 rounded-2xl border glass-nav p-6",
              "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Menu
              </span>
              <button
                type="button"
                className="p-2 -mr-2 rounded-full transition-colors text-muted-foreground hover:bg-foreground/8"
                onClick={closeMobileMenu}
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-4 text-sm font-medium font-geist rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                  onClick={closeMobileMenu}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 pt-4 mt-4 border-t border-border">
              <Button
                variant="pill-outline"
                size="pill-md"
                className="w-full justify-center"
                asChild
              >
                <Link href="https://app.autocrew-ai.com/login" onClick={closeMobileMenu}>
                  Sign In
                </Link>
              </Button>
              <Button
                variant="pill"
                size="pill-md"
                className="w-full justify-center"
                asChild
              >
                <Link href="https://app.autocrew-ai.com/signup" onClick={closeMobileMenu}>
                  Start for free
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

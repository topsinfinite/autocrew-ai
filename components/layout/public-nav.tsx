"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ShineButton } from "@/components/landing/effects";
import { navLinks } from "@/lib/mock-data/landing-data";
import { cn } from "@/lib/utils";

export function PublicNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
      <nav
        className={cn(
          "max-w-5xl mx-auto rounded-full px-4 md:px-6 py-3",
          "border border-border/20",
          "glass-nav",
          "relative overflow-hidden"
        )}
      >
        <div className="relative z-10 flex items-center justify-between">
          {/* Logo with status indicator */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-medium font-display tracking-tight text-foreground/90">
              AutoCrew
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-full transition-colors duration-300",
                    "hover:text-foreground hover:bg-foreground/5"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              className="inline-flex md:hidden p-2 -mr-2 rounded-full transition-colors text-muted-foreground hover:bg-foreground/10"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Theme toggle */}
            <ThemeToggle />

            {/* Sign In button - desktop only */}
            <Link href="/login" className="hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "text-xs font-medium rounded-full px-5 py-2.5",
                  "text-muted-foreground hover:text-foreground",
                  "bg-foreground/5 hover:bg-foreground/10",
                  "border border-border/20 hover:border-border/40"
                )}
              >
                Sign In
              </Button>
            </Link>

            {/* Primary CTA - desktop only */}
            <Link href="/signup" className="hidden md:block">
              <ShineButton
                size="sm"
                className="text-xs font-medium rounded-full px-5 py-2.5"
              >
                Start for free
              </ShineButton>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-96 mt-4 pt-4 border-t border-border/20" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border/20">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center font-medium rounded-full"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                <ShineButton size="sm" className="w-full rounded-full font-medium">
                  Start for free
                </ShineButton>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

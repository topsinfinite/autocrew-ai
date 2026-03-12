"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  docsNavigation,
  type DocNavigationItem,
} from "@/lib/mock-data/docs-content";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DocsSidebarProps {
  className?: string;
}

function NavItem({
  item,
  level = 0,
  onNavigate,
}: {
  item: DocNavigationItem;
  level?: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = item.items && item.items.length > 0;
  const isActive = pathname === item.href;
  const isParent = hasChildren && item.href === "#";

  if (isParent) {
    return (
      <div className="mb-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          {item.title}
        </button>
        {isOpen && item.items && (
          <div className="ml-3 mt-1 border-l border-border pl-3">
            {item.items.map((child, index) => (
              <NavItem
                key={index}
                item={child}
                level={level + 1}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-foreground",
        isActive
          ? "bg-accent font-medium text-foreground"
          : "text-muted-foreground",
      )}
    >
      {item.title}
      {item.comingSoon && (
        <span className="ml-2 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          Coming Soon
        </span>
      )}
    </Link>
  );
}

export function DocsSidebar({ className }: DocsSidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeSidebar = useCallback(() => {
    setMobileMenuOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  // Focus trap and Escape key for mobile sidebar
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeSidebar();
        return;
      }
      if (e.key === "Tab") {
        const focusable = sidebarRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
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
    const firstFocusable = sidebarRef.current?.querySelector<HTMLElement>(
      'a[href], button:not([tabindex="-1"])',
    );
    firstFocusable?.focus();

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileMenuOpen, closeSidebar]);

  const sidebarContent = (
    <div className="space-y-1">
      <Link
        href="/docs"
        onClick={() => setMobileMenuOpen(false)}
        className="mb-4 block text-lg font-semibold text-foreground"
      >
        Documentation
      </Link>
      <nav className="space-y-1">
        {docsNavigation.map((item, index) => (
          <NavItem
            key={index}
            item={item}
            onNavigate={() => setMobileMenuOpen(false)}
          />
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-24 left-4 z-50">
        <Button
          ref={menuButtonRef}
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-background"
          aria-label={
            mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
            onClick={closeSidebar}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") closeSidebar();
            }}
            role="button"
            tabIndex={-1}
            aria-label="Close sidebar"
          />
          <aside
            ref={sidebarRef}
            className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-border bg-card p-6"
            role="navigation"
            aria-label="Documentation navigation"
          >
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block w-64 shrink-0 border-r border-border bg-card p-6",
          className,
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

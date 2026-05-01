"use client";

import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Search, Menu, X } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { SearchModal } from "@/components/blog/search-modal";
import type { SearchIndexEntry } from "@/lib/blog/loader";

type DropdownItem = { label: string; href: string; description?: string };
type NavItem =
  | { label: string; href: string }
  | { label: string; children: DropdownItem[] };

const productItems: DropdownItem[] = [
  {
    label: "AI Receptionist",
    href: "/ai-receptionist",
    description: "24/7 voice agent for every inbound call",
  },
  {
    label: "Widget",
    href: "/widget",
    description: "Embed Sarah on any page",
  },
];

const industryItems: DropdownItem[] = [
  { label: "Healthcare", href: "/industry/healthcare" },
  { label: "Coaching", href: "/industry/coaching" },
  { label: "Legal", href: "/industry/legal" },
  { label: "Restaurants", href: "/industry/restaurant" },
];

const navItems: NavItem[] = [
  { label: "Product", children: productItems },
  { label: "Industries", children: industryItems },
];

function isDropdown(
  item: NavItem,
): item is { label: string; children: DropdownItem[] } {
  return "children" in item;
}

interface BlogNavProps {
  searchIndex: SearchIndexEntry[];
}

export function BlogNav({ searchIndex }: BlogNavProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openDropdownFor = useCallback((label: string) => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setOpenDropdown(label);
  }, []);

  const closeDropdown = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  }, []);

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Cmd+K / Ctrl+K opens search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="relative z-40 px-4 sm:px-6 lg:px-12 pt-5 pb-4">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-4">
        {/* LEFT — brand + nav box */}
        <div
          className={cn(
            "flex items-center gap-1 sm:gap-2",
            "border border-[rgba(26,20,16,0.14)]",
            "bg-[hsl(40,50%,97%)]",
            "rounded-2xl px-2 sm:px-3 py-1.5",
          )}
        >
          {/* Brand */}
          <Link
            href={ROUTES.BLOG}
            className="flex items-center gap-2 px-2 py-1.5 group"
            aria-label="Autocrew Journal"
          >
            <Logo height={18} iconOnly className="text-[hsl(20,26%,8%)]" />
            <span
              className={cn(
                "hidden sm:inline-block font-display font-semibold text-[15px]",
                "text-[hsl(20,26%,8%)] underline underline-offset-[6px] decoration-[1.5px] decoration-[hsl(20,26%,8%)]",
              )}
            >
              Autocrew Journal
            </span>
          </Link>

          {/* Desktop dropdowns */}
          <nav className="hidden lg:flex items-center">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => isDropdown(item) && openDropdownFor(item.label)}
                onMouseLeave={() => isDropdown(item) && closeDropdown()}
              >
                {isDropdown(item) ? (
                  <button
                    className="flex items-center gap-1 px-3 py-2 text-[14px] font-sans font-medium text-[hsl(20,26%,8%)] hover:bg-[rgba(26,20,16,0.04)] rounded-md transition-colors"
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                    onClick={() =>
                      setOpenDropdown((prev) => (prev === item.label ? null : item.label))
                    }
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 transition-transform",
                        openDropdown === item.label && "rotate-180",
                      )}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="px-3 py-2 text-[14px] font-sans font-medium text-[hsl(20,26%,8%)] hover:bg-[rgba(26,20,16,0.04)] rounded-md transition-colors block"
                  >
                    {item.label}
                  </Link>
                )}

                {isDropdown(item) && (
                  <div
                    className={cn(
                      "absolute left-0 top-full pt-3 min-w-[280px]",
                      "transition-all duration-200 ease-out",
                      openDropdown === item.label
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-1 pointer-events-none",
                    )}
                  >
                    <div className="bg-[hsl(40,50%,97%)] border border-[rgba(26,20,16,0.14)] rounded-xl p-2 shadow-[0_8px_24px_-8px_rgba(26,20,16,0.16)]">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-3 py-2 rounded-md hover:bg-[rgba(26,20,16,0.04)] transition-colors"
                        >
                          <div className="text-[14px] font-sans font-medium text-[hsl(20,26%,8%)]">
                            {child.label}
                          </div>
                          {child.description && (
                            <div className="text-[12px] font-sans text-[hsl(25,10%,45%)] mt-0.5">
                              {child.description}
                            </div>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* RIGHT — utility box */}
        <div
          className={cn(
            "hidden md:flex items-center gap-1",
            "border border-[rgba(26,20,16,0.14)]",
            "bg-[hsl(40,50%,97%)]",
            "rounded-2xl px-2 py-1.5",
          )}
        >
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-[14px] font-sans font-medium text-[hsl(20,26%,8%)] hover:bg-[rgba(26,20,16,0.04)] rounded-md transition-colors"
            aria-label="Search the Autocrew Journal"
          >
            <Search className="w-4 h-4" strokeWidth={2.25} aria-hidden />
            <span className="hidden lg:inline">Search</span>
            <kbd className="hidden lg:inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 ml-1 border border-[rgba(26,20,16,0.18)] rounded text-[10px] font-sans text-[hsl(25,10%,45%)] bg-[hsl(40,35%,94%)]">
              ⌘K
            </kbd>
          </button>
          <Link
            href="https://app.autocrew-ai.com/login"
            className="px-3 py-2 text-[14px] font-sans font-medium text-[hsl(20,26%,8%)] hover:bg-[rgba(26,20,16,0.04)] rounded-md transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/contact"
            className="hidden lg:block px-3 py-2 text-[14px] font-sans font-medium text-[hsl(20,26%,8%)] hover:bg-[rgba(26,20,16,0.04)] rounded-md transition-colors"
          >
            Speak to Sarah
          </Link>
          <Link
            href="https://app.autocrew-ai.com/signup"
            className="ml-1 px-4 py-2 text-[14px] font-sans font-semibold text-white bg-[hsl(20,26%,8%)] hover:bg-[hsl(20,26%,16%)] rounded-md transition-colors whitespace-nowrap"
          >
            Try free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex items-center justify-center w-10 h-10 border border-[rgba(26,20,16,0.14)] bg-[hsl(40,50%,97%)] rounded-xl"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="w-5 h-5 text-[hsl(20,26%,8%)]" />
          ) : (
            <Menu className="w-5 h-5 text-[hsl(20,26%,8%)]" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-[68px] bottom-0 z-50 bg-[hsl(40,35%,94%)] overflow-y-auto">
          <nav className="px-6 py-6 flex flex-col gap-1">
            {navItems.map((item) => (
              <div key={item.label}>
                {isDropdown(item) ? (
                  <>
                    <button
                      className="w-full flex items-center justify-between px-3 py-3 text-[15px] font-sans font-medium text-[hsl(20,26%,8%)] hover:bg-[rgba(26,20,16,0.04)] rounded-md"
                      onClick={() =>
                        setMobileExpanded((prev) =>
                          prev === item.label ? null : item.label,
                        )
                      }
                      aria-expanded={mobileExpanded === item.label}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform",
                          mobileExpanded === item.label && "rotate-180",
                        )}
                      />
                    </button>
                    {mobileExpanded === item.label && (
                      <div className="pl-4 mt-1 mb-2 flex flex-col gap-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-3 py-2.5 text-[14px] font-sans text-[hsl(25,10%,32%)] hover:text-[hsl(20,26%,8%)] hover:bg-[rgba(26,20,16,0.04)] rounded-md"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-3 text-[15px] font-sans font-medium text-[hsl(20,26%,8%)] hover:bg-[rgba(26,20,16,0.04)] rounded-md"
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="border-t border-[rgba(26,20,16,0.12)] mt-3 pt-3 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="flex items-center gap-2 px-3 py-3 text-[15px] font-sans font-medium text-[hsl(20,26%,8%)] hover:bg-[rgba(26,20,16,0.04)] rounded-md text-left"
              >
                <Search className="w-4 h-4" strokeWidth={2.25} aria-hidden />
                Search
              </button>
              <Link
                href="https://app.autocrew-ai.com/login"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 text-[15px] font-sans font-medium text-[hsl(20,26%,8%)] hover:bg-[rgba(26,20,16,0.04)] rounded-md"
              >
                Sign in
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="px-3 py-3 text-[15px] font-sans font-medium text-[hsl(20,26%,8%)] hover:bg-[rgba(26,20,16,0.04)] rounded-md"
              >
                Speak to Sarah
              </Link>
              <Link
                href="https://app.autocrew-ai.com/signup"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-4 py-3 text-center text-[15px] font-sans font-semibold text-white bg-[hsl(20,26%,8%)] hover:bg-[hsl(20,26%,16%)] rounded-md"
              >
                Try free
              </Link>
            </div>
          </nav>
        </div>
      )}

      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        index={searchIndex}
      />
    </header>
  );
}

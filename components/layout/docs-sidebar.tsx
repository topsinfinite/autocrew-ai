"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react"
import { useState } from "react"
import { docsNavigation, type DocNavigationItem } from "@/lib/mock-data/docs-content"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface DocsSidebarProps {
  className?: string
}

function NavItem({ item, level = 0, onNavigate }: { item: DocNavigationItem; level?: number; onNavigate?: () => void }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const hasChildren = item.items && item.items.length > 0
  const isActive = pathname === item.href
  const isParent = hasChildren && item.href === "#"

  if (isParent) {
    return (
      <div className="mb-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
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
              <NavItem key={index} item={child} level={level + 1} onNavigate={onNavigate} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "block rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-foreground",
        isActive
          ? "bg-accent font-medium text-foreground"
          : "text-muted-foreground"
      )}
    >
      {item.title}
    </Link>
  )
}

export function DocsSidebar({ className }: DocsSidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
          <NavItem key={index} item={item} onNavigate={() => setMobileMenuOpen(false)} />
        ))}
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="bg-background"
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
            onClick={() => setMobileMenuOpen(false)}
          />
          <aside className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-border bg-card p-6">
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block w-64 shrink-0 border-r border-border bg-card p-6",
          className
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}

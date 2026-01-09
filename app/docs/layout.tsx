import Link from "next/link"
import Image from "next/image"
import { DocsSidebar } from "@/components/layout/docs-sidebar"
import { TableOfContents } from "@/components/docs/table-of-contents"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/logo.png"
                alt="AutoCrew Logo"
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg"
              />
              <span className="text-xl font-bold text-foreground">
                AutoCrew
              </span>
            </Link>
            <nav className="hidden md:flex md:gap-6">
              <Link
                href="/docs"
                className="text-sm font-medium text-foreground transition-colors hover:text-primary"
              >
                Documentation
              </Link>
              <Link
                href="/"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Home
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
            </nav>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Layout */}
      <div className="container flex-1">
        <div className="flex">
          {/* Left Sidebar */}
          <DocsSidebar className="hidden lg:block" />

          {/* Main Content */}
          <main className="flex-1 px-6 py-8 lg:px-12">
            <article className="prose prose-slate dark:prose-invert max-w-none">
              {children}
            </article>
          </main>

          {/* Right Sidebar (Table of Contents) */}
          <TableOfContents />
        </div>
      </div>
    </div>
  )
}

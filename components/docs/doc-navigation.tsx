"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getAdjacentRoutes } from "@/lib/mock-data/docs-content"
import { Button } from "@/components/ui/button"

export function DocNavigation() {
  const pathname = usePathname()
  const { previous, next } = getAdjacentRoutes(pathname)

  if (!previous && !next) {
    return null
  }

  const getPageTitle = (path: string) => {
    const titles: Record<string, string> = {
      "/docs/getting-started": "Getting Started",
      "/docs/user-guide": "User Guide",
      "/docs/support-crew": "Support Crew",
      "/docs/leadgen-crew": "LeadGen Crew",
      "/docs/faq": "FAQ",
      "/docs/privacy": "Privacy Policy",
      "/docs/terms": "Terms of Service",
    }
    return titles[path] || path
  }

  return (
    <div className="mt-12 flex items-center justify-between border-t border-border pt-8">
      <div className="flex-1">
        {previous && (
          <Link href={previous}>
            <Button variant="ghost" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Previous</div>
                <div className="font-medium">{getPageTitle(previous)}</div>
              </div>
            </Button>
          </Link>
        )}
      </div>
      <div className="flex-1 text-right">
        {next && (
          <Link href={next}>
            <Button variant="ghost" className="gap-2">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Next</div>
                <div className="font-medium">{getPageTitle(next)}</div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

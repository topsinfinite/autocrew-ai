"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface TOCItem {
  id: string
  title: string
  level: number
}

interface TableOfContentsProps {
  className?: string
}

export function TableOfContents({ className }: TableOfContentsProps) {
  const [toc, setToc] = useState<TOCItem[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Extract headings from the page
    const headings = document.querySelectorAll("article h2, article h3")
    const items: TOCItem[] = Array.from(headings).map((heading) => ({
      id: heading.id,
      title: heading.textContent || "",
      level: parseInt(heading.tagName.substring(1)),
    }))
    setToc(items)

    // Set up intersection observer for active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: "-80px 0px -80% 0px",
      }
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => {
      headings.forEach((heading) => observer.unobserve(heading))
    }
  }, [])

  if (toc.length === 0) {
    return null
  }

  return (
    <aside
      className={cn(
        "sticky top-20 hidden w-64 shrink-0 lg:block",
        className
      )}
    >
      <div className="pb-4">
        <h4 className="mb-4 text-sm font-semibold text-foreground">
          On This Page
        </h4>
        <nav>
          <ul className="space-y-2">
            {toc.map((item) => (
              <li
                key={item.id}
                className={cn(
                  item.level === 3 && "ml-4"
                )}
              >
                <a
                  href={`#${item.id}`}
                  className={cn(
                    "block text-sm transition-colors hover:text-foreground",
                    activeId === item.id
                      ? "font-medium text-primary"
                      : "text-muted-foreground"
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(item.id)?.scrollIntoView({
                      behavior: "smooth",
                    })
                  }}
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  )
}

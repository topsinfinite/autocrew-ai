import type { Metadata } from "next"
import Link from "next/link"
import { BookOpen, Rocket, Users, HelpCircle, FileText, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DocNavigation } from "@/components/docs/doc-navigation"

export const metadata: Metadata = {
  title: "Documentation - AutoCrew",
  description:
    "Learn how to automate your business processes with AI-powered crews that work 24/7 to support your customers and generate leads.",
}

export default function DocsPage() {
  const sections = [
    {
      title: "Getting Started",
      description: "Quick start guide to set up your first AI crew",
      icon: Rocket,
      href: "/docs/getting-started",
    },
    {
      title: "User Guide",
      description: "Complete guide to using AutoCrew features",
      icon: BookOpen,
      href: "/docs/user-guide",
    },
    {
      title: "Support Crew",
      description: "AI-powered customer support automation",
      icon: Users,
      href: "/docs/support-crew",
    },
    {
      title: "LeadGen Crew",
      description: "Intelligent lead generation and qualification",
      icon: Zap,
      href: "/docs/leadgen-crew",
    },
    {
      title: "FAQ",
      description: "Frequently asked questions and answers",
      icon: HelpCircle,
      href: "/docs/faq",
    },
    {
      title: "Legal",
      description: "Privacy policy and terms of service",
      icon: FileText,
      href: "/docs/privacy",
    },
  ]

  return (
    <div>
      <div className="mb-12">
        <h1 id="introduction" className="mb-4 text-4xl font-bold text-foreground">
          AutoCrew Documentation
        </h1>
        <p className="text-lg text-muted-foreground">
          Welcome to AutoCrew documentation. Learn how to automate your business
          processes with AI-powered crews that work 24/7 to support your customers
          and generate leads.
        </p>
      </div>

      <div className="mb-12">
        <h2 id="overview" className="mb-6 text-2xl font-semibold text-foreground">
          Overview
        </h2>
        <p className="mb-4 text-muted-foreground">
          AutoCrew is a multi-tenant SaaS platform that provides AI-powered automation
          for businesses. Our intelligent crews can handle customer support inquiries,
          identify and qualify leads, and integrate seamlessly with your existing tools.
        </p>
        <p className="mb-4 text-muted-foreground">
          Whether you're a small startup or a large enterprise, AutoCrew scales with
          your needs and provides the automation capabilities you need to grow your
          business efficiently.
        </p>
      </div>

      <div className="mb-12">
        <h2 id="explore-documentation" className="mb-6 text-2xl font-semibold text-foreground">
          Explore Documentation
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.href} href={section.href}>
                <Card className="h-full transition-all hover:border-primary hover:shadow-md">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="mb-12">
        <h2 id="quick-links" className="mb-6 text-2xl font-semibold text-foreground">
          Quick Links
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              New to AutoCrew?
            </h3>
            <p className="text-muted-foreground">
              Start with our{" "}
              <Link
                href="/docs/getting-started"
                className="text-primary underline-offset-4 hover:underline"
              >
                Getting Started Guide
              </Link>{" "}
              to set up your first AI crew in minutes.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Need Help?
            </h3>
            <p className="text-muted-foreground">
              Check out our{" "}
              <Link
                href="/docs/faq"
                className="text-primary underline-offset-4 hover:underline"
              >
                FAQ page
              </Link>{" "}
              for answers to common questions.
            </p>
          </div>
          <div>
            <h3 className="mb-2 text-lg font-semibold text-foreground">
              Want to Learn More?
            </h3>
            <p className="text-muted-foreground">
              Visit our{" "}
              <Link
                href="/"
                className="text-primary underline-offset-4 hover:underline"
              >
                homepage
              </Link>{" "}
              to explore features and pricing options.
            </p>
          </div>
        </div>
      </div>

      <DocNavigation />
    </div>
  )
}

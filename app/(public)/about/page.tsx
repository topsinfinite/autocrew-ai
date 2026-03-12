import type { Metadata } from "next";
import { Target, Users, Rocket, Heart } from "lucide-react";
import { webPageSchema } from "@/lib/seo/schemas";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about AutoCrew's mission to make AI automation accessible to every business. Our values, vision, and the story behind our platform.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About AutoCrew",
    description:
      "Learn about AutoCrew's mission to make AI automation accessible to every business.",
    url: "/about",
    images: [
      {
        url: "/about/opengraph-image",
        width: 1200,
        height: 630,
        alt: "About AutoCrew",
      },
    ],
  },
  other: {
    "article:published_time": "2025-01-15",
    "article:modified_time": "2026-02-15",
  },
};

export default function AboutPage() {
  return (
    <div className="pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32">
      <JsonLd
        data={webPageSchema(
          "/about",
          "About AutoCrew",
          "2025-01-15",
          "2026-02-15",
        )}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight font-space-grotesk text-foreground mb-6 leading-[1.1]">
            About AutoCrew
          </h1>
          <p className="text-xl text-muted-foreground font-geist leading-relaxed">
            We're on a mission to make AI automation accessible to every
            business, helping them scale operations and deliver exceptional
            customer experiences.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
          <div className="bg-card border border-border rounded-3xl p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
              <Target className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold font-space-grotesk tracking-tight mb-4">
              Our Mission
            </h2>
            <p className="text-muted-foreground font-geist leading-relaxed">
              To empower businesses of all sizes with intelligent AI crews that
              automate repetitive tasks, enhance customer support, and drive
              revenue growth through automated lead generation.
            </p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
              <Rocket className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-semibold font-space-grotesk tracking-tight mb-4">
              Our Vision
            </h2>
            <p className="text-muted-foreground font-geist leading-relaxed">
              A world where every business has access to AI-powered automation,
              enabling them to focus on what matters most—innovation,
              creativity, and building meaningful relationships with their
              customers.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-space-grotesk tracking-tight text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold font-space-grotesk mb-2">
                Customer-First
              </h3>
              <p className="text-muted-foreground font-geist">
                Every decision we make puts our customers' success at the
                forefront.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold font-space-grotesk mb-2">
                Simplicity
              </h3>
              <p className="text-muted-foreground font-geist">
                We believe powerful technology should be simple and accessible
                to everyone.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary mb-4">
                <Rocket className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold font-space-grotesk mb-2">
                Innovation
              </h3>
              <p className="text-muted-foreground font-geist">
                We continuously push boundaries to deliver cutting-edge AI
                solutions.
              </p>
            </div>
          </div>
        </div>

        {/* Story */}
        <article className="max-w-4xl mx-auto bg-muted/50 rounded-3xl p-8 md:p-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold font-space-grotesk tracking-tight mb-6">
            Our Story
          </h2>
          <div className="space-y-4 text-muted-foreground font-geist leading-relaxed">
            <p>
              AutoCrew was born from a simple observation: businesses were
              struggling to keep up with customer demands while managing limited
              resources. Support teams were overwhelmed, leads were slipping
              through the cracks, and growth was constrained by manual
              processes.
            </p>
            <p>
              We knew AI could solve these problems, but existing solutions were
              too complex, too expensive, or required extensive technical
              expertise. So we set out to build something different—an AI
              automation platform that anyone could use, regardless of technical
              background.
            </p>
            <p>
              Today, AutoCrew powers thousands of businesses worldwide, handling
              millions of customer conversations and generating qualified leads
              around the clock. But we're just getting started. Our vision is to
              democratize AI automation, making it as accessible as email or
              spreadsheets.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

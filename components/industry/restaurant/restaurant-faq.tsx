import Link from "next/link";
import { ArrowRight, HelpCircle, MessageSquare } from "lucide-react";
import { SectionBadge } from "@/components/landing/section-badge";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { restaurantFaqItems } from "@/lib/mock-data/restaurant-data";

export function RestaurantFaq() {
  return (
    <section className="relative z-10 section-divider section-glow-center pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Column */}
          <div className="lg:col-span-5">
            <SectionBadge
              icon={<HelpCircle className="w-3.5 h-3.5" />}
              className="mb-6"
            >
              Frequently Asked Questions
            </SectionBadge>

            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6 font-semibold text-foreground font-space-grotesk">
              Questions Restaurants Ask
            </h2>

            <p className="text-lg leading-relaxed text-muted-foreground font-geist mb-8">
              Common questions from restaurant professionals before getting
              started with AutoCrew.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="pill" size="pill-md" className="group" asChild>
                <Link href="/docs/faq">
                  View full FAQ
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </Button>
              <Button variant="pill-outline" size="pill-md" asChild>
                <Link href="/contact">
                  <MessageSquare className="w-4 h-4" />
                  Contact support
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Accordion */}
          <div className="lg:col-span-7 rounded-3xl border border-border bg-foreground/[0.02] dark:bg-white/[0.02] backdrop-blur-sm p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {restaurantFaqItems.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`restaurant-faq-${index}`}
                  className="border-foreground/[0.08] dark:border-white/[0.08]"
                >
                  <AccordionTrigger className="text-left text-base font-medium text-foreground font-geist hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground font-geist pr-8">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { ArrowRight, HelpCircle, MessageSquare } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqData } from "@/lib/mock-data/docs-content";

const landingFaqItems = faqData.slice(0, 6);

export function FaqSection() {
  return (
    <section
      id="faq"
      className="relative z-10 section-divider section-glow-center pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF6B35]/20 bg-[#FF6B35]/5 text-[#FF6B35] text-xs font-medium mb-6 font-space">
              <HelpCircle className="w-3.5 h-3.5" />
              Frequently Asked Questions
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6 font-semibold text-foreground font-space-grotesk">
              Answers Before You Commit
            </h2>

            <p className="text-lg leading-relaxed text-muted-foreground font-geist mb-8">
              The most common questions teams ask before deploying their first
              AutoCrew workflow.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/docs/faq"
                className="group inline-flex items-center justify-center gap-2 text-sm font-semibold text-black bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full py-3 px-6 transition-all duration-200 shadow-[0_0_20px_-5px_rgba(255,107,53,0.4)] font-space"
              >
                View full FAQ
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-full border border-border px-6 py-3 bg-foreground/[0.04] hover:bg-foreground/[0.08] font-geist"
              >
                <MessageSquare className="w-4 h-4" />
                Contact support
              </Link>
            </div>
          </div>

          <div className="lg:col-span-7 rounded-3xl border border-border bg-foreground/[0.02] dark:bg-white/[0.02] backdrop-blur-sm p-6 md:p-8">
            <Accordion type="single" collapsible className="w-full">
              {landingFaqItems.map((item, index) => (
                <AccordionItem
                  key={item.question}
                  value={`landing-faq-${index}`}
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

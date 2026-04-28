import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { legalFaqItems } from "@/lib/mock-data/legal-data";

export function LegalFaq() {
  return (
    <section className="relative z-10 border-t border-[var(--border-subtle)] bg-foreground/[0.015]">
      <div className="mx-auto max-w-[1320px] px-6 py-20 lg:py-28">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#FF6B35]">
              Frequently asked
            </div>
            <h2 className="mt-4 font-space-grotesk text-[clamp(1.875rem,3vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.018em] text-foreground">
              Questions legal teams ask before they wire it in.
            </h2>
            <p className="mt-5 max-w-[44ch] font-geist text-[15px] leading-[1.65] text-foreground/65">
              If yours isn&rsquo;t here, the live widget on this page can answer
              it the same way Sarah would answer one of your callers.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button variant="pill" size="pill-md" className="group" asChild>
                <Link href="/docs/faq">
                  View full FAQ
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button variant="pill-outline" size="pill-md" asChild>
                <Link href="/contact">
                  <MessageSquare className="h-4 w-4" />
                  Ask us directly
                </Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-card p-6 md:p-8">
              <Accordion type="single" collapsible className="w-full">
                {legalFaqItems.map((item, index) => (
                  <AccordionItem
                    key={item.question}
                    value={`legal-faq-${index}`}
                    className="border-[var(--border-subtle)]"
                  >
                    <AccordionTrigger className="text-left font-geist text-base font-medium text-foreground hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="pr-8 font-geist text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

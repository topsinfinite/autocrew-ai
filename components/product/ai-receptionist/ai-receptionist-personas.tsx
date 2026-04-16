"use client";

import { Users } from "lucide-react";
import { SectionBadge } from "@/components/landing/section-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { aiReceptionistPersonas } from "@/lib/mock-data/ai-receptionist-data";
import { cn } from "@/lib/utils";

export function AiReceptionistPersonas() {
  const defaultTab = aiReceptionistPersonas[0]?.id ?? "callers";

  return (
    <section className="relative z-10 py-16 sm:py-24 md:py-28 section-divider">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <SectionBadge
            icon={<Users className="w-3.5 h-3.5" />}
            className="mb-6"
          >
            Who it helps
          </SectionBadge>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight font-space-grotesk text-foreground mb-4">
            Built for everyone on the other end of the line
          </h2>
          <p className="text-lg text-muted-foreground font-geist leading-relaxed">
            Different roles. Same goal: callers get answers, teams get relief,
            operators get predictability.
          </p>
        </div>

        <Tabs
          defaultValue={defaultTab}
          className="w-full max-w-5xl mx-auto"
          aria-label="Who benefits from the AI receptionist"
        >
          <TabsList
            className={cn(
              "flex h-auto w-full flex-wrap justify-center gap-2 bg-muted/50 p-2 rounded-xl",
              "md:flex-nowrap md:overflow-x-auto md:justify-start",
            )}
          >
            {aiReceptionistPersonas.map((p) => (
              <TabsTrigger
                key={p.id}
                value={p.id}
                className="shrink-0 rounded-lg px-4 py-2.5 min-h-11 text-xs sm:text-sm data-[state=active]:shadow-sm"
              >
                {p.tabLabel}
              </TabsTrigger>
            ))}
          </TabsList>

          {aiReceptionistPersonas.map((p) => (
            <TabsContent
              key={p.id}
              value={p.id}
              className="mt-8 focus-visible:outline-none"
            >
              <div className="rounded-3xl border border-foreground/[0.08] dark:border-white/[0.08] bg-foreground/[0.02] dark:bg-white/[0.02] backdrop-blur-sm p-6 sm:p-10">
                <h3 className="text-xl sm:text-2xl font-semibold font-space-grotesk text-foreground mb-6">
                  {p.headline}
                </h3>
                <ul className="space-y-3 mb-10">
                  {p.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex gap-3 text-muted-foreground font-geist leading-relaxed"
                    >
                      <span
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#FF6B35]"
                        aria-hidden="true"
                      />
                      {b}
                    </li>
                  ))}
                </ul>
                <figure className="rounded-2xl border border-border bg-card/50 p-6">
                  <blockquote className="text-foreground font-geist text-base leading-relaxed mb-4">
                    &ldquo;{p.quote}&rdquo;
                  </blockquote>
                  <figcaption className="text-sm text-muted-foreground font-geist">
                    <span className="font-medium text-foreground">
                      {p.attribution}
                    </span>
                    <span className="text-muted-foreground"> · {p.role}</span>
                  </figcaption>
                </figure>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

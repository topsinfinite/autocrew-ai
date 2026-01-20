"use client";

import { Maximize, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardMockData } from "@/lib/mock-data/landing-data";

export function DashboardAnalyticsPanel() {
  const { analytics } = dashboardMockData;

  return (
    <div className="hidden md:flex w-[320px] border-l border-border/10 flex-col bg-foreground/[0.01] flex-shrink-0 z-10 backdrop-blur-sm">
      {/* Header */}
      <div className="h-14 border-b border-border/10 flex items-center justify-between px-5">
        <span className="uppercase text-xs font-medium tracking-wider font-mono text-muted-foreground">
          {analytics.sparklineTitle}
        </span>
        <button className="text-muted-foreground hover:text-foreground">
          <Maximize className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto custom-scrollbar font-mono p-5 space-y-8">
        {/* Sparkline Area */}
        <div className="h-12 w-full flex items-end justify-between gap-[2px] mb-4">
          {Array.from({ length: 24 }).map((_, i) => {
            const heights = [30, 40, 35, 50, 45, 60, 55, 70, 65, 80, 75, 90, 85, 60, 70, 50, 60, 40, 50, 30, 40, 20, 30, 20];
            const isHighlighted = i === 9;
            return (
              <div
                key={i}
                className={cn(
                  "w-1",
                  isHighlighted
                    ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                    : "bg-primary/20"
                )}
                style={{ height: `${heights[i]}%` }}
              />
            );
          })}
        </div>

        {/* Time Labels */}
        <div className="flex justify-between text-[10px] -mt-6 mb-6 text-muted-foreground/60">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
        </div>

        {/* Metrics List */}
        <div className="space-y-4">
          {analytics.metrics.map((metric) => (
            <div
              key={metric.label}
              className="flex items-center justify-between p-3 rounded-lg bg-foreground/[0.02] border border-border/10"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    metric.highlighted ? "bg-primary" : "bg-muted-foreground"
                  )}
                />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {metric.label}
                </span>
              </div>
              <span className="text-xs font-mono font-medium px-1.5 py-0.5 rounded text-foreground/90 bg-foreground/5">
                {metric.value}
              </span>
            </div>
          ))}
        </div>

        {/* Crew Config */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest mb-3 text-muted-foreground">
            Crew Configuration
          </h3>
          <div className="space-y-3">
            {analytics.crewConfig.map((crew) => (
              <div
                key={crew.name}
                className="flex justify-between items-center text-xs text-foreground/80"
              >
                <span>{crew.name}</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-medium border",
                    crew.status === "active"
                      ? "bg-primary/10 text-primary border-primary/20"
                      : "bg-foreground/10 text-muted-foreground border-border/20"
                  )}
                >
                  {crew.status.toUpperCase()}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center text-xs text-foreground/80">
              <span>Tone of Voice</span>
              <span className="px-2 py-0.5 rounded text-[10px] border font-medium bg-foreground/10 text-foreground border-border/20">
                {analytics.toneOfVoice.toUpperCase()}
              </span>
            </div>
            {analytics.configOptions.map((option) => (
              <div
                key={option.label}
                className="flex justify-between items-center text-xs cursor-pointer transition-colors text-foreground/80 hover:text-foreground"
              >
                <span>{option.label}</span>
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest mb-3 text-muted-foreground">
            AutoCrew Performance
          </h3>
          <div className="relative h-24 w-full border border-border/10 bg-foreground/[0.02] rounded-lg p-2 overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-20 pointer-events-none">
              <div className="border-b border-dashed w-full h-full border-foreground" />
              <div className="border-b border-dashed w-full h-full border-foreground" />
              <div className="border-b border-dashed w-full h-full border-foreground" />
            </div>
            {/* Line Chart SVG */}
            <svg
              className="absolute inset-0 w-full h-full p-2"
              viewBox="0 0 100 50"
              preserveAspectRatio="none"
            >
              <path
                d="M0,45 C10,40 20,42 30,30 C40,20 50,35 60,25 C70,15 80,10 90,5 L100,0"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
              />
              <path
                d="M0,48 C15,45 30,46 45,35 C55,25 70,30 85,20 L100,15"
                fill="none"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                opacity="0.4"
              />
            </svg>
          </div>
          <div className="flex justify-between text-[9px] mt-1 text-muted-foreground/60">
            <span>WEEK 1</span>
            <span>WEEK 2</span>
            <span>WEEK 3</span>
            <span>WEEK 4</span>
            <span>WEEK 5</span>
          </div>
        </div>

        {/* Satisfaction Score */}
        <div className="bg-gradient-to-br from-foreground/[0.03] to-foreground/[0.01] rounded-xl p-4 border border-border/10">
          <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
            Satisfaction Score
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-display text-foreground">
              {analytics.satisfactionScore}/5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

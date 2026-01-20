"use client";

import { Bot, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardMockData } from "@/lib/mock-data/landing-data";

export function DashboardSidebar() {
  const { systemStatus } = dashboardMockData;
  const cpuUsage = systemStatus.cpuUsage;

  return (
    <div className="hidden md:flex w-16 border-r border-border/10 flex-col items-center py-5 bg-foreground/[0.02] justify-between flex-shrink-0 z-20">
      {/* Top section */}
      <div className="flex flex-col items-center gap-6">
        {/* Bot icon */}
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center border",
            "bg-foreground/5 border-border/20 text-foreground",
            "group hover:border-primary/30 transition-colors"
          )}
        >
          <Bot className="w-4 h-4 group-hover:text-primary transition-colors" />
        </div>

        {/* Divider */}
        <div className="h-px w-8 bg-border/20" />

        {/* System Status label */}
        <div
          className="text-[10px] uppercase font-medium text-muted-foreground tracking-widest font-mono"
          style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
        >
          System Status
        </div>

        {/* Status indicator */}
        <div className="w-2 h-2 rounded-full bg-primary soft-glow" />
      </div>

      {/* Bottom section */}
      <div className="flex flex-col items-center gap-4 w-full px-2">
        {/* CPU label */}
        <div className="text-[9px] text-muted-foreground mb-1">CPU</div>

        {/* Circular progress gauge */}
        <div className="relative w-10 h-10">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-foreground/5"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="text-primary"
              strokeDasharray={`${cpuUsage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[9px] font-medium text-foreground">
            {cpuUsage}%
          </div>
        </div>

        {/* Mini bar chart */}
        <div className="flex items-end justify-center gap-[2px] h-8 w-full">
          {[40, 70, 50, 80, 30].map((height, i) => (
            <div
              key={i}
              className={cn(
                "w-1 rounded-t-sm transition-all duration-300",
                i === 3
                  ? "bg-primary shadow-[0_0_8px_rgba(var(--primary),0.4)]"
                  : "bg-foreground/20"
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        {/* Settings button */}
        <button className="mt-4 p-2 rounded-lg hover:bg-foreground/5 text-muted-foreground transition-colors">
          <Settings2 className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}

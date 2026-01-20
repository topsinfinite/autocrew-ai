"use client";

import { Maximize, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardMockData } from "@/lib/mock-data/landing-data";

export function DashboardAnalyticsPanel() {
  const { analytics } = dashboardMockData;

  return (
    <div className="hidden md:flex w-[320px] border-l border-white/5 flex-col bg-white/[0.01] flex-shrink-0 z-10 backdrop-blur-sm">
      {/* Header */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-5">
        <span className="uppercase text-xs font-medium tracking-wider font-space-mono text-slate-400">
          {analytics.sparklineTitle}
        </span>
        <button className="text-slate-400 hover:text-white">
          <Maximize className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Content */}
      <div className="overflow-y-auto custom-scrollbar font-space-mono p-5 space-y-8">
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
                    ? "bg-[#FF6B35] shadow-[0_0_8px_rgba(255,107,53,0.5)]"
                    : "bg-[#FF6B35]/20"
                )}
                style={{ height: `${heights[i]}%` }}
              />
            );
          })}
        </div>

        {/* Time Labels */}
        <div className="flex justify-between text-[10px] -mt-6 mb-6 text-slate-600">
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
              className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/5"
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    metric.highlighted ? "bg-[#FF6B35]" : "bg-slate-500"
                  )}
                />
                <span className="text-[10px] uppercase tracking-wider text-slate-400">
                  {metric.label}
                </span>
              </div>
              <span className="text-xs font-space-mono font-medium px-1.5 py-0.5 rounded text-slate-200 bg-white/5">
                {metric.value}
              </span>
            </div>
          ))}
        </div>

        {/* Crew Config */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest mb-3 text-slate-400">
            Crew Configuration
          </h3>
          <div className="space-y-3">
            {analytics.crewConfig.map((crew) => (
              <div
                key={crew.name}
                className="flex justify-between items-center text-xs text-slate-300"
              >
                <span>{crew.name}</span>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-medium border",
                    crew.status === "active"
                      ? "bg-[#FF6B35]/10 text-[#FF6B35] border-[#FF6B35]/20"
                      : "bg-white/10 text-slate-400 border-white/10"
                  )}
                >
                  {crew.status.toUpperCase()}
                </span>
              </div>
            ))}
            <div className="flex justify-between items-center text-xs text-slate-300">
              <span>Tone of Voice</span>
              <span className="px-2 py-0.5 rounded text-[10px] border font-medium bg-white/10 text-white border-white/10">
                {analytics.toneOfVoice.toUpperCase()}
              </span>
            </div>
            {analytics.configOptions.map((option) => (
              <div
                key={option.label}
                className="flex justify-between items-center text-xs cursor-pointer transition-colors text-slate-300 hover:text-white"
              >
                <span>{option.label}</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest mb-3 text-slate-400">
            AutoCrew Performance
          </h3>
          <div className="relative h-24 w-full border border-white/5 bg-white/[0.02] rounded-lg p-2 overflow-hidden">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-20 pointer-events-none">
              <div className="border-b border-dashed w-full h-full border-white" />
              <div className="border-b border-dashed w-full h-full border-white" />
              <div className="border-b border-dashed w-full h-full border-white" />
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
                stroke="#FF6B35"
                strokeWidth="1.5"
              />
              <path
                d="M0,48 C15,45 30,46 45,35 C55,25 70,30 85,20 L100,15"
                fill="none"
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="2 2"
                opacity="0.4"
              />
            </svg>
          </div>
          <div className="flex justify-between text-[9px] mt-1 text-slate-600">
            <span>WEEK 1</span>
            <span>WEEK 2</span>
            <span>WEEK 3</span>
            <span>WEEK 4</span>
            <span>WEEK 5</span>
          </div>
        </div>

        {/* Satisfaction Score */}
        <div className="bg-gradient-to-br from-white/[0.03] to-white/[0.01] rounded-xl p-4 border border-white/5">
          <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">
            Satisfaction Score
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-space text-white">
              {analytics.satisfactionScore}/5
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              BASED ON 3,200 REVIEWS
            </span>
          </div>
          {/* Star rating bars */}
          <div className="flex gap-0.5 mt-2">
            <div className="h-1 flex-1 bg-[#FF6B35] rounded-full" />
            <div className="h-1 flex-1 bg-[#FF6B35] rounded-full" />
            <div className="h-1 flex-1 bg-[#FF6B35] rounded-full" />
            <div className="h-1 flex-1 bg-[#FF6B35] rounded-full" />
            <div className="h-1 flex-1 bg-white/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

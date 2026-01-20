"use client";

import { Bot, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardMockData } from "@/lib/mock-data/landing-data";

export function DashboardSidebar() {
  const { systemStatus } = dashboardMockData;
  const cpuUsage = systemStatus.cpuUsage;

  return (
    <div className="hidden md:flex w-16 border-r border-white/5 flex-col items-center py-5 bg-white/[0.02] justify-between flex-shrink-0 z-20">
      {/* Top section */}
      <div className="flex flex-col items-center gap-6">
        {/* Bot icon */}
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center border",
            "bg-white/5 border-white/10 text-white",
            "group hover:border-[#FF6B35]/30 transition-colors"
          )}
        >
          <Bot className="w-4 h-4 group-hover:text-[#FF6B35] transition-colors" />
        </div>

        {/* Divider */}
        <div className="h-px w-8 bg-white/10" />

        {/* System Status label */}
        <div
          className="text-[10px] uppercase font-medium text-slate-500 tracking-widest font-space-mono"
          style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
        >
          System Status
        </div>

        {/* Status indicator */}
        <div className="w-2 h-2 rounded-full bg-[#FF6B35] shadow-[0_0_8px_#FF6B35]" />
      </div>

      {/* Bottom section */}
      <div className="flex flex-col items-center gap-4 w-full px-2">
        {/* CPU label */}
        <div className="text-[9px] text-slate-500 mb-1">CPU</div>

        {/* Circular progress gauge */}
        <div className="relative w-10 h-10">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-white/5"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="text-[#FF6B35]"
              strokeDasharray={`${cpuUsage}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[9px] font-medium text-white">
            {cpuUsage}%
          </div>
        </div>

        {/* Mini bar chart - matching exact HTML heights and colors */}
        <div className="flex items-end justify-center gap-[2px] h-8 w-full">
          <div className="w-1 h-[40%] rounded-t-sm bg-white/20" />
          <div className="w-1 h-[70%] rounded-t-sm bg-[#FF6B35]/40" />
          <div className="w-1 h-[50%] rounded-t-sm bg-white/30" />
          <div className="w-1 h-[80%] rounded-t-sm bg-[#FF6B35] shadow-[0_0_8px_rgba(255,107,53,0.4)]" />
          <div className="w-1 h-[30%] rounded-t-sm bg-white/20" />
        </div>

        {/* Settings button */}
        <button className="mt-4 p-2 rounded-lg hover:bg-white/5 text-slate-400 transition-colors">
          <Settings2 className="w-[18px] h-[18px]" />
        </button>
      </div>
    </div>
  );
}

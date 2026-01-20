"use client";

import {
  MessageSquare,
  Mail,
  Globe,
  User,
  ShieldCheck,
  CheckCircle,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardMockData } from "@/lib/mock-data/landing-data";

// Simple icon map for channels
const channelIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  Mail,
  Globe,
  Slack: () => (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="3" height="8" x="13" y="2" rx="1.5" />
      <path d="M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5" />
      <rect width="3" height="8" x="8" y="14" rx="1.5" />
      <path d="M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5" />
      <rect width="8" height="3" x="14" y="13" rx="1.5" />
      <path d="M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5" />
      <rect width="8" height="3" x="2" y="8" rx="1.5" />
      <path d="M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5" />
    </svg>
  ),
};

export function DashboardContextPanel() {
  const { leadsChart, activeInstructions, channels, leadInfo, securityStatus } = dashboardMockData;

  return (
    <div className="hidden lg:flex w-[320px] border-r border-white/5 flex-col bg-white/[0.01] flex-shrink-0 z-10 backdrop-blur-sm">
      {/* Header */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-5">
        <span className="uppercase text-xs font-medium tracking-wider font-space-mono text-slate-400">
          {leadsChart.title}
        </span>
        <span className="text-xs text-[#FF6B35] font-medium">{leadsChart.change}</span>
      </div>

      {/* Content */}
      <div className="overflow-y-auto custom-scrollbar font-space-mono p-5 space-y-8">
        {/* Bar Chart - matching exact HTML colors */}
        <div className="h-24 w-full flex items-end justify-between gap-1 px-1">
          {leadsChart.bars.map((height, i) => (
            <div
              key={i}
              className={cn(
                "w-full rounded-sm hover:bg-[#FF6B35]/50 transition-all duration-300",
                i === 3
                  ? "bg-[#FF6B35]/80 hover:bg-[#FF6B35] shadow-[0_0_10px_rgba(255,107,53,0.3)]"
                  : i === 4
                  ? "bg-white/40"
                  : "bg-white/5"
              )}
              style={{ height: `${height}%` }}
            />
          ))}
        </div>

        {/* Time Labels */}
        <div className="flex justify-between text-[10px] -mt-6 text-slate-600">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
        </div>

        {/* Active Instructions */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest mb-3 text-slate-400">
            Active Instructions
          </h3>
          <div className="space-y-3">
            {activeInstructions.map((instruction) => (
              <div
                key={instruction.number}
                className="flex gap-3 items-start p-3 rounded-lg border bg-white/[0.02] border-white/5"
              >
                <span className="text-xs font-mono text-[#FF6B35] mt-0.5">
                  {instruction.number}
                </span>
                <p className="leading-relaxed text-xs font-space-mono text-slate-300">
                  {instruction.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Connected Channels */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest mb-3 text-slate-400">
            Connected Channels
          </h3>
          <div className="flex gap-2">
            {channels.map((channel) => {
              const Icon = channelIcons[channel] || MessageSquare;
              return (
                <div
                  key={channel}
                  className={cn(
                    "h-8 w-8 rounded border flex items-center justify-center",
                    "bg-white/5 border-white/10 text-slate-400",
                    "hover:text-[#FF6B35] hover:border-[#FF6B35]/30 transition-all duration-300"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Info */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest mb-3 flex items-center gap-2 text-slate-400">
            <User className="w-3 h-3" />
            Lead Information
          </h3>
          <div className="border border-white/10 rounded-xl p-4 space-y-4 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF6B35]/50 flex items-center justify-center text-sm font-medium shadow-inner text-white">
                {leadInfo.initials}
              </div>
              <div>
                <div className="text-sm font-medium text-white">{leadInfo.name}</div>
                <div className="text-[11px] text-[#FF6B35] font-medium">{leadInfo.status}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-2">
              <div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">
                  Role
                </div>
                <div className="text-xs text-slate-300">{leadInfo.role}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">
                  Company
                </div>
                <div className="text-xs text-slate-300">{leadInfo.company}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">
                  Location
                </div>
                <div className="text-xs text-slate-300">{leadInfo.location}</div>
              </div>
              <div>
                <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">
                  Industry
                </div>
                <div className="text-xs text-slate-300">{leadInfo.industry}</div>
              </div>
            </div>

            {/* Interest Level */}
            <div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1">
                Interest Level
              </div>
              <div className="h-1.5 w-full rounded-full overflow-hidden bg-white/10">
                <div
                  className="h-full bg-[#FF6B35] shadow-[0_0_10px_rgba(255,107,53,0.3)]"
                  style={{ width: `${leadInfo.interestLevel}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest mb-3 text-slate-400">
            Security Status
          </h3>
          <div className="space-y-1">
            {securityStatus.map((status, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-400">
                {status.icon === "ShieldCheck" ? (
                  <ShieldCheck className="w-3 h-3 text-[#FF6B35]" />
                ) : (
                  <CheckCircle className="w-3 h-3 text-[#FF6B35]" />
                )}
                {status.text}
              </div>
            ))}
          </div>
        </div>

        {/* Next Actions */}
        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-widest mb-3 text-slate-400">
            Next Actions
          </h3>
          <div className="flex gap-2 flex-col">
            <button
              className={cn(
                "w-full py-2 px-3 text-xs border rounded-lg flex items-center justify-between transition-all",
                "bg-white/5 hover:bg-white/10 border-white/10 hover:border-[#FF6B35]/20 text-slate-300"
              )}
            >
              Schedule Follow-up
              <ChevronDown className="w-3 h-3" />
            </button>
            <button
              className={cn(
                "w-full py-2 px-3 text-xs border rounded-lg flex items-center justify-between transition-all group",
                "bg-white/5 hover:bg-white/10 border-white/10 hover:border-[#FF6B35]/20 text-slate-300"
              )}
            >
              Send Case Study
              <ArrowRight className="w-3 h-3 group-hover:text-[#FF6B35] transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

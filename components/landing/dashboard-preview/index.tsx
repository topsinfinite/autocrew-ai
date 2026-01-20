"use client";

import { cn } from "@/lib/utils";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardContextPanel } from "./dashboard-context-panel";
import { DashboardChatPanel } from "./dashboard-chat-panel";
import { DashboardAnalyticsPanel } from "./dashboard-analytics-panel";

interface DashboardPreviewProps {
  className?: string;
}

export function DashboardPreview({ className }: DashboardPreviewProps) {
  return (
    <div className={cn("-mb-8 md:px-6 max-w-7xl mx-auto px-4 mt-8", className)}>
      {/* Border Beam Wrapper */}
      <div className="relative w-full rounded-2xl p-[1px]">
        {/* Animated border beam mask */}
        <div className="border-beam-mask rounded-2xl" />

        {/* Main dashboard container */}
        <div
          className={cn(
            "relative w-full h-[850px] overflow-hidden",
            "bg-[#0A0C14] border border-white/10 rounded-2xl shadow-2xl",
            "flex font-geist text-slate-300"
          )}
        >
          {/* Far Left Sidebar - System Status */}
          <DashboardSidebar />

          {/* Left Context Panel - Leads & Instructions */}
          <DashboardContextPanel />

          {/* Main Chat Area */}
          <DashboardChatPanel />

          {/* Right Analytics Panel */}
          <DashboardAnalyticsPanel />
        </div>
      </div>
    </div>
  );
}

export { DashboardSidebar } from "./dashboard-sidebar";
export { DashboardContextPanel } from "./dashboard-context-panel";
export { DashboardChatPanel } from "./dashboard-chat-panel";
export { DashboardAnalyticsPanel } from "./dashboard-analytics-panel";

"use client";

import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/landing/effects";
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
      <BorderBeam containerClassName="w-full rounded-2xl" duration={8}>
        <div
          className={cn(
            "relative w-full h-[650px] md:h-[850px] overflow-hidden",
            "bg-card border border-border/20 rounded-2xl shadow-2xl",
            "flex font-sans text-foreground/80"
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
      </BorderBeam>
    </div>
  );
}

export { DashboardSidebar } from "./dashboard-sidebar";
export { DashboardContextPanel } from "./dashboard-context-panel";
export { DashboardChatPanel } from "./dashboard-chat-panel";
export { DashboardAnalyticsPanel } from "./dashboard-analytics-panel";

"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { DashboardTabId } from "@/lib/mock-data/landing-data";
import { BrowserChrome } from "./browser-chrome";
import { IconSidebar } from "./icon-sidebar";
import { TabChat } from "./tab-chat";
import { TabInbox } from "./tab-inbox";
import { TabAnalytics } from "./tab-analytics";
import { TabSettings } from "./tab-settings";

interface DashboardPreviewProps {
  className?: string;
}

export function DashboardPreview({ className }: DashboardPreviewProps) {
  const [activeTab, setActiveTab] = useState<DashboardTabId>("chat");

  return (
    <div className={cn("md:px-6 max-w-7xl mx-auto px-4 mt-8", className)}>
      {/* Border Beam Wrapper */}
      <div className="relative w-full rounded-2xl p-[1px]">
        {/* Animated border beam mask */}
        <div className="border-beam-mask rounded-2xl" />

        {/* Main dashboard container */}
        <div
          className={cn(
            "relative w-full h-[500px] sm:h-[650px] md:h-[750px] lg:h-[850px] overflow-hidden",
            "bg-[#0A0C14] border border-white/[0.08] rounded-2xl shadow-2xl shadow-black/60",
            "flex flex-col font-geist text-slate-300"
          )}
          style={{
            background:
              "linear-gradient(145deg, rgba(20,20,20,0.98), rgba(8,8,8,0.99))",
          }}
        >
          {/* Browser Chrome */}
          <BrowserChrome />

          {/* Main content area */}
          <div className="flex flex-col lg:flex-row flex-1 min-h-0">
            {/* Icon Sidebar */}
            <IconSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            <div className="flex-1 flex flex-col min-h-0">
              {activeTab === "chat" && <TabChat />}
              {activeTab === "inbox" && <TabInbox />}
              {activeTab === "analytics" && <TabAnalytics />}
              {activeTab === "settings" && <TabSettings />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { DashboardTabId } from "@/lib/mock-data/landing-data";
import { BrowserChrome } from "./browser-chrome";
import { IconSidebar, MobileTabBar } from "./icon-sidebar";
import { TabChat } from "./tab-chat";
import { TabInbox } from "./tab-inbox";
import { TabAnalytics } from "./tab-analytics";
import { TabSettings } from "./tab-settings";

interface DashboardPreviewProps {
  className?: string;
}

const TABS: DashboardTabId[] = ["chat", "inbox", "analytics", "settings"];
const AUTO_NAV_INTERVAL = 10000;

export function DashboardPreview({ className }: DashboardPreviewProps) {
  const [activeTab, setActiveTab] = useState<DashboardTabId>("chat");
  const [isAutoNavigating, setIsAutoNavigating] = useState(true);

  // Auto-navigation logic
  useEffect(() => {
    if (!isAutoNavigating) return;

    const interval = setInterval(() => {
      setActiveTab((current) => {
        const currentIndex = TABS.indexOf(current);
        const nextIndex = (currentIndex + 1) % TABS.length;
        return TABS[nextIndex];
      });
    }, AUTO_NAV_INTERVAL);

    return () => clearInterval(interval);
  }, [isAutoNavigating]);

  const handleTabChange = (tab: DashboardTabId) => {
    setActiveTab(tab);
    setIsAutoNavigating(false); // Stop auto-nav on user interaction
  };

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
            <IconSidebar activeTab={activeTab} onTabChange={handleTabChange} />

            {/* Tab Content */}
            <div className="flex-1 flex flex-col min-h-0">
              {activeTab === "chat" && (
                <TabChat stopAutoNav={() => setIsAutoNavigating(false)} />
              )}
              {activeTab === "inbox" && <TabInbox />}
              {activeTab === "analytics" && <TabAnalytics />}
              {activeTab === "settings" && <TabSettings />}
            </div>
          </div>

          {/* Mobile Tab Bar */}
          <MobileTabBar activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      </div>
    </div>
  );
}

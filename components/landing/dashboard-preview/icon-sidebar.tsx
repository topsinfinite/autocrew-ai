import { MessageCircle, Users, BarChart3, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardTabId } from "@/lib/mock-data/landing-data";

const tabs: { id: DashboardTabId; icon: typeof MessageCircle; label: string }[] = [
  { id: "chat", icon: MessageCircle, label: "Chat" },
  { id: "inbox", icon: Users, label: "Inbox" },
  { id: "analytics", icon: BarChart3, label: "Analytics" },
  { id: "settings", icon: Settings, label: "Settings" },
];

interface IconSidebarProps {
  activeTab: DashboardTabId;
  onTabChange: (tab: DashboardTabId) => void;
}

export function IconSidebar({ activeTab, onTabChange }: IconSidebarProps) {
  return (
    <div className="hidden lg:flex flex-col items-center py-5 px-3 border-r border-white/[0.05] gap-4 w-14 flex-shrink-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer",
              isActive
                ? "bg-[#FF6B35]/10"
                : "hover:bg-white/[0.04]"
            )}
          >
            <Icon
              className="w-4 h-4"
              style={{ color: isActive ? "#FF6B35" : "rgba(255,255,255,0.25)" }}
            />
          </button>
        );
      })}

      <div className="flex-1" />

      <div className="w-8 h-8 rounded-lg hover:bg-white/[0.04] flex items-center justify-center transition-colors">
        <HelpCircle className="w-4 h-4" style={{ color: "rgba(255,255,255,0.2)" }} />
      </div>
    </div>
  );
}

export function MobileTabBar({ activeTab, onTabChange }: IconSidebarProps) {
  return (
    <div className="lg:hidden flex items-stretch border-t border-white/[0.05] flex-shrink-0 bg-[#0A0C14]/80 backdrop-blur-sm">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-2 transition-colors cursor-pointer",
              isActive ? "bg-[#FF6B35]/5" : "hover:bg-white/[0.02]"
            )}
          >
            <Icon
              className="w-4 h-4"
              style={{ color: isActive ? "#FF6B35" : "rgba(255,255,255,0.25)" }}
            />
            <span
              className="text-[9px] font-medium tracking-wide"
              style={{ color: isActive ? "#FF6B35" : "rgba(255,255,255,0.3)" }}
            >
              {tab.label}
            </span>
            {isActive && (
              <div className="w-1 h-1 rounded-full bg-[#FF6B35] absolute bottom-1" />
            )}
          </button>
        );
      })}
    </div>
  );
}

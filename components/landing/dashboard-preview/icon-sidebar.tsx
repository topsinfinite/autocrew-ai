import { MessageCircle, Users, BarChart3, Settings, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DashboardTabId } from "@/lib/mock-data/landing-data";

const tabs = [
  { id: "chat" as const, icon: MessageCircle },
  { id: "inbox" as const, icon: Users },
  { id: "analytics" as const, icon: BarChart3 },
  { id: "settings" as const, icon: Settings },
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

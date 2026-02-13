import { Users, Search, ChevronDown, MessageCircle, Phone, Mail, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardPreviewData } from "@/lib/mock-data/landing-data";
import type { InquiryChannel, InquiryStatus } from "@/lib/mock-data/landing-data";

const channelConfig: Record<InquiryChannel, { icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; color: string; bgColor: string; borderColor: string }> = {
  Chat: { icon: MessageCircle, color: "#FF6B35", bgColor: "bg-[#FF6B35]/10", borderColor: "border-[#FF6B35]/15" },
  Voice: { icon: Phone, color: "#10B981", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/15" },
  Email: { icon: Mail, color: "#0EA5E9", bgColor: "bg-sky-500/10", borderColor: "border-sky-500/15" },
  SMS: { icon: Smartphone, color: "#8B5CF6", bgColor: "bg-violet-500/10", borderColor: "border-violet-500/15" },
};

const statusColors: Record<InquiryStatus, string> = {
  "Resolved": "text-emerald-400/70",
  "In Progress": "text-[#FF6B35]/70",
  "Awaiting": "text-yellow-400/70",
};

const filterTabs = ["All", "Chat", "Voice", "Email", "SMS"];

export function TabInbox() {
  const { inquiries, stats } = dashboardPreviewData.inbox;

  return (
    <div className="flex-1 flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" style={{ color: "#FF6B35" }} />
          <span className="text-sm font-medium text-neutral-300">Support Inquiries</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-white/[0.04] rounded-lg px-2.5 py-1 border border-white/[0.05]">
            <Search className="w-[13px] h-[13px] text-white/25" />
            <span className="text-xs text-neutral-600">Search...</span>
          </div>
          <div className="flex items-center gap-1 cursor-pointer">
            <span className="font-space-mono text-[10px] text-neutral-600 uppercase tracking-wider">Filter</span>
            <ChevronDown className="w-3 h-3 text-white/20" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/[0.04]">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            className={cn(
              "font-space-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md transition-colors",
              tab === "All"
                ? "bg-[#FF6B35]/10 text-[#FF6B35] border border-[#FF6B35]/20"
                : "text-neutral-500 hover:bg-white/[0.04]"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Inquiry List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {inquiries.map((inquiry) => {
          const channel = channelConfig[inquiry.channel];
          const ChannelIcon = channel.icon;
          return (
            <div
              key={inquiry.id}
              className={cn(
                "border-b border-white/[0.04] px-5 py-3.5 hover:bg-white/[0.02] cursor-pointer transition-colors",
                inquiry.isActive && "bg-white/[0.02]"
              )}
            >
              {/* Row 1: Avatar, Name, Channel Badge, Time */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${inquiry.avatarColor} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-[9px] font-medium text-white">{inquiry.initials}</span>
                  </div>
                  <span className="text-sm font-medium text-white">{inquiry.name}</span>
                  <div className={`flex items-center gap-1 ${channel.bgColor} border ${channel.borderColor} rounded-full px-2 py-0.5`}>
                    <ChannelIcon className="w-[9px] h-[9px]" style={{ color: channel.color }} />
                    <span className="font-space-mono text-[9px] uppercase" style={{ color: channel.color }}>
                      {inquiry.channel}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {inquiry.isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
                  )}
                  {!inquiry.isActive && inquiry.status === "Resolved" && (
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                  <span className={cn(
                    "font-space-mono text-[10px]",
                    inquiry.isActive ? "text-[#FF6B35]" : "text-neutral-600"
                  )}>
                    {inquiry.timeAgo}
                  </span>
                </div>
              </div>

              {/* Row 2: Preview text */}
              <p className="text-xs text-neutral-400 truncate">{inquiry.preview}</p>

              {/* Row 3: Agent + Status */}
              <div className="flex items-center gap-3 mt-1.5">
                <span className="font-space-mono text-[10px] text-neutral-600">
                  {inquiry.agentName} &middot; {inquiry.agentRole}
                </span>
                <span className={cn("font-space-mono text-[10px]", statusColors[inquiry.status])}>
                  &bull; {inquiry.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="px-5 py-3 border-t border-white/[0.05] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-space-mono text-[10px] text-neutral-600">
            {stats.totalInquiries} inquiries &middot; {stats.activeCount} active
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-space-mono text-[10px] text-emerald-400/60">
            Avg response: {stats.avgResponse}
          </span>
          <span className="text-neutral-600">&middot;</span>
          <span className="font-space-mono text-[10px] text-neutral-600">{stats.csat} CSAT</span>
        </div>
      </div>
    </div>
  );
}

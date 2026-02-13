import { BarChart3, ChevronDown } from "lucide-react";
import { dashboardPreviewData } from "@/lib/mock-data/landing-data";

export function TabAnalytics() {
  const { stats, barChart, channelBreakdown, topAgents } = dashboardPreviewData.analytics;

  return (
    <div className="flex-1 flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" style={{ color: "#FF6B35" }} />
          <span className="text-sm font-medium text-neutral-300">Analytics Overview</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/[0.04] rounded-lg px-2.5 py-1 border border-white/[0.05] cursor-pointer">
          <span className="font-space-mono text-[10px] text-neutral-500 uppercase tracking-wider">
            Last 7 days
          </span>
          <ChevronDown className="w-3 h-3 text-white/20" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/[0.02] border border-white/[0.04] rounded-xl px-4 py-3">
              <p className="font-space-mono text-[10px] text-neutral-600 uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="text-xl font-semibold tracking-tight text-white">{stat.value}</p>
              <p className="font-space-mono text-[10px] text-emerald-400/70 mt-1">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-neutral-400">Conversations Over Time</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                <span className="font-space-mono text-[10px] text-neutral-600">Chat</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-space-mono text-[10px] text-neutral-600">Voice</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="font-space-mono text-[10px] text-neutral-600">Email</span>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-[6px] h-32">
            {barChart.map((day, i) => (
              <div key={day.day} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`w-full rounded-t ${i === barChart.length - 1 ? "bg-[#FF6B35]/40" : "bg-[#FF6B35]/30"} relative`}
                  style={{ height: `${day.chatHeight}%` }}
                >
                  <div
                    className={`absolute bottom-0 w-full rounded-t ${i === barChart.length - 1 ? "bg-emerald-400/25" : "bg-emerald-400/20"}`}
                    style={{ height: `${day.voiceHeight}%` }}
                  />
                </div>
                <span className={`font-space-mono text-[9px] ${i === barChart.length - 1 ? "text-neutral-500" : "text-neutral-700"}`}>
                  {day.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Breakdown + Top Agents */}
        <div className="grid grid-cols-2 gap-3">
          {/* Channel Breakdown */}
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl px-4 py-3">
            <p className="font-space-mono text-[10px] text-neutral-600 uppercase tracking-wider mb-2">
              Channel Breakdown
            </p>
            <div className="space-y-2">
              {channelBreakdown.map((channel) => (
                <div key={channel.channel}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: channel.color }} />
                      <span className="text-xs text-neutral-400">{channel.channel}</span>
                    </div>
                    <span className="font-space-mono text-xs text-neutral-500">{channel.percentage}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-white/[0.04] mt-1">
                    <div
                      className="h-1 rounded-full"
                      style={{ width: `${channel.percentage}%`, backgroundColor: `${channel.color}80` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Agents */}
          <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl px-4 py-3">
            <p className="font-space-mono text-[10px] text-neutral-600 uppercase tracking-wider mb-2">
              Top Agents
            </p>
            <div className="space-y-2.5">
              {topAgents.map((agent) => (
                <div key={agent.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${agent.avatarColor} flex items-center justify-center`}>
                      <span className="text-[8px] font-medium text-white">{agent.initial}</span>
                    </div>
                    <span className="text-xs text-neutral-300">{agent.name}</span>
                  </div>
                  <span className="font-space-mono text-[10px] text-neutral-500">
                    {agent.conversations} conv
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

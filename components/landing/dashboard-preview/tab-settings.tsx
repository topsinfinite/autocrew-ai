import { Settings, Mic, ToggleLeft, ToggleRight, MessageSquare, Mail, Database, Webhook, ChevronRight } from "lucide-react";
import { dashboardPreviewData } from "@/lib/mock-data/landing-data";

export function TabSettings() {
  const { crewConfig, voiceSettings, toggles, integrations } = dashboardPreviewData.settings;

  return (
    <div className="flex-1 flex flex-col min-h-0 animate-fade-in-up">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" style={{ color: "#FF6B35" }} />
          <span className="text-sm font-medium text-neutral-300">Settings</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/[0.04] rounded-lg px-2.5 py-1 border border-white/[0.05] cursor-pointer">
          <span className="font-space-mono text-[10px] text-neutral-500 uppercase tracking-wider">
            Support Crew
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
        {/* Crew Configuration */}
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 mb-4">
          <p className="font-space-mono text-[10px] text-neutral-600 uppercase tracking-wider mb-3">
            Crew Configuration
          </p>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Name</span>
              <span className="text-xs text-white">{crewConfig.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Type</span>
              <span className="text-xs text-white">{crewConfig.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Status</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="font-space-mono text-[10px] text-emerald-400 uppercase">Active</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Model</span>
              <span className="font-space-mono text-xs text-white">{crewConfig.model}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Temperature</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1 rounded-full bg-white/[0.04]">
                  <div
                    className="h-1 rounded-full bg-[#FF6B35]/50"
                    style={{ width: `${crewConfig.temperature * 100}%` }}
                  />
                </div>
                <span className="font-space-mono text-[10px] text-neutral-500">{crewConfig.temperature}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Voice Settings */}
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Mic className="w-3 h-3 text-neutral-500" />
            <p className="font-space-mono text-[10px] text-neutral-600 uppercase tracking-wider">
              Voice Settings
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Provider</span>
              <span className="text-xs text-white">{voiceSettings.provider}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Voice</span>
              <span className="text-xs text-white">{voiceSettings.voice}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400">Speed</span>
              <span className="font-space-mono text-xs text-white">{voiceSettings.speed}x</span>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4 mb-4">
          <p className="font-space-mono text-[10px] text-neutral-600 uppercase tracking-wider mb-3">
            Features
          </p>
          <div className="space-y-3">
            {toggles.map((toggle) => (
              <div key={toggle.label} className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-300">{toggle.label}</p>
                  <p className="text-[10px] text-neutral-600">{toggle.description}</p>
                </div>
                {toggle.enabled ? (
                  <ToggleRight className="w-5 h-5 text-[#FF6B35] flex-shrink-0" />
                ) : (
                  <ToggleLeft className="w-5 h-5 text-neutral-600 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Integrations */}
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-4">
          <p className="font-space-mono text-[10px] text-neutral-600 uppercase tracking-wider mb-3">
            Integrations
          </p>
          <div className="grid grid-cols-2 gap-2">
            {integrations.map((item) => {
              const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
                MessageSquare,
                Mail,
                Database,
                Webhook,
              };
              const Icon = iconMap[item.icon] || MessageSquare;
              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5 text-neutral-500" />
                    <span className="text-xs text-neutral-300">{item.name}</span>
                  </div>
                  <span
                    className={`font-space-mono text-[9px] uppercase ${
                      item.connected ? "text-emerald-400" : "text-neutral-600"
                    }`}
                  >
                    {item.connected ? "On" : "Off"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 flex gap-2">
          <button className="flex-1 flex items-center justify-between bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-2 hover:bg-white/[0.04] transition-colors">
            <span className="text-xs text-neutral-400">Configure Custom Prompts</span>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
          </button>
        </div>
        <div className="mt-2 flex gap-2">
          <button className="flex-1 flex items-center justify-between bg-white/[0.02] border border-white/[0.04] rounded-lg px-3 py-2 hover:bg-white/[0.04] transition-colors">
            <span className="text-xs text-neutral-400">Manage Knowledge Base</span>
            <ChevronRight className="w-3 h-3 text-neutral-600" />
          </button>
        </div>
      </div>
    </div>
  );
}

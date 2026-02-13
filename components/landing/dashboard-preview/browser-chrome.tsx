import { Lock } from "lucide-react";

export function BrowserChrome() {
  return (
    <div className="px-5 py-3 flex items-center justify-between border-b border-white/[0.06] flex-shrink-0">
      {/* Traffic light dots */}
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
        <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
        <div className="w-3 h-3 rounded-full bg-white/[0.08]" />
      </div>

      {/* URL bar */}
      <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-4 py-1.5 border border-white/[0.04] flex-1 max-w-xs mx-8">
        <Lock className="w-3 h-3 text-white/20" />
        <span className="font-space-mono text-xs text-neutral-600">
          app.autocrew.ai/dashboard
        </span>
      </div>

      {/* User avatar */}
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center">
          <span className="text-[10px] font-medium text-white">A</span>
        </div>
      </div>
    </div>
  );
}

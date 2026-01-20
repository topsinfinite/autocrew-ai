"use client";

import { Bot, Maximize2, MoreHorizontal, Paperclip, Mic, Send, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardMockData } from "@/lib/mock-data/landing-data";

export function DashboardChatPanel() {
  const { chatMessages, quickActions } = dashboardMockData;

  return (
    <div className="flex-1 flex flex-col relative bg-[#0A0C14] z-0">
      {/* Chat Header */}
      <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.01]">
        <div className="flex items-center gap-3">
          <button className="md:hidden text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center border",
              "bg-white/5 border-white/10 text-white"
            )}
          >
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">AutoCrew</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
              <span className="text-[10px] text-slate-400">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-white/5">
            <Maximize2 className="w-[18px] h-[18px]" />
          </button>
          <button className="p-2 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-white/5">
            <MoreHorizontal className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-gradient-to-b from-transparent to-black/20 custom-scrollbar">
        {chatMessages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              "animate-fade-up opacity-0",
              message.type === "user" ? "flex justify-end" : "flex justify-start gap-4"
            )}
            style={{
              animationDelay: `${index * 100}ms`,
              animationFillMode: "forwards",
            }}
          >
            {message.type === "bot" && (
              <div
                className={cn(
                  "h-8 w-8 rounded-lg border flex items-center justify-center flex-shrink-0 mt-1",
                  "bg-white/5 border-white/10"
                )}
              >
                <Bot className="w-4 h-4 text-slate-300" />
              </div>
            )}
            <div className="max-w-[85%] md:max-w-[70%]">
              {message.type === "bot" && (
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-medium text-slate-300">
                    AutoCrew • AI Agent
                  </span>
                </div>
              )}
              <div
                className={cn(
                  "p-4 rounded-2xl",
                  message.type === "user"
                    ? "rounded-tr-sm shadow-lg border bg-white text-black border-white/20"
                    : "rounded-tl-sm border backdrop-blur-sm bg-white/5 border-white/5 text-slate-200"
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.type === "user" && (
                <div className="text-[10px] text-slate-500 text-right mt-1.5 mr-1 font-medium">
                  You • {message.timestamp}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Quick Actions after last bot message */}
        <div className="flex justify-start gap-4">
          <div className="w-8" /> {/* Spacer for alignment with bot avatar */}
          <div className="flex gap-2 flex-wrap">
            {quickActions.map((action) => (
              <button
                key={action}
                className={cn(
                  "text-xs border px-3 py-1.5 rounded-full transition-colors cursor-pointer",
                  "bg-white/5 hover:bg-white/10 border-white/10",
                  "text-slate-300 hover:text-[#FF6B35] hover:border-[#FF6B35]/30"
                )}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 border-t border-white/5 bg-[#0A0C14]">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6B35]/10 to-[#FF6B35]/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <div
            className={cn(
              "relative flex items-center border rounded-xl px-4 py-3 shadow-inner transition-colors",
              "bg-black/50 border-white/10 group-focus-within:border-[#FF6B35]/30"
            )}
          >
            <button className="p-1.5 text-slate-500 transition-colors hover:text-slate-300">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              placeholder="Message AutoCrew..."
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-slate-600 px-3 font-geist focus:ring-0 text-slate-200"
              readOnly
            />
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-slate-500 transition-colors hover:text-slate-300">
                <Mic className="w-5 h-5" />
              </button>
              <button
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  "bg-white text-black hover:bg-[#FF6B35] hover:text-white"
                )}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

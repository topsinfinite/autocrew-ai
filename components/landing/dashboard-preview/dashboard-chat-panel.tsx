"use client";

import { Bot, Maximize2, MoreHorizontal, Paperclip, Mic, Send, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardMockData } from "@/lib/mock-data/landing-data";

export function DashboardChatPanel() {
  const { chatMessages, quickActions } = dashboardMockData;

  return (
    <div className="flex-1 flex flex-col relative bg-card z-0">
      {/* Chat Header */}
      <div className="h-14 border-b border-border/10 flex items-center justify-between px-6 bg-foreground/[0.01]">
        <div className="flex items-center gap-3">
          <button className="md:hidden text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center border",
              "bg-foreground/5 border-border/20 text-foreground"
            )}
          >
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">AutoCrew</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-foreground/5">
            <Maximize2 className="w-[18px] h-[18px]" />
          </button>
          <button className="p-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-foreground/5">
            <MoreHorizontal className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 bg-gradient-to-b from-transparent to-background/20 custom-scrollbar">
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
                  "bg-foreground/5 border-border/20"
                )}
              >
                <Bot className="w-4 h-4 text-foreground/70" />
              </div>
            )}
            <div className="max-w-[85%] md:max-w-[70%]">
              {message.type === "bot" && (
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-medium text-foreground/70">
                    AutoCrew • AI Agent
                  </span>
                </div>
              )}
              <div
                className={cn(
                  "p-4 rounded-2xl",
                  message.type === "user"
                    ? "rounded-tr-sm shadow-lg border bg-foreground text-background border-foreground/20"
                    : "rounded-tl-sm border backdrop-blur-sm bg-foreground/5 border-border/10 text-foreground/90"
                )}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
              </div>
              {message.type === "user" && (
                <div className="text-[10px] text-muted-foreground text-right mt-1.5 mr-1 font-medium">
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
                  "bg-foreground/5 hover:bg-foreground/10 border-border/20",
                  "text-foreground/70 hover:text-primary hover:border-primary/30"
                )}
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 border-t border-border/10 bg-card">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
          <div
            className={cn(
              "relative flex items-center border rounded-xl px-4 py-3 shadow-inner transition-colors",
              "bg-background/50 border-border/20 group-focus-within:border-primary/30"
            )}
          >
            <button className="p-1.5 text-muted-foreground transition-colors hover:text-foreground/70">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              placeholder="Message AutoCrew..."
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 px-3 focus:ring-0 text-foreground"
              readOnly
            />
            <div className="flex items-center gap-2">
              <button className="p-1.5 text-muted-foreground transition-colors hover:text-foreground/70">
                <Mic className="w-5 h-5" />
              </button>
              <button
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  "bg-foreground text-background hover:bg-primary hover:text-primary-foreground"
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

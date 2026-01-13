"use client";

import { useMemo } from "react";
import type { WidgetSettings } from "@/types";
import { WIDGET_DEFAULTS } from "@/lib/constants";
import { MessageSquare, X, Send } from "lucide-react";

interface WidgetPreviewProps {
  settings: WidgetSettings;
  crewName?: string;
}

export function WidgetPreview({ settings, crewName }: WidgetPreviewProps) {
  const config = useMemo(
    () => ({
      primaryColor: settings.primaryColor || WIDGET_DEFAULTS.PRIMARY_COLOR,
      title: settings.widgetTitle || WIDGET_DEFAULTS.TITLE,
      subtitle: settings.widgetSubtitle || WIDGET_DEFAULTS.SUBTITLE,
      welcomeMessage: settings.welcomeMessage || WIDGET_DEFAULTS.WELCOME_MESSAGE,
      position: settings.position || WIDGET_DEFAULTS.POSITION,
      theme: settings.theme || WIDGET_DEFAULTS.THEME,
    }),
    [settings]
  );

  // Determine if using dark theme
  const isDark = config.theme === "dark" ||
    (config.theme === "auto" && typeof window !== "undefined" &&
     window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Theme-aware colors
  const themeColors = isDark
    ? {
        bg: "#1e293b",
        bgSecondary: "#334155",
        text: "#f1f5f9",
        textMuted: "#94a3b8",
        border: "#475569",
        botBubble: "#334155",
        botText: "#f1f5f9",
      }
    : {
        bg: "#ffffff",
        bgSecondary: "#f8fafc",
        text: "#1e293b",
        textMuted: "#64748b",
        border: "#e2e8f0",
        botBubble: "#f1f5f9",
        botText: "#1e293b",
      };

  return (
    <div className="relative">
      {/* Preview Label */}
      <div className="absolute -top-3 left-4 z-10">
        <span className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider bg-primary/10 text-primary rounded-full border border-primary/20">
          Live Preview
        </span>
      </div>

      {/* Preview Container */}
      <div
        className="relative rounded-xl border-2 border-dashed border-border/50 p-6 pt-8"
        style={{ minHeight: "400px" }}
      >
        {/* Simulated Website Background */}
        <div className="absolute inset-6 top-8 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-lg overflow-hidden">
          {/* Fake website content */}
          <div className="p-4 space-y-3">
            <div className="h-4 w-32 bg-slate-300 dark:bg-slate-700 rounded" />
            <div className="h-3 w-48 bg-slate-200 dark:bg-slate-600 rounded" />
            <div className="h-3 w-40 bg-slate-200 dark:bg-slate-600 rounded" />
            <div className="h-20 w-full bg-slate-200 dark:bg-slate-700 rounded mt-4" />
            <div className="h-3 w-36 bg-slate-200 dark:bg-slate-600 rounded" />
            <div className="h-3 w-44 bg-slate-200 dark:bg-slate-600 rounded" />
          </div>

          {/* Widget Preview */}
          <div
            className={`absolute bottom-4 ${
              config.position === "bottom-left" ? "left-4" : "right-4"
            }`}
          >
            {/* Chat Window */}
            <div
              className="w-[280px] rounded-2xl overflow-hidden shadow-2xl mb-3"
              style={{
                backgroundColor: themeColors.bg,
                border: `1px solid ${themeColors.border}`,
              }}
            >
              {/* Header */}
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{ backgroundColor: config.primaryColor }}
              >
                <div>
                  <p className="text-sm font-semibold text-white truncate">
                    {config.title}
                  </p>
                  {config.subtitle && (
                    <p className="text-xs text-white/80 truncate">
                      {config.subtitle}
                    </p>
                  )}
                </div>
                <button className="p-1 hover:bg-white/20 rounded transition-colors">
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              {/* Messages */}
              <div
                className="px-4 py-3 space-y-3"
                style={{
                  backgroundColor: themeColors.bgSecondary,
                  minHeight: "120px",
                }}
              >
                {/* Bot Message */}
                <div className="flex justify-start">
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-2xl rounded-bl-sm text-sm"
                    style={{
                      backgroundColor: themeColors.botBubble,
                      color: themeColors.botText,
                    }}
                  >
                    {config.welcomeMessage}
                  </div>
                </div>

                {/* User Message */}
                <div className="flex justify-end">
                  <div
                    className="max-w-[85%] px-3 py-2 rounded-2xl rounded-br-sm text-sm text-white"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    Hi, I need some help!
                  </div>
                </div>
              </div>

              {/* Input */}
              <div
                className="px-3 py-2 flex items-center gap-2"
                style={{
                  backgroundColor: themeColors.bg,
                  borderTop: `1px solid ${themeColors.border}`,
                }}
              >
                <div
                  className="flex-1 px-3 py-2 rounded-full text-xs"
                  style={{
                    backgroundColor: themeColors.bgSecondary,
                    color: themeColors.textMuted,
                    border: `1px solid ${themeColors.border}`,
                  }}
                >
                  Type a message...
                </div>
                <button
                  className="p-2 rounded-full transition-colors"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <Send className="h-3.5 w-3.5 text-white" />
                </button>
              </div>
            </div>

            {/* Chat Button */}
            <div
              className={`flex ${
                config.position === "bottom-left"
                  ? "justify-start"
                  : "justify-end"
              }`}
            >
              <button
                className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
                style={{ backgroundColor: config.primaryColor }}
              >
                <MessageSquare className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Info */}
      <div className="mt-3 text-center">
        <p className="text-xs text-muted-foreground">
          Preview shows how the widget will appear on your website
        </p>
      </div>
    </div>
  );
}

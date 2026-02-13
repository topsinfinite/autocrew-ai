"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MessageCircle, Star, Play, ArrowUp } from "lucide-react";
import { dashboardPreviewData } from "@/lib/mock-data/landing-data";

const miniWaveBars = [4, 8, 6, 12, 5, 10, 7, 3, 9, 6, 11, 4, 8, 5];

// Delay in ms between each message appearing
const MESSAGE_DELAY = 1500;
// Pause after all messages shown before resetting
const REPLAY_DELAY = 20000;

export function TabChatMessages() {
  const { messages } = dashboardPreviewData.chat;
  const containerRef = useRef<HTMLDivElement>(null);

  // Total items: 1 (timestamp) + messages.length + 1 (typing indicator)
  const totalItems = 1 + messages.length + 1;
  const [visibleCount, setVisibleCount] = useState(0);

  const resetAndReplay = useCallback(() => {
    setVisibleCount(0);
  }, []);

  useEffect(() => {
    if (visibleCount < totalItems) {
      // Reveal next item
      const timer = setTimeout(() => {
        setVisibleCount((prev) => prev + 1);
      }, MESSAGE_DELAY);
      return () => clearTimeout(timer);
    } else {
      // All items shown — wait then replay
      const timer = setTimeout(resetAndReplay, REPLAY_DELAY);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, totalItems, resetAndReplay]);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [visibleCount]);

  // Helper: is item at index visible? Index 0 = timestamp, 1..n = messages, n+1 = typing
  const isVisible = (index: number) => visibleCount > index;

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-neutral-500" />
          <span className="text-sm font-medium text-neutral-300">Conversation</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-space-mono text-[10px] text-[#FF6B35]/50 uppercase tracking-wider">
            Live sync
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]/50 animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        className="flex-1 px-5 py-4 space-y-3 overflow-y-auto custom-scrollbar"
      >
        {/* Timestamp */}
        {isVisible(0) && (
          <div className="flex justify-center animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
            <span className="font-space-mono text-[10px] text-neutral-600 bg-white/[0.03] rounded-full px-3 py-1 uppercase tracking-wider border border-white/[0.04]">
              Today 2:12 PM
            </span>
          </div>
        )}

        {/* Chat messages */}
        {messages.map((message, i) => {
          if (!isVisible(i + 1)) return null;

          if (message.sender === "user") {
            return (
              <div
                key={message.id}
                className="flex justify-end animate-fade-up opacity-0"
                style={{ animationFillMode: "forwards" }}
              >
                <div className="max-w-[80%]">
                  <div className="bg-[#FF6B35] rounded-2xl rounded-tr-md px-3.5 py-2.5">
                    <p className="text-sm text-white">{message.content}</p>
                  </div>
                  <span className="font-space-mono text-[10px] text-neutral-600 mt-1 block mr-1 text-right">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={message.id}
              className="flex justify-start animate-fade-up opacity-0"
              style={{ animationFillMode: "forwards" }}
            >
              <div className="flex items-start gap-2 max-w-[85%]">
                <div className="w-6 h-6 rounded-full bg-[#FF6B35]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Star className="w-[10px] h-[10px] fill-[#FF6B35] text-[#FF6B35]" />
                </div>
                <div>
                  <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl rounded-tl-md px-3.5 py-2.5">
                    <p className="text-sm text-neutral-300">{message.content}</p>
                  </div>

                  {message.isVoiceClip && (
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl rounded-tl-md px-3 py-2 mt-1.5 flex items-center gap-2.5 w-fit">
                      <button className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center flex-shrink-0">
                        <Play className="w-[9px] h-[9px] text-white ml-[1px]" />
                      </button>
                      <div className="flex items-center gap-[1.5px] h-3.5">
                        {miniWaveBars.map((height, idx) => (
                          <div
                            key={idx}
                            className="w-[2px] rounded-full bg-[#FF6B35]/40"
                            style={{ height: `${height}px` }}
                          />
                        ))}
                      </div>
                      <span className="font-space-mono text-[10px] text-neutral-600">
                        {message.voiceDuration}
                      </span>
                    </div>
                  )}

                  <span className="font-space-mono text-[10px] text-neutral-600 mt-1 block ml-1">
                    {message.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator — shows after all messages */}
        {isVisible(1 + messages.length) && (
          <div className="flex justify-start animate-fade-up opacity-0" style={{ animationFillMode: "forwards" }}>
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-[#FF6B35]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Star className="w-[10px] h-[10px] fill-[#FF6B35] text-[#FF6B35]" />
              </div>
              <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl rounded-tl-md px-3.5 py-2.5 flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]/60 inline-block animate-dot-bounce" />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]/60 inline-block animate-dot-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]/60 inline-block animate-dot-bounce"
                  style={{ animationDelay: "0.4s" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="px-5 py-3 border-t border-white/[0.05] flex items-center gap-2 flex-shrink-0">
        <div className="flex-1 bg-white/[0.02] border border-white/[0.04] rounded-xl px-4 py-2.5">
          <span className="text-sm text-neutral-500">Message...</span>
        </div>
        <button className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] flex items-center justify-center shadow-lg shadow-[#FF6B35]/20">
          <ArrowUp className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

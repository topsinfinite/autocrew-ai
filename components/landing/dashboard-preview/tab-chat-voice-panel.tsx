"use client";

import { useEffect, useState } from "react";
import { Activity, Mic, PhoneOff, Volume2 } from "lucide-react";
import { dashboardPreviewData } from "@/lib/mock-data/landing-data";

// Deterministic waveform bar parameters (avoid Math.random for SSR)
const waveBars = Array.from({ length: 24 }, (_, i) => ({
  height: 20 + ((i * 17 + 7) % 65),
  duration: (0.4 + ((i * 13 + 3) % 70) / 100).toFixed(2),
  delay: (i * 0.05).toFixed(2),
}));

export function TabChatVoicePanel() {
  const { voicePanel } = dashboardPreviewData.chat;
  const [elapsed, setElapsed] = useState(134); // Start at 2:14
  const [transcriptIndex, setTranscriptIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTranscriptIndex((prev) => (prev + 1) % voicePanel.transcripts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [voicePanel.transcripts.length]);

  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(elapsed % 60).padStart(2, "0");

  return (
    <div
      className="w-full sm:w-[280px] lg:w-[320px] flex flex-col items-center justify-center relative p-6 flex-shrink-0"
      style={{
        background: "linear-gradient(180deg, rgba(255,107,53,0.06) 0%, rgba(0,0,0,0) 100%)",
      }}
    >
      {/* Live indicator */}
      <div className="absolute top-5 left-5 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-space-mono text-[10px] text-neutral-600 uppercase tracking-wider">
          Live
        </span>
      </div>

      {/* Crew name */}
      <div className="absolute top-5 right-5">
        <span className="font-space-mono text-[10px] text-neutral-600 uppercase tracking-wider">
          {voicePanel.crewName}
        </span>
      </div>

      {/* Animated avatar */}
      <div className="relative mb-6 mt-8">
        <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#FF4444] flex items-center justify-center shadow-xl shadow-[#FF6B35]/25 animate-morph-blob">
          <Activity className="w-7 h-7 text-white" />
        </div>

        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full border border-[#FF6B35]/20 animate-pulse-ring" />
        <div
          className="absolute inset-0 rounded-full border border-[#FF6B35]/10 animate-pulse-ring"
          style={{ animationDelay: "0.8s" }}
        />

        {/* Green status dot */}
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#0A0C14] flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
      </div>

      {/* Agent info */}
      <p className="text-sm font-medium text-white mb-1">AutoCrew is speaking</p>
      <span className="font-space-mono text-xs text-neutral-500 mb-1">
        {voicePanel.agentName} &middot; {voicePanel.agentRole}
      </span>
      <span className="font-space-mono text-[11px] text-neutral-600">
        {minutes}:{seconds}
      </span>

      {/* Audio waveform */}
      <div className="flex items-center gap-[2px] h-10 mt-5">
        {waveBars.map((bar, i) => (
          <div
            key={i}
            className="w-[2.5px] rounded-full bg-[#FF6B35]/40 animate-wave-bar"
            style={{
              ["--wave-height" as string]: `${bar.height}%`,
              ["--wave-duration" as string]: `${bar.duration}s`,
              ["--wave-delay" as string]: `${bar.delay}s`,
              height: `${bar.height}%`,
            }}
          />
        ))}
      </div>

      {/* Live transcript */}
      <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl px-4 py-3 w-full mt-5">
        <p className="font-space-mono text-xs text-neutral-500 mb-1.5 uppercase tracking-wider">
          Live transcript
        </p>
        <p className="text-sm text-neutral-300 leading-relaxed">
          {voicePanel.transcripts[transcriptIndex]}
        </p>
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-3 mt-5">
        <button className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-colors border border-white/[0.05]">
          <Mic className="w-4 h-4 text-white/50" />
        </button>
        <button className="w-11 h-11 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center transition-colors border border-red-500/15">
          <PhoneOff className="w-[18px] h-[18px] text-red-400" />
        </button>
        <button className="w-9 h-9 rounded-full bg-white/[0.04] hover:bg-white/[0.08] flex items-center justify-center transition-colors border border-white/[0.05]">
          <Volume2 className="w-4 h-4 text-white/50" />
        </button>
      </div>
    </div>
  );
}

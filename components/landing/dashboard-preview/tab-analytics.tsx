"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { BarChart3, ChevronDown } from "lucide-react";
import { dashboardPreviewData } from "@/lib/mock-data/landing-data";

/** Parse a display string like "1,847" or "94.7%" into a number and its format parts. */
function parseStatValue(value: string): {
  prefix: string;
  number: number;
  decimals: number;
  suffix: string;
  useCommas: boolean;
} {
  const match = value.match(/^([^\d]*)([\d,]+\.?\d*)(.*)$/);
  if (!match)
    return {
      prefix: "",
      number: 0,
      decimals: 0,
      suffix: value,
      useCommas: false,
    };
  const [, prefix, numStr, suffix] = match;
  const useCommas = numStr.includes(",");
  const clean = numStr.replace(/,/g, "");
  const decimals = clean.includes(".") ? clean.split(".")[1].length : 0;
  return { prefix, number: parseFloat(clean), decimals, suffix, useCommas };
}

function formatStatValue(
  current: number,
  decimals: number,
  suffix: string,
  prefix: string,
  useCommas: boolean,
): string {
  let formatted =
    decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString();
  if (useCommas) {
    const [intPart, decPart] = formatted.split(".");
    formatted =
      intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
      (decPart ? `.${decPart}` : "");
  }
  return `${prefix}${formatted}${suffix}`;
}

const ANIMATION_DURATION = 1000; // ms

function useCountUp(target: number, active: boolean): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  return value;
}

function AnimatedStat({ value, active }: { value: string; active: boolean }) {
  const parsed = parseStatValue(value);
  const current = useCountUp(parsed.number, active);
  const display = active
    ? formatStatValue(
        current,
        parsed.decimals,
        parsed.suffix,
        parsed.prefix,
        parsed.useCommas,
      )
    : value;
  return <>{display}</>;
}

function AnimatedPercentage({
  target,
  active,
}: {
  target: number;
  active: boolean;
}) {
  const current = useCountUp(target, active);
  return <>{Math.round(current)}%</>;
}

export function TabAnalytics() {
  const { stats, barChart, channelBreakdown, topAgents } =
    dashboardPreviewData.analytics;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Small delay so the entrance fade-in-up plays first
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const isLast = useCallback(
    (i: number) => i === barChart.length - 1,
    [barChart.length],
  );

  return (
    <div className="flex-1 flex flex-col animate-fade-in-up">
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/[0.05] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" style={{ color: "#FF6B35" }} />
          <span className="text-sm font-medium text-neutral-300">
            Analytics Overview
          </span>
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
            <div
              key={stat.label}
              className="bg-white/[0.02] border border-white/[0.04] rounded-xl px-4 py-3"
            >
              <p className="font-space-mono text-[10px] text-neutral-600 uppercase tracking-wider mb-1">
                {stat.label}
              </p>
              <p className="text-xl font-semibold tracking-tight text-white">
                <AnimatedStat value={stat.value} active={mounted} />
              </p>
              <p className="font-space-mono text-[10px] text-emerald-400/70 mt-1">
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-neutral-400">
              Conversations Over Time
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#FF6B35]" />
                <span className="font-space-mono text-[10px] text-neutral-600">
                  Chat
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-space-mono text-[10px] text-neutral-600">
                  Voice
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-sky-400" />
                <span className="font-space-mono text-[10px] text-neutral-600">
                  Email
                </span>
              </div>
            </div>
          </div>

          {/* Bars — each column is a group of 3 side-by-side bars */}
          <div className="flex gap-[6px]">
            {barChart.map((day, i) => (
              <div
                key={day.day}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div className="flex items-end gap-px w-full h-28">
                  {/* Chat bar */}
                  <div
                    className={`flex-1 rounded-t ${isLast(i) ? "bg-[#FF6B35]/50" : "bg-[#FF6B35]/30"}`}
                    style={{
                      height: mounted ? `${day.chatHeight}%` : "0%",
                      transition: `height 0.6s ease-out ${i * 0.07}s`,
                    }}
                  />
                  {/* Voice bar */}
                  <div
                    className={`flex-1 rounded-t ${isLast(i) ? "bg-emerald-400/40" : "bg-emerald-400/25"}`}
                    style={{
                      height: mounted ? `${day.voiceHeight}%` : "0%",
                      transition: `height 0.6s ease-out ${i * 0.07 + 0.05}s`,
                    }}
                  />
                  {/* Email bar */}
                  <div
                    className={`flex-1 rounded-t ${isLast(i) ? "bg-sky-400/40" : "bg-sky-400/25"}`}
                    style={{
                      height: mounted ? `${day.emailHeight}%` : "0%",
                      transition: `height 0.6s ease-out ${i * 0.07 + 0.1}s`,
                    }}
                  />
                </div>
                <span
                  className={`font-space-mono text-[9px] ${isLast(i) ? "text-neutral-500" : "text-neutral-700"}`}
                >
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
              {channelBreakdown.map((channel, i) => (
                <div key={channel.channel}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: channel.color }}
                      />
                      <span className="text-xs text-neutral-400">
                        {channel.channel}
                      </span>
                    </div>
                    <span className="font-space-mono text-xs text-neutral-500">
                      <AnimatedPercentage
                        target={channel.percentage}
                        active={mounted}
                      />
                    </span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-white/[0.04] mt-1">
                    <div
                      className="h-1 rounded-full"
                      style={{
                        width: mounted ? `${channel.percentage}%` : "0%",
                        backgroundColor: `${channel.color}80`,
                        transition: `width 0.8s ease-out ${0.3 + i * 0.1}s`,
                      }}
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
                <div
                  key={agent.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    {agent.avatarUrl ? (
                      <Image
                        src={agent.avatarUrl}
                        alt={agent.name}
                        width={20}
                        height={20}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-5 h-5 rounded-full bg-gradient-to-br ${agent.avatarColor} flex items-center justify-center`}
                      >
                        <span className="text-[8px] font-medium text-white">
                          {agent.initial}
                        </span>
                      </div>
                    )}
                    <span className="text-xs text-neutral-300">
                      {agent.name}
                    </span>
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

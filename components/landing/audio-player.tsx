"use client";

import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// Stagger config for 20 wave bars: [delay (s), duration (s)]
const BAR_TIMING: [number, number][] = [
  [0.0, 0.9],
  [0.2, 1.1],
  [0.4, 0.8],
  [0.1, 1.2],
  [0.5, 0.95],
  [0.3, 1.05],
  [0.6, 0.85],
  [0.2, 1.15],
  [0.7, 0.9],
  [0.4, 1.2],
  [0.1, 0.8],
  [0.5, 1.1],
  [0.8, 0.95],
  [0.3, 1.0],
  [0.6, 1.2],
  [0.2, 0.85],
  [0.7, 1.1],
  [0.1, 0.9],
  [0.5, 1.15],
  [0.4, 0.95],
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface AudioPlayerProps {
  src?: string;
  label?: string;
  duration?: string;
}

export function AudioPlayer({
  src = "/audio/Demo Call with Sarah.mp3",
  label = "Listen to real-life demo",
  duration = "5:07",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      setTimeout(() => setCurrentTime(0), 500);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const handleClick = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <>
      {/* Hidden native audio element */}
      <audio ref={audioRef} src={src} preload="metadata" />

      {/* Player widget */}
      <button
        type="button"
        onClick={handleClick}
        aria-label={isPlaying ? "Pause audio" : "Play AI voice sample"}
        className={cn(
          "group relative flex items-center gap-3 p-1.5 pr-6 rounded-full cursor-pointer transition-all duration-500 overflow-hidden",
          "w-full sm:w-[260px] h-[60px]",
          "backdrop-blur-2xl",
          isPlaying
            ? "bg-[#18181f]/90 border border-[#FF6B35]/50"
            : "bg-[#111116]/80 border border-white/10 hover:bg-[#18181f]/90 hover:border-[#FF6B35]/40",
        )}
      >
        {/* Play / Pause button circle */}
        <div className="relative flex items-center justify-center min-w-[48px] h-12 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#ff8c42] shadow-[0_0_15px_rgba(255,107,53,0.2)] group-hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] transition-all duration-300 z-20 flex-shrink-0">
          {/* Inner dark bg that fades on play */}
          <div
            className={cn(
              "absolute inset-[2px] rounded-full flex items-center justify-center z-10 transition-colors duration-500",
              isPlaying ? "bg-transparent" : "bg-[#09090b]",
            )}
          >
            {/* Play icon */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={cn(
                "w-5 h-5 text-[#FF6B35] ml-0.5 transition-all duration-300",
                isPlaying ? "scale-0 opacity-0" : "scale-100 opacity-100",
              )}
              aria-hidden="true"
            >
              <polygon points="5,3 19,12 5,21" />
            </svg>
            {/* Pause icon */}
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className={cn(
                "w-5 h-5 text-white absolute transition-all duration-300",
                isPlaying ? "scale-100 opacity-100" : "scale-50 opacity-0",
              )}
              aria-hidden="true"
            >
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          </div>

          {/* Ripple rings */}
          <span
            className={cn(
              "absolute inset-0 rounded-full border border-[#FF6B35]/50 z-0",
              isPlaying && "animate-audio-ripple",
            )}
          />
          <span
            className={cn(
              "absolute inset-0 rounded-full border border-[#FF6B35]/50 z-0",
              isPlaying && "animate-audio-ripple [animation-delay:1s]",
            )}
          />
        </div>

        {/* Text area */}
        <div className="flex flex-col justify-center h-full w-full relative z-10 overflow-hidden">
          {/* Idle text */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col justify-center transition-all duration-500 pointer-events-none",
              isPlaying
                ? "-translate-y-4 opacity-0"
                : "translate-y-0 opacity-100",
            )}
          >
            <span className="text-sm font-semibold text-gray-100 tracking-wide font-space-grotesk text-left">
              {label}
            </span>
            <span className="text-[11px] text-gray-500 font-medium mt-0.5 text-left">
              Tap to listen • {duration}
            </span>
          </div>

          {/* Animated wave bars */}
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-start gap-[2px] transition-all duration-500 pointer-events-none pl-1",
              isPlaying
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
          >
            {BAR_TIMING.map(([delay, dur], i) => (
              <span
                key={i}
                className={cn(
                  "w-[3px] rounded-sm bg-[#FF6B35] origin-center",
                  isPlaying ? "animate-audio-wave" : "",
                )}
                style={{
                  height: "24px",
                  transform: "scaleY(0.15)",
                  animationDelay: `${delay}s`,
                  animationDuration: `${dur}s`,
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>

        {/* Time counter badge */}
        <span
          className={cn(
            "absolute right-4 text-xs font-mono font-medium text-[#FF6B35] pointer-events-none z-20",
            "bg-[#18181f] border border-white/5 px-2 py-1 rounded transition-all duration-500",
            isPlaying
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-4",
          )}
          aria-live="off"
        >
          {formatTime(currentTime)}
        </span>
      </button>
    </>
  );
}

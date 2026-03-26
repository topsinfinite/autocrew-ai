"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
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

// Reusable play/pause circle button
function PlayPauseButton({
  isPlaying,
  size = "lg",
}: {
  isPlaying: boolean;
  size?: "lg" | "sm";
}) {
  const dim = size === "lg" ? "min-w-[48px] h-12" : "min-w-[40px] h-10";
  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#ff8c42] transition-all duration-300 z-20 shrink-0",
        size === "lg"
          ? "shadow-[0_0_15px_rgba(255,107,53,0.2)] group-hover:shadow-[0_0_20px_rgba(255,107,53,0.4)]"
          : "shadow-[0_0_12px_rgba(255,107,53,0.3)]",
        dim,
      )}
    >
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
            "text-[#FF6B35] ml-0.5 transition-all duration-300",
            size === "lg" ? "w-5 h-5" : "w-4 h-4",
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
            "text-white absolute transition-all duration-300",
            size === "lg" ? "w-5 h-5" : "w-4 h-4",
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
  );
}

// Reusable wave bars
function WaveBars({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex items-center gap-[2px]">
      {BAR_TIMING.map(([delay, dur], i) => (
        <span
          key={i}
          className={cn(
            "w-[3px] rounded-sm bg-[#FF6B35] origin-center shrink-0",
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
  );
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
  const playerRef = useRef<HTMLButtonElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);
  const [renderPortal, setRenderPortal] = useState(false);
  const [stickyIn, setStickyIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // SSR safety — only render portals on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Wire up audio events
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

  // Track when the hero player scrolls out of view
  useEffect(() => {
    const el = playerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Show/hide sticky portal with slide animation
  const showSticky = isPlaying && !heroVisible;
  useEffect(() => {
    if (showSticky) {
      setRenderPortal(true);
      // next frame so the translate-y transition fires
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setStickyIn(true));
      });
    } else {
      setStickyIn(false);
      const t = setTimeout(() => setRenderPortal(false), 350);
      return () => clearTimeout(t);
    }
  }, [showSticky]);

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

      {/* Hero player widget */}
      <button
        ref={playerRef}
        type="button"
        onClick={handleClick}
        aria-label={isPlaying ? "Pause audio" : "Play AI voice sample"}
        className={cn(
          "group relative flex items-center gap-3 p-1.5 pr-4 rounded-full cursor-pointer transition-all duration-500 overflow-hidden",
          "w-full sm:w-[260px] h-[60px]",
          "backdrop-blur-2xl",
          isPlaying
            ? "bg-[#18181f]/90 border border-[#FF6B35]/50"
            : "bg-[#111116]/80 border border-white/10 hover:bg-[#18181f]/90 hover:border-[#FF6B35]/40",
        )}
      >
        <PlayPauseButton isPlaying={isPlaying} size="lg" />

        {/* Content area — idle text overlaps wave bars */}
        <div className="flex-1 min-w-0 relative h-full flex items-center overflow-hidden z-10">
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

          {/* Wave bars — natural width */}
          <div
            className={cn(
              "transition-all duration-500 pointer-events-none pl-1",
              isPlaying
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0",
            )}
          >
            <WaveBars isPlaying={isPlaying} />
          </div>
        </div>

        {/* Time counter badge */}
        <span
          className={cn(
            "shrink-0 text-xs font-mono font-medium text-[#FF6B35] z-20",
            "bg-[#18181f] border border-white/5 px-2 py-1 rounded transition-all duration-500",
            isPlaying
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-2 pointer-events-none",
          )}
          aria-live="off"
        >
          {formatTime(currentTime)}
        </span>
      </button>

      {/* Sticky top bar — portal, mounted only on client */}
      {isMounted &&
        renderPortal &&
        createPortal(
          <div
            className={cn(
              "fixed top-0 inset-x-0 z-[100] transition-transform duration-300 ease-out",
              "bg-[#09090b]/95 backdrop-blur-xl border-b border-[#FF6B35]/20",
              stickyIn ? "translate-y-0" : "-translate-y-full",
            )}
            role="region"
            aria-label="Audio player"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-3 h-[56px]">
              {/* Play/pause */}
              <button
                type="button"
                onClick={handleClick}
                aria-label="Pause audio"
                className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35] rounded-full"
              >
                <PlayPauseButton isPlaying={isPlaying} size="sm" />
              </button>

              {/* Wave bars */}
              <WaveBars isPlaying={isPlaying} />

              {/* Label + time */}
              <div className="flex items-center gap-2 ml-2 min-w-0">
                <span className="text-sm font-semibold text-gray-100 font-space-grotesk truncate">
                  {label}
                </span>
                <span className="shrink-0 text-xs font-mono font-medium text-[#FF6B35] bg-[#18181f] border border-white/5 px-2 py-0.5 rounded">
                  {formatTime(currentTime)}
                </span>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

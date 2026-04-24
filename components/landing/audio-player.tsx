"use client";

import { useRef, useState, useEffect, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Volume2, VolumeX } from "lucide-react";
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
  /** When true, the player fills 100% of its parent's width at every breakpoint. */
  fullWidth?: boolean;
  /** When true, audio auto-plays muted on mount and exposes a mute/unmute toggle. */
  autoPlay?: boolean;
}

export function AudioPlayer({
  src = "/audio/Demo Call with Sarah.mp3",
  label = "Listen to real-life demo",
  duration = "4:32",
  fullWidth = false,
  autoPlay = false,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playerRef = useRef<HTMLButtonElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [heroVisible, setHeroVisible] = useState(true);
  const [renderPortal, setRenderPortal] = useState(false);
  const [stickyIn, setStickyIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMuted, setIsMuted] = useState(autoPlay);
  const [showUnmuteTooltip, setShowUnmuteTooltip] = useState(false);

  // SSR safety — only render portals on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-play muted on mount (browsers block unmuted autoplay)
  useEffect(() => {
    if (!autoPlay) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = true;
    setIsMuted(true);
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => {
          setIsPlaying(true);
          setShowUnmuteTooltip(true);
        })
        .catch(() => {
          // Autoplay blocked — leave the user to start manually
        });
    }
  }, [autoPlay]);

  // Hide the unmute tooltip after a few seconds
  useEffect(() => {
    if (!showUnmuteTooltip) return;
    const t = setTimeout(() => setShowUnmuteTooltip(false), 6000);
    return () => clearTimeout(t);
  }, [showUnmuteTooltip]);

  // Wire up audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      setIsPlaying(false);
      setTimeout(() => setCurrentTime(0), 500);
    };
    const onLoadedMetadata = () => {
      if (Number.isFinite(audio.duration)) setAudioDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    if (audio.readyState >= 1 && Number.isFinite(audio.duration)) {
      setAudioDuration(audio.duration);
    }
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
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

  const handleMuteToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const audio = audioRef.current;
    if (!audio) return;
    const nextMuted = !audio.muted;
    audio.muted = nextMuted;
    setIsMuted(nextMuted);
    setShowUnmuteTooltip(false);
    // When unmuting, restart from the beginning so the visitor hears the
    // intro of the demo call, not whatever was playing silently.
    if (!nextMuted) {
      audio.currentTime = 0;
      setCurrentTime(0);
    }
    if (audio.paused) {
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
          fullWidth ? "w-full h-[60px]" : "w-full sm:w-[320px] h-[60px]",
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
            <span className="text-sm font-semibold text-gray-100 tracking-wide font-space-grotesk text-left whitespace-nowrap">
              {label}
            </span>
            <span className="text-[11px] text-gray-500 font-medium mt-0.5 text-left whitespace-nowrap">
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

        {/* Mute toggle — only when auto-play is enabled */}
        {autoPlay ? (
          <span className="relative z-20 shrink-0">
            {isMuted && showUnmuteTooltip ? (
              <span className="pointer-events-none absolute -top-9 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center animate-bounce">
                <span className="whitespace-nowrap rounded bg-[#FF6B35] px-2 py-1 text-[10px] font-medium text-white shadow-lg">
                  Tap to unmute
                </span>
                <span className="h-0 w-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-[#FF6B35]" />
              </span>
            ) : null}
            <span
              role="button"
              tabIndex={0}
              onClick={handleMuteToggle as unknown as (e: MouseEvent<HTMLSpanElement>) => void}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  e.stopPropagation();
                  handleMuteToggle(
                    e as unknown as MouseEvent<HTMLButtonElement>,
                  );
                }
              }}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
                isMuted
                  ? "border-[#FF6B35]/40 bg-[#FF6B35]/10 hover:bg-[#FF6B35]/20"
                  : "border-white/10 bg-white/[0.04] hover:bg-white/[0.08]",
              )}
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-[#FF6B35]" />
              ) : (
                <Volume2 className="h-4 w-4 text-white/70" />
              )}
            </span>
          </span>
        ) : null}

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

      {/* Floating dock — mini play/pause circle with a progress ring.
          Appears when the hero player scrolls out of view and audio is
          playing. Docked bottom-left so it doesn't collide with the nav
          (top) or the widget chat bubble (bottom-right). */}
      {isMounted &&
        renderPortal &&
        (() => {
          const ringRadius = 28;
          const ringCircumference = 2 * Math.PI * ringRadius;
          const progress =
            audioDuration > 0
              ? Math.min(1, Math.max(0, currentTime / audioDuration))
              : 0;
          const dashOffset = ringCircumference * (1 - progress);
          return createPortal(
            <div
              className={cn(
                "fixed bottom-6 left-6 z-[60] transition-all duration-300 ease-out",
                "[padding-bottom:env(safe-area-inset-bottom)]",
                stickyIn
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-[calc(100%+1.5rem)] opacity-0",
              )}
              role="region"
              aria-label="Audio player — docked"
            >
              <div className="group relative">
                {/* Progress ring around the button */}
                <svg
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -rotate-90"
                  width="60"
                  height="60"
                  viewBox="0 0 60 60"
                >
                  <circle
                    cx="30"
                    cy="30"
                    r={ringRadius}
                    fill="none"
                    stroke="rgba(255, 107, 53, 0.18)"
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="30"
                    cy="30"
                    r={ringRadius}
                    fill="none"
                    stroke="#FF6B35"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeDasharray={ringCircumference}
                    strokeDashoffset={dashOffset}
                    style={{ transition: "stroke-dashoffset 0.25s linear" }}
                  />
                </svg>

                {/* Play/pause — reuses the in-page PlayPauseButton */}
                <button
                  type="button"
                  onClick={handleClick}
                  aria-label={isPlaying ? "Pause audio" : "Play audio"}
                  className="relative block h-[60px] w-[60px] rounded-full p-[6px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]"
                >
                  <PlayPauseButton isPlaying={isPlaying} size="lg" />
                </button>

                {/* Tooltip — reveals label + time on hover/focus */}
                <div
                  className={cn(
                    "pointer-events-none absolute bottom-full left-0 mb-2 whitespace-nowrap",
                    "rounded-full border border-white/10 bg-[#0a0a10]/95 backdrop-blur-xl",
                    "px-3 py-1.5 font-space-mono text-[10px] uppercase tracking-[0.18em] text-white/75",
                    "opacity-0 translate-y-1 transition-all duration-200",
                    "group-hover:opacity-100 group-hover:translate-y-0",
                    "group-focus-within:opacity-100 group-focus-within:translate-y-0",
                  )}
                  role="tooltip"
                >
                  {label} &middot; {formatTime(currentTime)}
                  {audioDuration > 0
                    ? ` / ${formatTime(audioDuration)}`
                    : ""}
                </div>

                {/* Mute toggle — hover-revealed, docks at top-right of the dot */}
                {autoPlay ? (
                  <button
                    type="button"
                    onClick={handleMuteToggle}
                    aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                    className={cn(
                      "absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border shadow-md transition-all",
                      "opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-within:opacity-100 group-focus-within:translate-x-0",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B35]",
                      isMuted
                        ? "bg-[#FF6B35] border-[#FF6B35] hover:bg-[#ff7a45]"
                        : "bg-[#18181f] border-white/15 hover:bg-[#22222a]",
                    )}
                  >
                    {isMuted ? (
                      <VolumeX className="h-3 w-3 text-white" />
                    ) : (
                      <Volume2 className="h-3 w-3 text-white/85" />
                    )}
                  </button>
                ) : null}
              </div>
            </div>,
            document.body,
          );
        })()}
    </>
  );
}

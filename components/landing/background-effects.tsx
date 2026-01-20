"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

interface BackgroundEffectsProps {
  className?: string;
  unicornStudioProjectId?: string;
  showGrid?: boolean;
  showAccentGlow?: boolean;
  showAnimatedGradient?: boolean;
}

export function BackgroundEffects({
  className,
  unicornStudioProjectId,
  showGrid = true,
  showAccentGlow = true,
  showAnimatedGradient = true,
}: BackgroundEffectsProps) {
  const [unicornLoaded, setUnicornLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load Unicorn Studio script if project ID is provided
  useEffect(() => {
    if (!unicornStudioProjectId) return;

    // Check if already loaded
    if (window.UnicornStudio?.isInitialized) {
      setUnicornLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/AiCEG/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js";
    script.async = true;
    script.onload = () => {
      if (!window.UnicornStudio?.isInitialized) {
        window.UnicornStudio?.init?.();
        window.UnicornStudio = { ...window.UnicornStudio, isInitialized: true };
      }
      setUnicornLoaded(true);
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [unicornStudioProjectId]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className
      )}
    >
      {/* Unicorn Studio Animated Background */}
      {unicornStudioProjectId && (
        <div
          className="absolute inset-0 h-[800px] saturate-150"
          style={{
            maskImage: "linear-gradient(transparent, black 0%, black 80%, transparent)",
            WebkitMaskImage: "linear-gradient(transparent, black 0%, black 80%, transparent)",
          }}
        >
          <div
            data-us-project={unicornStudioProjectId}
            className="absolute inset-0 -z-10 h-full w-full"
          />
        </div>
      )}

      {/* CSS Animated Gradient Fallback */}
      {showAnimatedGradient && !unicornLoaded && (
        <div
          className="absolute inset-0 h-[800px]"
          style={{
            maskImage: "linear-gradient(transparent, black 0%, black 80%, transparent)",
            WebkitMaskImage: "linear-gradient(transparent, black 0%, black 80%, transparent)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 animate-pulse" />
          <div
            className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[100px] animate-pulse"
            style={{ animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-secondary/10 blur-[100px] animate-pulse"
            style={{ animationDelay: "2s" }}
          />
        </div>
      )}

      {/* Grid Overlay */}
      {showGrid && (
        <div className="absolute inset-0 grid-overlay opacity-100" />
      )}

      {/* Accent Glow */}
      {showAccentGlow && (
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[400px] w-[1000px] accent-glow opacity-30" />
      )}
    </div>
  );
}

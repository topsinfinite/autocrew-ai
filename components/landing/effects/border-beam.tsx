"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BorderBeamProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  duration?: number;
  borderWidth?: number;
  colorFrom?: string;
  colorTo?: string;
}

export function BorderBeam({
  children,
  className,
  containerClassName,
  duration = 8,
  borderWidth = 1,
  colorFrom = "hsl(var(--primary))",
  colorTo = "transparent",
}: BorderBeamProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      {/* Animated border mask */}
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-[inherit]"
        style={{
          padding: `${borderWidth}px`,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      >
        <div
          className="absolute inset-[-100%] animate-spin-slow"
          style={{
            background: `conic-gradient(from 0deg, ${colorTo} 0deg 300deg, ${colorFrom} 360deg)`,
            animationDuration: `${duration}s`,
          }}
        />
      </div>

      {/* Content */}
      <div className={cn("relative", className)}>
        {children}
      </div>
    </div>
  );
}

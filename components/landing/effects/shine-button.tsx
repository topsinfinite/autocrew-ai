"use client";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { forwardRef, ComponentProps } from "react";
import { type VariantProps } from "class-variance-authority";

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

interface ShineButtonProps extends ButtonProps {
  shineColor?: string;
}

export const ShineButton = forwardRef<HTMLButtonElement, ShineButtonProps>(
  ({ className, children, shineColor = "rgba(255, 255, 255, 0.15)", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "shine-button relative overflow-hidden",
          // Default styling for primary CTA appearance
          "bg-foreground text-background hover:bg-foreground/80",
          "font-medium",
          className
        )}
        {...props}
      >
        {children}
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 hover:opacity-100"
          style={{
            background: `linear-gradient(90deg, transparent, ${shineColor}, transparent)`,
          }}
        />
      </Button>
    );
  }
);

ShineButton.displayName = "ShineButton";

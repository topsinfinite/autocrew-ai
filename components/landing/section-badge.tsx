import { cn } from "@/lib/utils";

interface SectionBadgeProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function SectionBadge({ children, icon, className }: SectionBadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full",
        "bg-[#FF6B35]/5 border border-[#FF6B35]/20",
        "text-xs font-medium text-[#FF6B35] font-space",
        className,
      )}
    >
      {icon ?? (
        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse shadow-[0_0_8px_rgba(255,107,53,0.4)]" />
      )}
      {children}
    </div>
  );
}

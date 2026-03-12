import { cn } from "@/lib/utils";
import { statsData } from "@/lib/mock-data/landing-data";

export function StatsSection() {
  return (
    <section className="relative z-10 py-12 sm:py-16 md:py-20 border-y border-foreground/[0.08] dark:border-white/[0.08] bg-foreground/[0.02] dark:bg-white/[0.02]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col items-center text-center",
                "animate-fade-up opacity-0",
              )}
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "forwards",
              }}
            >
              <div className="text-4xl sm:text-5xl font-bold font-space-grotesk text-foreground mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-[#FF6B35] uppercase tracking-wider font-space mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-muted-foreground font-geist">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

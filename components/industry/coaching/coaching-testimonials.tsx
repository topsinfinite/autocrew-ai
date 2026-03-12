import { cn } from "@/lib/utils";
import { SectionBadge } from "@/components/landing/section-badge";
import { coachingTestimonialsData } from "@/lib/mock-data/coaching-data";

export function CoachingTestimonials() {
  return (
    <section className="z-10 pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32 relative section-glow-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <SectionBadge className="mb-8">
            {coachingTestimonialsData.badge}
          </SectionBadge>

          <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6 font-space-grotesk font-semibold text-foreground">
            {coachingTestimonialsData.headline}
          </h2>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coachingTestimonialsData.items.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className={cn(
                "p-6 sm:p-8 rounded-2xl sm:rounded-3xl relative",
                "bg-foreground/[0.03] dark:bg-white/[0.02]",
                "border border-foreground/[0.08] dark:border-white/[0.08]",
                "hover:border-[#FF6B35]/20 transition-all duration-300",
                "animate-fade-up opacity-0",
              )}
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: "forwards",
              }}
            >
              {/* Decorative Quote Mark */}
              <div
                className="absolute top-4 right-6 text-7xl font-serif leading-none text-[#FF6B35]/10 pointer-events-none select-none"
                aria-hidden="true"
              >
                &ldquo;
              </div>

              {/* Quote */}
              <blockquote className="relative z-10 mb-8">
                <p className="text-base leading-relaxed font-geist text-foreground/90">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </blockquote>

              {/* Attribution */}
              <div className="flex items-center gap-3 relative z-10">
                {/* Avatar */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white font-space-grotesk",
                    `bg-gradient-to-br ${testimonial.avatarColor}`,
                  )}
                >
                  {testimonial.initials}
                </div>

                <footer>
                  <cite className="not-italic">
                    <p className="text-sm font-semibold font-space-grotesk text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-geist">
                      {testimonial.role}
                    </p>
                  </cite>
                </footer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

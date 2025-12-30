import { Plus, Brain, Rocket, TrendingUp, ArrowRight } from "lucide-react";
import { howItWorksData } from "@/lib/mock-data/landing-data";

// Icon map
const iconMap = {
  Plus,
  Brain,
  Rocket,
  TrendingUp,
};

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-32 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started with AutoCrew in four simple steps. No technical expertise required.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          {howItWorksData.map((step, index) => {
            const Icon = iconMap[step.icon as keyof typeof iconMap];
            const isLast = index === howItWorksData.length - 1;

            return (
              <div key={index} className="relative">
                <div className="flex flex-col md:flex-row gap-6 mb-12">
                  {/* Step Number & Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      {/* Number badge */}
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold shadow-lg">
                        {step.number}
                      </div>

                      {/* Connecting line */}
                      {!isLast && (
                        <div className="hidden md:block absolute left-8 top-20 w-0.5 h-24 bg-gradient-to-b from-primary to-border" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary">
                        {Icon && <Icon className="h-6 w-6" />}
                      </div>

                      {/* Text */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                        <p className="text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile connector arrow */}
                {!isLast && (
                  <div className="md:hidden flex justify-center mb-8">
                    <ArrowRight className="h-6 w-6 text-border rotate-90" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

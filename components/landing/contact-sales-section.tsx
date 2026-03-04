import Link from "next/link";
import { ArrowRight, FileText, CheckCircle2 } from "lucide-react";
import { SectionBadge } from "@/components/landing/section-badge";
import { Button } from "@/components/ui/button";
import { contactSalesData } from "@/lib/mock-data/landing-data";

export function ContactSalesSection() {
  return (
    <section
      id="contact-sales"
      className="relative z-10 section-divider section-glow-center pt-16 pb-16 sm:pt-24 sm:pb-24 md:pt-32 md:pb-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="rounded-3xl bg-foreground/[0.03] dark:bg-white/[0.02] border border-foreground/[0.08] dark:border-white/[0.08] overflow-hidden relative">
          {/* Medical/Tech Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          <div className="p-8 sm:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <SectionBadge className="mb-6">
                {contactSalesData.badge}
              </SectionBadge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground font-space-grotesk mb-6 tracking-tight">
                {contactSalesData.title}
              </h2>
              <p className="text-lg text-muted-foreground font-geist mb-8 leading-relaxed">
                {contactSalesData.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button variant="pill" size="pill-lg" className="group" asChild>
                  <Link href={contactSalesData.primaryCta.href}>
                    {contactSalesData.primaryCta.text}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </Button>
                <Button variant="pill-outline" size="pill-lg" asChild>
                  <Link href={contactSalesData.secondaryCta.href}>
                    <FileText className="w-4 h-4" />
                    {contactSalesData.secondaryCta.text}
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right Features List */}
            <div className="flex-1 w-full lg:w-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contactSalesData.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-xl bg-background/50 border border-foreground/[0.05] dark:border-white/[0.05] backdrop-blur-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FF6B35]/10 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6B35]" />
                    </div>
                    <span className="text-sm font-medium font-geist text-foreground">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

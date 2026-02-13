import Link from "next/link";
import { Users, Shield, Zap, Calendar, Mail, ArrowRight } from "lucide-react";
import { customPricingData } from "@/lib/mock-data/landing-data";

const iconMap = {
  Users,
  Shield,
  Zap,
};

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="relative z-10 border-t border-gray-200/10 dark:border-white/[0.06] pt-40 pb-40"
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-gray-400/20 dark:from-white/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#FF6B35]/5 blur-[120px] rounded-full pointer-events-none opacity-50" />

        {/* Header */}
        <div className="flex flex-col text-center mb-16 items-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF6B35]/20 bg-[#FF6B35]/5 text-[#FF6B35] text-xs font-medium mb-6 font-space">
            {customPricingData.badge}
          </div>
          <h2 className="text-4xl md:text-5xl tracking-tight mb-6 font-semibold text-gray-900 dark:text-white font-space-grotesk">
            {customPricingData.title}{" "}
            <span className="text-gray-400 dark:text-white/40">
              {customPricingData.subtitle}
            </span>
          </h2>
          <p className="text-lg leading-relaxed text-gray-500 dark:text-white/60 font-geist">
            {customPricingData.description}
          </p>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          {customPricingData.valueProps.map((prop, index) => {
            const Icon = iconMap[prop.icon as keyof typeof iconMap];
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-gray-50/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/[0.06] hover:border-[#FF6B35]/30 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 border border-[#FF6B35]/20 flex items-center justify-center mb-5 group-hover:shadow-[0_0_20px_-5px_rgba(255,107,53,0.4)] transition-all">
                  {Icon && <Icon className="w-6 h-6 text-[#FF6B35]" />}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white font-space-grotesk">
                  {prop.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-500 dark:text-white/50 font-geist">
                  {prop.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Trust Signal */}
        <div className="text-center mb-12">
          <p className="text-sm text-gray-400 dark:text-white/40 font-geist">
            {customPricingData.trustSignal}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col items-center gap-4">
          <Link
            href={customPricingData.primaryCta.href}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-black bg-[#FF6B35] hover:bg-[#FF6B35]/90 rounded-full py-3 px-8 transition-all duration-200 shadow-[0_0_20px_-5px_rgba(255,107,53,0.4)] font-space"
          >
            <Calendar className="w-4 h-4" />
            {customPricingData.primaryCta.text}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href={customPricingData.secondaryCta.href}
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-white/60 hover:text-[#FF6B35] transition-colors font-geist"
          >
            <Mail className="w-4 h-4" />
            {customPricingData.secondaryCta.text}
          </a>
        </div>

        {/* Tagline */}
        <div className="text-center mt-12">
          <p className="text-xs text-gray-400 dark:text-white/30 font-geist max-w-md mx-auto">
            {customPricingData.tagline}
          </p>
        </div>
      </div>
    </section>
  );
}

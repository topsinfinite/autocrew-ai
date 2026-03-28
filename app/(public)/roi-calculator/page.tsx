import type { Metadata } from "next";
import { TrendingUp } from "lucide-react";
import { RoiCalculator } from "@/components/landing/roi-calculator";
import { SectionBadge } from "@/components/landing/section-badge";
import { APP_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "ROI Calculator – See How Much You're Losing to Missed Calls",
  description:
    "Calculate the true cost of missed calls for your business. Healthcare, home services, legal, real estate, and more. See how AutoCrew AI voice agents recover lost revenue in minutes.",
  alternates: {
    canonical: "/roi-calculator",
  },
  openGraph: {
    title: "ROI Calculator – See How Much You're Losing to Missed Calls",
    description:
      "Calculate the true cost of missed calls. See how AutoCrew recovers lost revenue with AI voice agents. Free, instant, no credit card required.",
    url: `${APP_CONFIG.url}/roi-calculator`,
    siteName: APP_CONFIG.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROI Calculator – AutoCrew AI",
    description: "Calculate the true cost of missed calls and your revenue recovery potential.",
  },
};

export default function RoiCalculatorPage() {
  return (
    <section className="relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-[#FF6B35]/[0.04] blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-5">
            <SectionBadge icon={<TrendingUp className="w-3.5 h-3.5" />}>
              Free ROI Calculator
            </SectionBadge>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-space-grotesk tracking-tight text-foreground mb-4 leading-[1.1]">
            How much are missed calls{" "}
            <span className="text-[#FF6B35] relative">
              costing you?
              <span className="hidden sm:block absolute bottom-1 left-0 w-full h-3 bg-[#FF6B35]/10 -skew-x-3 -z-10 rounded-sm" />
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every unanswered call is a booking, appointment, or sale that never happened. Use our
            calculator to see exactly how much you&apos;re leaving on the table — and your recovery
            potential with AutoCrew AI voice agents.
          </p>
        </div>

        {/* Calculator */}
        <RoiCalculator />

        {/* Trust signals */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            HIPAA-compliant AI voice agents
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            85% average call capture rate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            Works 24 / 7
          </span>
        </div>
      </div>
    </section>
  );
}

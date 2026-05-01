import Link from "next/link";
import { getCategory } from "@/lib/blog/categories";

interface IndustryCTAProps {
  categories: string[];
}

const INDUSTRY_CATS = ["healthcare", "coaching", "legal", "restaurants"];

const CTA_COPY: Record<string, { headline: string; sub: string }> = {
  healthcare: {
    headline: "See how Autocrew works for healthcare practices",
    sub: "HIPAA-aware AI crews for medical and dental offices — after-hours coverage, appointment booking, and patient intake.",
  },
  coaching: {
    headline: "See how Autocrew works for coaches",
    sub: "AI crews that handle reminders, rescheduling, and new client intake so you can stay focused on the work that matters.",
  },
  legal: {
    headline: "See how Autocrew works for law firms",
    sub: "After-hours intake, lead qualification, and consultation booking — without giving legal advice.",
  },
  restaurants: {
    headline: "See how Autocrew works for restaurants",
    sub: "Reservation booking, overflow call handling, and special-request capture for busy dining rooms.",
  },
};

export function IndustryCTA({ categories }: IndustryCTAProps) {
  const industryCat = categories.find((c) => INDUSTRY_CATS.includes(c));
  if (!industryCat) return null;

  const cat = getCategory(industryCat);
  if (!cat?.industryRoute) return null;

  const copy = CTA_COPY[industryCat];
  if (!copy) return null;

  return (
    <section className="mt-16 bg-[hsl(20,26%,8%)] p-8 lg:p-12 flex flex-col lg:flex-row lg:items-center gap-6">
      <div className="flex-1">
        <p className="font-display text-xl lg:text-2xl font-semibold text-[hsl(40,35%,94%)] leading-snug mb-2">
          {copy.headline}
        </p>
        <p className="text-sm font-sans text-[hsl(40,35%,75%)] leading-relaxed">
          {copy.sub}
        </p>
      </div>
      <Link
        href={cat.industryRoute}
        className="flex-shrink-0 bg-[hsl(16,100%,60%)] text-white font-sans font-semibold px-6 py-3 hover:bg-[hsl(16,100%,52%)] transition-colors text-sm"
      >
        Learn more →
      </Link>
    </section>
  );
}

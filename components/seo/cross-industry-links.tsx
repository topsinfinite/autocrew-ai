import Link from "next/link";

const industries = [
  {
    name: "Coaching",
    href: "/industry/coaching",
    description: "AI scheduling, client intake, and follow-ups for coaches",
  },
  {
    name: "Restaurants",
    href: "/industry/restaurant",
    description:
      "AI reservations, guest communication, and operations for restaurants",
  },
  {
    name: "Legal",
    href: "/industry/legal",
    description:
      "AI intake, case communication, and operations for legal professionals",
  },
  {
    name: "Healthcare",
    href: "/",
    description:
      "AI scheduling, patient communication, and operations for healthcare providers",
  },
];

interface CrossIndustryLinksProps {
  currentIndustry: string;
}

export function CrossIndustryLinks({
  currentIndustry,
}: CrossIndustryLinksProps) {
  const otherIndustries = industries.filter((i) => i.name !== currentIndustry);

  if (otherIndustries.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-semibold font-space-grotesk text-foreground text-center mb-8">
          Autocrew for Other Industries
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {otherIndustries.map((industry) => (
            <Link
              key={industry.href}
              href={industry.href}
              className="p-6 rounded-2xl border border-foreground/[0.08] dark:border-white/[0.08] bg-foreground/[0.03] dark:bg-white/[0.02] hover:border-[#FF6B35]/20 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold font-space-grotesk text-foreground mb-2">
                {industry.name}
              </h3>
              <p className="text-sm text-muted-foreground font-geist">
                {industry.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

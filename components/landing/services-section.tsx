import { Headphones, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { servicesData } from "@/lib/mock-data/landing-data";
import Link from "next/link";

// Icon map
const iconMap = {
  Headphones,
  Sparkles,
};

export function ServicesSection() {
  return (
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            AI Crews for Every Need
          </h2>
          <p className="text-lg text-muted-foreground">
            Deploy specialized AI crews designed for customer support and lead generation.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {servicesData.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];

            return (
              <div
                key={index}
                className="relative bg-card border border-border rounded-2xl p-8 hover:shadow-xl transition-all duration-300 group"
              >
                {/* Badge */}
                <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4">
                  {service.type}
                </div>

                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground mb-4">
                  {Icon && <Icon className="h-7 w-7" />}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={`/docs/${service.type.toLowerCase()}-crew`}>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Learn More
                  </Button>
                </Link>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

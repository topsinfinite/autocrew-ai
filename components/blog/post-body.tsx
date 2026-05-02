import { MDXRemote } from "next-mdx-remote/rsc";
import { MDX_OPTIONS } from "@/lib/blog/mdx-options";
import { AEOSummary } from "./aeo-summary";
import { RoiCalculatorEmbed } from "@/components/roi-calculator/roi-calculator-embed";

const components = {
  AEOSummary,
  RoiCalculator: RoiCalculatorEmbed,
  // Callout shortcode: <Callout type="tip">...</Callout>
  Callout: ({
    type = "info",
    children,
  }: {
    type?: "info" | "tip" | "warning";
    children: React.ReactNode;
  }) => {
    const styles = {
      info: "bg-[hsl(199,89%,96%)] border-l-4 border-[hsl(199,89%,48%)]",
      tip: "bg-[hsl(142,71%,95%)] border-l-4 border-[hsl(142,71%,42%)]",
      warning: "bg-[hsl(38,92%,94%)] border-l-4 border-[hsl(38,92%,50%)]",
    };
    return (
      <div
        className={`${styles[type]} px-5 py-4 my-6 text-[hsl(20,26%,8%)] font-newsreader text-[17px] leading-relaxed`}
      >
        {children}
      </div>
    );
  },
  // Pull-quote: <PullQuote>...</PullQuote>
  PullQuote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="my-8 px-6 py-4 bg-[hsl(18,100%,92%)] border-l-4 border-[hsl(16,100%,60%)] font-newsreader text-xl italic text-[hsl(20,26%,12%)] leading-relaxed">
      {children}
    </blockquote>
  ),
  // Widget CTA shortcode
  WidgetCTA: () => (
    <div className="my-8 border border-[rgba(26,20,16,0.12)] p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-1">
        <p className="font-display font-semibold text-lg text-[hsl(20,26%,8%)] mb-1">
          See it in action
        </p>
        <p className="text-sm font-sans text-[hsl(25,10%,32%)]">
          Autocrew's AI crews handle calls 24/7. Try a live demo — no signup
          required.
        </p>
      </div>
      <a
        href="https://app.autocrew-ai.com/signup"
        className="flex-shrink-0 bg-[hsl(16,100%,60%)] text-white font-sans font-semibold text-sm px-5 py-2.5 hover:bg-[hsl(16,100%,52%)] transition-colors"
      >
        Try free →
      </a>
    </div>
  ),
};

export function PostBody({ content }: { content: string }) {
  return (
    <div className="prose-blog max-w-none">
      <MDXRemote
        source={content}
        options={MDX_OPTIONS}
        components={components}
      />
    </div>
  );
}

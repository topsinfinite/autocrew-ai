"use client";

import { useState } from "react";
import type { FAQItem } from "@/lib/blog/types";

interface PostFAQProps {
  faqs: FAQItem[];
}

function FAQEntry({ faq, index }: { faq: FAQItem; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-[rgba(26,20,16,0.12)] last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-5 text-left font-display font-semibold text-[18px] text-[hsl(20,26%,8%)] hover:text-[hsl(16,100%,50%)] transition-colors"
        aria-expanded={open}
        id={`faq-${index}`}
      >
        <span>{faq.q}</span>
        <span
          className="flex-shrink-0 mt-0.5 text-lg text-[hsl(25,10%,45%)]"
          aria-hidden="true"
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div
          role="region"
          aria-labelledby={`faq-${index}`}
          className="font-newsreader text-[17px] text-[hsl(25,10%,28%)] leading-relaxed pb-5"
        >
          {faq.a}
        </div>
      )}
    </div>
  );
}

export function PostFAQ({ faqs }: PostFAQProps) {
  if (!faqs.length) return null;

  return (
    <section className="mt-16 pt-10 border-t border-[rgba(26,20,16,0.12)]">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-[hsl(20,26%,8%)] mb-8">
        Frequently asked questions
      </h2>
      <div>
        {faqs.map((faq, i) => (
          <FAQEntry key={i} faq={faq} index={i} />
        ))}
      </div>
    </section>
  );
}

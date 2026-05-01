interface AEOSummaryProps {
  summary: string;
}

export function AEOSummary({ summary }: AEOSummaryProps) {
  return (
    <aside
      aria-label="Article summary"
      className="bg-[hsl(18,100%,92%)] border-l-4 border-[hsl(16,100%,60%)] px-6 py-5 mb-10 rounded-none"
    >
      <p className="text-xs font-medium tracking-[0.1em] uppercase text-[hsl(16,100%,50%)] font-sans mb-2">
        TL;DR
      </p>
      <p className="font-newsreader text-[17px] text-[hsl(20,26%,12%)] leading-relaxed">
        {summary}
      </p>
    </aside>
  );
}

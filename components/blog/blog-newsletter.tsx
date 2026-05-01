"use client";

import { useState } from "react";

export function BlogNewsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    try {
      const res = await fetch("/api/newsletter-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, utm_source: "blog", utm_medium: "newsletter-form", utm_campaign: "blog-footer" }),
      });
      if (!res.ok) throw new Error("Request failed");
      setState("success");
    } catch {
      setErrorMsg("Something went wrong. Please try again.");
      setState("error");
    }
  }

  return (
    <section className="py-16 border-t border-[rgba(26,20,16,0.12)]">
      <div className="max-w-xl">
        <p className="text-[11px] font-medium tracking-[0.1em] uppercase text-[hsl(16,100%,50%)] font-sans mb-3">
          Newsletter
        </p>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-[hsl(20,26%,8%)] mb-2">
          Field notes on AI automation, delivered weekly
        </h2>
        <p className="font-newsreader text-base text-[hsl(25,10%,32%)] mb-6">
          Practical guides, industry case studies, and new post notifications. No spam. Unsubscribe anytime.
        </p>

        {state === "success" ? (
          <p className="font-sans text-sm text-[hsl(142,71%,35%)] font-medium">
            You're in. Check your inbox for a confirmation.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-0">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 border border-[rgba(26,20,16,0.2)] border-r-0 px-4 py-2.5 text-sm font-sans bg-transparent text-[hsl(20,26%,8%)] placeholder:text-[hsl(25,10%,55%)] focus:outline-none focus:border-[hsl(20,26%,8%)]"
            />
            <button
              type="submit"
              disabled={state === "loading"}
              className="bg-[hsl(20,26%,8%)] text-[hsl(40,35%,94%)] font-sans font-semibold text-sm px-5 py-2.5 hover:bg-[hsl(16,100%,50%)] transition-colors disabled:opacity-50"
            >
              {state === "loading" ? "Subscribing…" : "Subscribe"}
            </button>
          </form>
        )}
        {state === "error" && (
          <p className="mt-2 text-xs text-red-600 font-sans">{errorMsg}</p>
        )}
      </div>
    </section>
  );
}

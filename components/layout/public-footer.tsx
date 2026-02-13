"use client";

import { footerData } from "@/lib/mock-data/landing-data";

export function PublicFooter() {
  return (
    <footer className="border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm text-muted-foreground/70">
          {footerData.copyright}
        </p>
      </div>
    </footer>
  );
}

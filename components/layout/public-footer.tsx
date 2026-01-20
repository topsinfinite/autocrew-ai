"use client";

import { footerData } from "@/lib/mock-data/landing-data";

export function PublicFooter() {
  return (
    <footer className="border-t border-white/[0.06] py-12">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm text-white/30">
          {footerData.copyright}
        </p>
      </div>
    </footer>
  );
}

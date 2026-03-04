import type { Metadata } from "next";
import { PublicNav } from "@/components/layout/public-nav";
import { PublicFooter } from "@/components/layout/public-footer";

export const metadata: Metadata = {
  title: "Design System | AutoCrew",
  description:
    "AutoCrew design tokens, typography, colors, spacing, effects, and component reference.",
};

export default function DesignSystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNav />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </div>
    </div>
  );
}

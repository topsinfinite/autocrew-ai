import { PublicNav } from "@/components/layout/public-nav";
import { PublicFooter } from "@/components/layout/public-footer";
import { BackgroundEffects } from "@/components/landing/background-effects";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background effects layer */}
      <BackgroundEffects showGrid={false} />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNav />
        <main className="flex-1">{children}</main>
        <PublicFooter />
      </div>
    </div>
  );
}

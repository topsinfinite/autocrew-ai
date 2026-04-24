import { PublicNav } from "@/components/layout/public-nav";
import { PublicFooter } from "@/components/layout/public-footer";
import { PhoneCallFab } from "@/components/layout/phone-call-fab";
import { BackgroundEffects } from "@/components/landing/background-effects";
import { ContextualAIProvider } from "@/components/contextual-ai";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen flex flex-col">
      <BackgroundEffects showGrid={false} />

      <div className="relative z-10 flex flex-col min-h-screen">
        <PublicNav />
        <ContextualAIProvider>
          <main id="main-content" className="flex-1">
            {children}
          </main>
        </ContextualAIProvider>
        <PublicFooter />
        <PhoneCallFab />
      </div>
    </div>
  );
}

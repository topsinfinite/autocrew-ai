import { Suspense } from "react";

import { UnlockForm } from "@/components/welcome-composer/unlock-form";

export default function InternalUnlockPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Loading…</p>}>
        <UnlockForm />
      </Suspense>
    </main>
  );
}

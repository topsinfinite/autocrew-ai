import type { Metadata } from "next";

import { WelcomeComposerClient } from "@/components/welcome-composer/welcome-composer-client";

export const metadata: Metadata = {
  title: "Welcome Composer — Autocrew Internal",
  robots: { index: false, follow: false },
};

export default function WelcomeComposerPage() {
  return (
    <WelcomeComposerClient frictionLogHref="https://github.com/topsinfinite/autocrew-marketing/blob/main/docs/post-sale-friction.md" />
  );
}

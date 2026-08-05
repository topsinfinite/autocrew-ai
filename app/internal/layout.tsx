import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Internal — Autocrew",
  robots: { index: false, follow: false },
};

export default function InternalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#03060e] text-foreground" data-theme="dark">
      {children}
    </div>
  );
}

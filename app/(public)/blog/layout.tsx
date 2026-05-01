import { Newsreader } from "next/font/google";
import type { Metadata } from "next";
import { APP_CONFIG } from "@/lib/constants";
import { BlogNav } from "@/components/blog/blog-nav";
import { BlogFooter } from "@/components/blog/blog-footer";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Autocrew Journal — AI Automation, Voice Agents & Industry Insights",
    template: "%s | Autocrew Journal",
  },
  description:
    "Field notes from Autocrew on AI automation, voice agents, and industry-specific workflows for healthcare, coaching, legal, and restaurants.",
  openGraph: {
    type: "website",
    siteName: APP_CONFIG.name,
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme="cream"
      className={`${newsreader.variable} min-h-screen flex flex-col`}
    >
      <BlogNav />
      <main className="flex-1">{children}</main>
      <BlogFooter />
    </div>
  );
}

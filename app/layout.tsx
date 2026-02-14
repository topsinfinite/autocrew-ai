import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { APP_CONFIG } from "@/lib/constants";

// Display font - Space Grotesk
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Monospace font - Space Mono
const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "700"],
  display: "swap",
});

const baseUrl = APP_CONFIG.url;

export const viewport: Viewport = {
  themeColor: "#03060e",
};

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "AutoCrew – Agentic Crews Management Platform",
    template: "%s | AutoCrew",
  },
  description:
    "Deploy AI crews that automate customer support and lead generation 24/7. No code required. Trusted by teams of all sizes. Start free.",
  keywords: [
    "AI automation",
    "agentic crews",
    "customer support automation",
    "lead generation",
    "AI crews",
    "no code",
    "B2B automation",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName: "AutoCrew",
    title: "AutoCrew – Agentic Crews Management Platform",
    description:
      "Deploy AI crews that automate customer support and lead generation 24/7. No code required. Trusted by teams of all sizes. Start free.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "AutoCrew" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoCrew – Agentic Crews Management Platform",
    description:
      "Deploy AI crews that automate customer support and lead generation 24/7. No code required. Trusted by teams of all sizes. Start free.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark" style={{ colorScheme: "dark" } as React.CSSProperties}>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${spaceGrotesk.variable} ${spaceMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

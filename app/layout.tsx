import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import { GeistSans, GeistMono } from "geist/font";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { APP_CONFIG } from "@/lib/constants";
import { JsonLd } from "@/components/seo/json-ld";
import { organizationSchema, websiteSchema } from "@/lib/seo/schemas";

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
    "HIPAA AI voice agents",
    "healthcare AI automation",
    "AI customer support chatbot",
    "automated lead qualification",
    "voice AI for healthcare",
    "AI crew management platform",
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
    images: [
      {
        url: `${baseUrl}/images/og-image.png?v=2`,
        width: 1200,
        height: 630,
        alt: "AutoCrew – AI-Powered Crews That Work 24/7",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoCrew – Agentic Crews Management Platform",
    description:
      "Deploy AI crews that automate customer support and lead generation 24/7. No code required. Trusted by teams of all sizes. Start free.",
    images: [`${baseUrl}/images/og-image.png?v=2`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="dark"
      style={{ colorScheme: "dark" } as React.CSSProperties}
    >
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${spaceGrotesk.variable} ${spaceMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-9999 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none"
        >
          Skip to main content
        </a>
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
        <Script id="autocrew-config" strategy="beforeInteractive">
          {`window.AutoCrewConfig = {
            crewCode: 'AUTOCREW-001-SUP-001',
            configUrl: 'https://app.autocrew-ai.com/api/widget/config'
          };`}
        </Script>
        <Script
          src="https://app.autocrew-ai.com/widget.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Instrument_Serif, DM_Mono } from "next/font/google";
import "./decks.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AutoCrew Decks",
  robots: { index: false, follow: false },
};

export default function DeckLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-surface="deck"
      className={`${instrumentSerif.variable} ${dmMono.variable}`}
    >
      {children}
    </div>
  );
}

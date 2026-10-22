import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Curtain from "@/components/Curtain";
import Duotone from "@/components/Duotone";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Small descriptive type
const pragmatica = localFont({
  variable: "--font-pragmatica",
  src: [
    { path: "../fonts/PragmaticaExtended-Book.otf", weight: "400", style: "normal" },
    { path: "../fonts/PragmaticaExtended-Bold.otf", weight: "700", style: "normal" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://avorio-kappa.vercel.app"),
  title: { default: "Avorio — Hand-tempered white chocolate", template: "%s — Avorio" },
  description:
    "White chocolate made only from the butter of the cacao bean, Bourbon vanilla and slow milk. Tempered by hand in Firenze.",
};

export const viewport: Viewport = {
  themeColor: "#6a0c6f",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${instrumentSerif.variable} ${pragmatica.variable} antialiased`}>
      <body>
        <SmoothScroll>
          <Nav />
          {children}
          <Curtain />
        </SmoothScroll>
        <Cursor />
        <Duotone />
      </body>
    </html>
  );
}

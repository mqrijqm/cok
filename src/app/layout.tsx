import type { Metadata, Viewport } from "next";
import { Figtree, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Avorio — Hand-tempered white chocolate",
  description:
    "Ivory-pale white chocolate with 38% cocoa butter and Bourbon vanilla, tempered by hand in Firenze and wrapped like a painting.",
};

export const viewport: Viewport = {
  themeColor: "#140f0b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${figtree.variable} ${jetbrainsMono.variable} antialiased`}
    >
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <Cursor />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}

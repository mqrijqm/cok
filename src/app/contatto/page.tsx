import type { Metadata } from "next";
import ContattoView from "@/components/page/ContattoView";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contatto",
  description: "Book a tasting at the atelier in Firenze, order a box for an occasion, or write to us.",
};

export default function ContattoPage() {
  return (
    <>
      <main>
        <ContattoView />
      </main>
      <Footer />
    </>
  );
}

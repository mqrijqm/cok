import type { Metadata } from "next";
import CollectionIndex from "@/components/page/CollectionIndex";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "La collezione",
  description: "Five white chocolate editions, five Renaissance portraits: La Dama, La Devota, Ofelia, La Tentazione and La Maddalena.",
};

export default function CollezionePage() {
  return (
    <>
      <main>
        <CollectionIndex />
      </main>
      <Footer />
    </>
  );
}

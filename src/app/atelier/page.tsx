import type { Metadata } from "next";
import AtelierView from "@/components/page/AtelierView";
import Footer from "@/components/Footer";
import FlyingLayer from "@/components/FlyingLayer";
import { whileVisible } from "@/lib/flyZones";

export const metadata: Metadata = {
  title: "Atelier",
  description: "A small workshop in Oltrarno, Firenze: a slab of Carrara marble, five ingredients and two pairs of hands.",
};

export default function AtelierPage() {
  return (
    <>
      <main>
        <AtelierView />
      </main>
      <Footer />
      <FlyingLayer zones={[whileVisible("#atelier-hero"), whileVisible("#contatto")]} />
    </>
  );
}
